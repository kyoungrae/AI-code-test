package com.system.common.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.system.common.util.userinfo.UserInfo;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

/**
 * CRUD 감사 로그 인터셉터
 * INSERT, UPDATE, DELETE 수행 시 COM_EVENT_LOG 테이블에 로그를 남깁니다.
 */
@Intercepts({
        @Signature(type = Executor.class, method = "update", args = { MappedStatement.class, Object.class })
})
public class EventLogInterceptor implements Interceptor {
    private static final Logger logger = LoggerFactory.getLogger(EventLogInterceptor.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        MappedStatement ms = (MappedStatement) invocation.getArgs()[0];
        Object parameter = invocation.getArgs()[1];

        // 1. 감사 로그 자체가 다시 기록되는 무한 루프 방지
        if (ms.getId().contains("ComEventLog")) {
            return invocation.proceed();
        }

        // 2. 원래 쿼리 실행
        Object result = invocation.proceed();

        // 3. 로그 기록
        try {
            saveEventLog(invocation, ms, parameter);
        } catch (Exception e) {
            // 메인 비즈니스 로직에 영향을 주지 않도록 예외 처리
            logger.error("EventLogInterceptor Error: ", e);
        }

        return result;
    }

    private void saveEventLog(Invocation invocation, MappedStatement ms, Object parameter) {
        String actionType = ms.getSqlCommandType().name();
        String targetTable = extractTableName(ms);
        String userEmail = "";
        String userRoles = "";
        String ipAddress = "";
        String targetId = "";

        try {
            userEmail = UserInfo.getUserEmail();
            userRoles = UserInfo.getUserRoles();

            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = request.getRemoteAddr();
            }

            // parameter 객체에서 id 추출 시도
            if (parameter instanceof Map) {
                Object idObj = ((Map<?, ?>) parameter).get("id");
                targetId = idObj != null ? idObj.toString() : "";
            } else if (parameter != null) {
                try {
                    Field idField = findField(parameter.getClass(), "id");
                    if (idField != null) {
                        idField.setAccessible(true);
                        Object idObj = idField.get(parameter);
                        targetId = idObj != null ? idObj.toString() : "";
                    }
                } catch (Exception e) {
                    // ignore
                }
            }
        } catch (Exception e) {
            // ignore
        }

        Map<String, Object> logData = new HashMap<>();
        logData.put("id", UUID.randomUUID().toString());
        logData.put("user_id", userEmail);
        logData.put("email", userEmail);
        logData.put("role", userRoles);
        logData.put("action_type", actionType);
        logData.put("target_table", targetTable);
        logData.put("target_id", targetId);
        logData.put("ip_address", ipAddress);

        try {
            if (parameter != null) {
                logData.put("after_data", objectMapper.writeValueAsString(parameter));
            }
        } catch (Exception e) {
            logData.put("after_data", parameter != null ? parameter.toString() : "");
        }

        // MyBatis Executor를 사용하여 직접 INSERT 수행
        Executor executor = (Executor) invocation.getTarget();
        MappedStatement insertMs = ms.getConfiguration()
                .getMappedStatement("com.system.common.eventlog.ComEventLogMapper.INSERT");

        try {
            executor.update(insertMs, logData);
        } catch (Exception e) {
            logger.error("EventLog INSERT failed: ", e);
        }
    }

    private String extractTableName(MappedStatement ms) {
        String id = ms.getId();
        String[] parts = id.split("\\.");
        if (parts.length > 1) {
            // Mapper 클래스 이름에서 테이블명을 추측 (예: ComUserMapper -> ComUser)
            String mapperName = parts[parts.length - 2];
            return mapperName.replace("Mapper", "");
        }
        return "UNKNOWN";
    }

    private Field findField(Class<?> clazz, String fieldName) {
        Class<?> currentClass = clazz;
        while (currentClass != null) {
            try {
                return currentClass.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                currentClass = currentClass.getSuperclass();
            }
        }
        return null;
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
    }
}
