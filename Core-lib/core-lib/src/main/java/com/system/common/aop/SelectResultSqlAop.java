package com.system.common.aop;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.system.common.annotation.*;
import com.system.common.enumlist.AopDateToStringTransformFieldNameList;
import com.system.common.enumlist.AopIntegerToStringSetCommaFieldNameList;
import com.system.common.enumlist.AopSetDataValueTransformFieldNameList;
import com.system.common.util.validation.ValidationService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.EnumSet;
import java.util.Iterator;
import java.util.Map;
/*
* writer : 이경태
* text : 쿼리 조회 결과값 가공 처리 AOP
* */
@Aspect
@Component
@Order(2)
public class SelectResultSqlAop {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final Logger logger = LoggerFactory.getLogger(SelectResultSqlAop.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ValidationService validationService = new ValidationService();

    @Around("execution(* com.*.*Service.*(..)) && execution(* com.system.*..*.*(..))" )
    public Object transFormResultDataAop(ProceedingJoinPoint joinPoint) throws Throwable {
//        //String currentDateTime = LocalDateTime.now().format(formatter);
//        // logger.debug(currentDateTime + " Entering method: " + joinPoint.getSignature().toShortString());
//        // logger.debug(currentDateTime + " Request Parameter: " + Arrays.toString(joinPoint.getArgs()));
//
        Object result = joinPoint.proceed();

        // 객체를 JSON 문자열로 변환
        String resultJson = objectMapper.writeValueAsString(result);
        // JSON 문자열을 JsonNode로 변환
        JsonNode rootNode = objectMapper.readTree(resultJson);
        // JsonNode를 사용하여 JSON 데이터 접근 및 가공
        JsonNode modifiedNode = processJsonNode(rootNode);
//        System.out.println("Modified JSON: " + modifiedNode);

        // 수정된 JsonNode를 Object로 변환하여 반환
        return objectMapper.treeToValue(modifiedNode, result.getClass());
    }

    private JsonNode processJsonNode(JsonNode node) throws Exception {
        if (node.isArray()) {
            Iterator<JsonNode> elements = node.elements();
            while (elements.hasNext()) {
                JsonNode arrayElement = elements.next();
                processJsonNode(arrayElement); // 배열의 각 요소를 재귀
            }
        } else if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> fields = objectNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                String fieldName = field.getKey();
                JsonNode fieldValue = field.getValue();
                if (fieldValue.isObject() || fieldValue.isArray()) {
                    processJsonNode(fieldValue); // 객체나 배열의 경우 재귀적으로 처리
                } else {
                    // enum과 어노테이션을 사용하여 필드 이름을 관리하여 분기 처리
                    if (isTransformField(fieldName, fieldValue.asText())) {
                        // 어노테이션 기반 분기 처리
                        String formattedValue = applyTransformation(fieldName, fieldValue.asText());

                        objectNode.put(fieldName, formattedValue); // 필드 값을 업데이트
//                        System.out.println("Updated " + fieldName + " to: " + formattedValue);
                    }
                }
            }
        }

        return node; // 수정된 노드를 반환
    }

    // enum을 사용하여 필드가 변환 대상인지 확인하는 메서드
    private boolean isTransformField(String fieldName, String fieldValue) {
        // AopSetDataValueTransformFieldNameList 열거형에서 필드 이름 검사
        for (AopSetDataValueTransformFieldNameList transformField : AopSetDataValueTransformFieldNameList.values()) {
            if (transformField.name().equals(fieldName) && validationService.checkEmptyValue(fieldValue)) {
                return true;
            }
        }
        // AopDateToStringTransformFieldNameList 열거형에서 필드 이름 검사
        for (AopDateToStringTransformFieldNameList transformField : AopDateToStringTransformFieldNameList.values()) {
            if (transformField.name().equals(fieldName) && validationService.checkEmptyValue(fieldValue)) {
                return true;
            }
        }
        // AopIntegerToStringSetCommaFieldNameList 열거형에서 필드 이름 검사
        for (AopIntegerToStringSetCommaFieldNameList transformField : AopIntegerToStringSetCommaFieldNameList.values()) {
            if (transformField.name().equals(fieldName) && validationService.checkEmptyValue(fieldValue)) {
                return true;
            }
        }
        // 두 열거형에서 모두 필드 이름이 발견된 경우에만 true 반환
        return false;
    }

    // 필드 이름에 따라 어노테이션 기반으로 변환 함수 적용
    private String applyTransformation(String fieldName, String value) throws Exception {
        try {
            if (EnumSet.allOf(AopSetDataValueTransformFieldNameList.class).stream().anyMatch(e -> e.name().equals(fieldName))) {
                AopSetDataValueTransformFieldNameList transformField = AopSetDataValueTransformFieldNameList.valueOf(fieldName);
                if (transformField.getClass().getField(fieldName).isAnnotationPresent(SetHypenRegident.class)) {
                    return formatResidentRegistrationNumber(value);
                } else if (transformField.getClass().getField(fieldName).isAnnotationPresent(SetHypenCorporation.class)) {
                    return formatCorporationRegistrationNumber(value);
                } else if (transformField.getClass().getField(fieldName).isAnnotationPresent(SetHypenPhone.class)) {
                    return formatPhoneNumber(value);
                } else if (transformField.getClass().getField(fieldName).isAnnotationPresent(SetHypenCompany.class)){
                    return formatCompanyRegistrationNumber(value);
                } else if (transformField.getClass().getField(fieldName).isAnnotationPresent(SetHypen.class)) {
                    return formatDate(value);
                } else if (transformField.getClass().getField(fieldName).isAnnotationPresent(SetColonTime.class)) {
                    return formatTime(value);
                    }
            }else if (EnumSet.allOf(AopDateToStringTransformFieldNameList.class).stream().anyMatch(e -> e.name().equals(fieldName))) {
                AopDateToStringTransformFieldNameList transformFieldDateToString = AopDateToStringTransformFieldNameList.valueOf(fieldName);
                if (transformFieldDateToString.getClass().getField(fieldName).isAnnotationPresent(DateToString.class)) {
                    return formatDateToString(value);
                }
            }
        } catch (NoSuchFieldException e) {
            throw new Exception(e);
        }
        return value;
    }
    private String formatDate(String value) {
        // 주민등록번호 formatting 로직
        if (value != null && value.length() > 6) {
            return value.substring(0, 4) + "-" + value.substring(4,6)+ "-" + value.substring(6,8);
        }
        return value;
    }
    private String formatDateToString(String value) {
        long timeStamp = Long.parseLong(value);
        Date date = new Date(timeStamp);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = sdf.format(date);

        return dateString;
    }

    private String formatNumberToStringSetComma(String value) {
        long longValue = Long.parseLong(value);
        return String.format("%,d", longValue);
    }

    private String formatResidentRegistrationNumber(String value) {
        // 주민등록번호 formatting 로직
        if (value != null && value.length() > 6) {
            return value.substring(0, 6) + "-" + value.substring(6);
        }
        return value;
    }

    private String formatCorporationRegistrationNumber(String value) {
        //법인등록번호는 주민등록번호와 같은 로직 수행
        return formatResidentRegistrationNumber(value);
    }

    private String formatPhoneNumber(String value) {
        if (value == null || value.isEmpty()) {
            return value;
        }
        value = value.replaceAll("\\D", "");

        if (value.length() == 10) {
            return value.replaceFirst("(\\d{3})(\\d{3})(\\d+)", "$1-$2-$3");
        } else if (value.length() == 11) {
            return value.replaceFirst("(\\d{3})(\\d{4})(\\d+)", "$1-$2-$3");
        } else {
            throw new IllegalArgumentException("Invalid phone number length: " + value.length());
        }
    }

    private String formatCompanyRegistrationNumber(String value) {
        if (value == null || value.isEmpty()) {
            return value;
        }
        value = value.replaceAll("\\D", "");

        if (value.length() == 10) {
            return value.replaceFirst("(\\d{3})(\\d{2})(\\d{5})", "$1-$2-$3");
        } else {
            throw new IllegalArgumentException("Invalid business registration number length: " + value.length());
        }
    }

    private String formatTime(String value) {
        if (value == null || value.isEmpty()) {
            return value;
        }
        value = value.replaceAll("\\D", "");

        if (value.length() == 4) {
            return value.replaceFirst("(\\d{2})(\\d{2})", "$1:$2");
        } else {
            throw new IllegalArgumentException("Invalid time length: " + value.length());
        }
    }


}
