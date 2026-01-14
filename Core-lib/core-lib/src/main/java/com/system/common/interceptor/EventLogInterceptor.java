package com.system.common.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.system.common.util.userinfo.UserInfo;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * CRUD 감사 로그 인터셉터
 * INSERT, UPDATE, DELETE 수행 시 COM_EVENT_LOG 테이블에 로그를 남깁니다.
 */
@Component
@Intercepts({
        @Signature(type = Executor.class, method = "update", args = { MappedStatement.class, Object.class })
})
public class EventLogInterceptor implements Interceptor {
    private static final Logger logger = LoggerFactory.getLogger(EventLogInterceptor.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 로그 저장을 위한 전용 스레드 풀 (메인 비즈니스 로직에 영향을 주지 않음)
    private final ExecutorService logExecutor = Executors.newFixedThreadPool(5);

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        MappedStatement ms = (MappedStatement) invocation.getArgs()[0];
        Object parameter = invocation.getArgs()[1];

        // 1. 감사 로그 자체가 다시 기록되는 무한 루프 방지
        if (ms.getId().contains("ComEventLog")) {
            return invocation.proceed();
        }

        String actionType = ms.getSqlCommandType().name();
        String beforeData = null;

        // 2. UPDATE/DELETE의 경우 실행 전 데이터를 조회하여 저장
        if ("UPDATE".equals(actionType) || "DELETE".equals(actionType)) {
            beforeData = captureBeforeData(invocation, ms, parameter);
        }

        // 3. 원래 쿼리 실행
        Object result = invocation.proceed();

        // 4. 로그 기록
        try {
            saveEventLog(invocation, ms, parameter, beforeData);
        } catch (Exception e) {
            logger.error("EventLogInterceptor Error: ", e);
        }

        return result;
    }

    private String captureBeforeData(Invocation invocation, MappedStatement ms, Object parameter) {
        try {
            String selectMapperId = ms.getId().substring(0, ms.getId().lastIndexOf(".") + 1) + "SELECT";

            // 해당 매퍼에 SELECT 문이 있는지 확인
            if (!ms.getConfiguration().hasStatement(selectMapperId)) {
                return null;
            }

            MappedStatement selectMs = ms.getConfiguration().getMappedStatement(selectMapperId);
            Executor executor = (Executor) invocation.getTarget();

            // ID 값만 있는 파라미터 맵 생성 (조회를 위해)
            Map<String, Object> queryParam = new HashMap<>();
            String targetId = extractIdFromParameter(parameter);
            if (targetId == null || targetId.isEmpty())
                return null;

            queryParam.put("id", targetId);

            // 데이터 조회 실행
            java.util.List<Object> list = executor.query(selectMs, queryParam,
                    org.apache.ibatis.session.RowBounds.DEFAULT, Executor.NO_RESULT_HANDLER);
            if (list != null && !list.isEmpty()) {
                return objectMapper.writeValueAsString(list.get(0));
            }
        } catch (Exception e) {
            logger.warn("Failed to capture before_data: " + e.getMessage());
        }
        return null;
    }

    private String extractIdFromParameter(Object parameter) {
        if (parameter instanceof Map) {
            Object idObj = ((Map<?, ?>) parameter).get("id");
            return idObj != null ? idObj.toString() : "";
        } else if (parameter != null) {
            try {
                Field idField = findField(parameter.getClass(), "id");
                if (idField != null) {
                    idField.setAccessible(true);
                    Object idObj = idField.get(parameter);
                    return idObj != null ? idObj.toString() : "";
                }
            } catch (Exception e) {
                // ignore
            }
        }
        return "";
    }

    private void saveEventLog(Invocation invocation, MappedStatement ms, Object parameter, String beforeData)
            throws Exception {
        // 비동기 실행을 위해 필요한 데이터들을 로컬 변수로 확정(effectively final)
        final String actionType = ms.getSqlCommandType().name();
        final String targetTable = extractTableName(ms);
        final String targetId = extractIdFromParameter(parameter);

        // IP 주소 추출
        String extractedIp = "";
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                extractedIp = attributes.getRequest().getRemoteAddr();
            }
        } catch (Exception e) {
        }
        final String ipAddress = extractedIp;

        final String userEmail = UserInfo.getUserEmail();
        final String userRoles = UserInfo.getUserRoles();

        // 실제 저장은 스레드 풀에서 비동기로 처리 (성능 최적화 핵심)
        logExecutor.execute(() -> {
            try {
                Map<String, Object> logData = new HashMap<>();
                logData.put("id", UUID.randomUUID().toString().replace("-", ""));
                logData.put("user_id", userEmail);
                logData.put("email", userEmail);
                logData.put("role", userRoles);
                logData.put("action_type", actionType);
                logData.put("target_table", targetTable);
                logData.put("target_id", targetId);
                logData.put("ip_address", ipAddress);
                logData.put("before_data", beforeData);

                try {
                    if (parameter != null) {
                        logData.put("after_data", objectMapper.writeValueAsString(parameter));
                    }
                } catch (Exception e) {
                    logData.put("after_data", parameter != null ? parameter.toString() : "");
                }

                // Executor를 통한 INSERT
                Executor executor = (Executor) invocation.getTarget();
                MappedStatement insertMs = ms.getConfiguration()
                        .getMappedStatement("com.system.common.eventlog.ComEventLogMapper.INSERT");
                executor.update(insertMs, logData);

            } catch (Exception e) {
                logger.error("Async EventLog INSERT failed: ", e);
            }
        });
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
