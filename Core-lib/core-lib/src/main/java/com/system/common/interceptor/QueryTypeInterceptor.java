package com.system.common.interceptor;

import com.system.common.annotation.RemoveHypen;
import com.system.common.annotation.StringToIntegerRemoveComma;
import com.system.common.enumlist.InterCeptorRemoveDataValueTransformFieldNameList;
import com.system.common.util.DateUtil;
import com.system.common.util.userinfo.UserInfo;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.binding.MapperMethod;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Signature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Properties;

/*
 * writer : 이경태
 * text : 파라미터 가공 처리 interceptor
 * */
@Intercepts({
        @Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class, Integer.class})
})
public class QueryTypeInterceptor implements Interceptor {
    private static final Logger logger = LoggerFactory.getLogger(QueryTypeInterceptor.class);
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        StatementHandler statementHandler = (StatementHandler) invocation.getTarget();
        BoundSql boundSql = statementHandler.getBoundSql();
        String sql = boundSql.getSql().toLowerCase().trim();
//        System.out.println(boundSql.getParameterObject());
        if(boundSql.getParameterObject() != null){
//            logger.debug(boundSql.getParameterObject().toString());
        }
        // Create system authUser ID
//        UserInfo userInfo = new UserInfo();
        String userEmail = UserInfo.getUserEmail();
        if (sql.startsWith("select")) {
            Object parameterObject = boundSql.getParameterObject();
            if (parameterObject != null) {
                applyTransformations(parameterObject);
            }
        } else if (sql.startsWith("insert")) {
            Object parameterObject = boundSql.getParameterObject();
            if (parameterObject != null) {
                applyTransformations(parameterObject);
                if(userEmail != null){
                    Date systemDateTime = DateUtil.getServerTimeTypeDate();
                    modifyField(parameterObject, "system_create_userid", userEmail);
                    modifyFieldDate(parameterObject, "system_create_date", systemDateTime);
                }
            }
        } else if (sql.startsWith("update")) {
            Object parameterObject = boundSql.getParameterObject();
            if (parameterObject != null) {
                applyTransformations(parameterObject);
                if(userEmail != null){
                    if (parameterObject instanceof MapperMethod.ParamMap<?> paramMap) {
                        paramMap.values().stream()
                                .filter(value -> value instanceof List<?>)
                                .map(value -> (List<?>) value)
                                .forEach(list -> list.forEach(obj -> modifyField(obj, "system_update_userid", userEmail)));
                    } else{
                        modifyField(parameterObject, "system_update_userid", userEmail);
                    }
                }
            }
        } else if (sql.startsWith("merge")) {  //oracle upsert용
            Object parameterObject = boundSql.getParameterObject();
            if (parameterObject != null) {
                applyTransformations(parameterObject);
                if(userEmail != null){
                    modifyField(parameterObject, "system_create_userid", userEmail);
                    modifyField(parameterObject, "system_update_userid", userEmail);
                }
            }
        }
        return invocation.proceed();
    }

    private void applyTransformations(Object obj) throws Exception {
        Class<?> clazz = obj.getClass();

        // 상위 클래스 필드도 포함하여 반복문을 통해 필드를 처리합니다.
        while (clazz != null) {
            Field[] fields = clazz.getDeclaredFields();
            for (Field field : fields) {
                InterCeptorRemoveDataValueTransformFieldNameList enumConstant = findRemoveEnumConstant(field.getName());
                if (enumConstant != null) {
                    // enum 상수에서 어노테이션 검사
                    checkAndApplyAnnotation(obj, field, enumConstant);
                }
            }
            // 상위 클래스로 이동합니다.
            clazz = clazz.getSuperclass();
        }
    }
    //Remove Annotation
    private static InterCeptorRemoveDataValueTransformFieldNameList findRemoveEnumConstant(String fieldName) {
        for (InterCeptorRemoveDataValueTransformFieldNameList constant : InterCeptorRemoveDataValueTransformFieldNameList.values()) {
            if (constant.name().equals(fieldName)) {
                return constant;
            }
        }
        return null;
    }
    //데이터 가공 [삭제]
    private static void checkAndApplyAnnotation(Object obj, Field field, InterCeptorRemoveDataValueTransformFieldNameList enumConstant) throws Exception {
        Class<?> enumClass = enumConstant.getClass();

        for (Annotation annotation : enumClass.getField(enumConstant.name()).getAnnotations()) {
            if (annotation instanceof RemoveHypen) {
                field.setAccessible(true);
                Object value = field.get(obj);
                if (value != null) {
                    String newValue = value.toString().replaceAll("-", "");
                    field.set(obj, newValue);
                }
            }else if(annotation instanceof StringToIntegerRemoveComma){
                field.setAccessible(true);
                Object value = field.get(obj);
                if (value != null) {
                    String newValue = value.toString().replaceAll(",", "");
                    int intValue = Integer.parseInt(newValue);
                    field.set(obj, intValue);
                }
            }
            // Add other annotation checks as needed
        }
    }

    private void modifyField(Object obj, String fieldName, String value) {
        try {
            Field field = findField(obj.getClass(), fieldName);
            if (field != null) {
                field.setAccessible(true);
                field.set(obj, value);
            }
        } catch (NoSuchFieldException e) {
            // 필드가 존재하지 않을 경우의 처리
//            System.err.println("Field '" + fieldName + "' not found: " + e.getMessage());
        } catch (IllegalAccessException e) {
            // 접근 예외 처리
//            System.err.println("Error accessing field '" + fieldName + "': " + e.getMessage());
        }
    }
    private void modifyFieldDate(Object obj, String fieldName, Date value) {
        try {
            Field field = findField(obj.getClass(), fieldName);
            if (field != null) {
                field.setAccessible(true);
                field.set(obj, value);
            }
        } catch (NoSuchFieldException e) {
            // 필드가 존재하지 않을 경우의 처리
//            System.err.println("Field '" + fieldName + "' not found: " + e.getMessage());
        } catch (IllegalAccessException e) {
            // 접근 예외 처리
//            System.err.println("Error accessing field '" + fieldName + "': " + e.getMessage());
        }
    }

    // 특정 클래스에서 필드 찾기
    private Field findField(Class<?> clazz, String fieldName) throws NoSuchFieldException {
        Class<?> currentClass = clazz;
        while (currentClass != null) {
            try {
                return currentClass.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                currentClass = currentClass.getSuperclass();
            }
            clazz = clazz.getSuperclass();
        }
        throw new NoSuchFieldException("Field '" + fieldName + "' not found in class hierarchy");
    }

    @Override
    public Object plugin(Object target) {
        return Interceptor.super.plugin(target);
    }

    @Override
    public void setProperties(Properties properties) {
        Interceptor.super.setProperties(properties);
    }
}
