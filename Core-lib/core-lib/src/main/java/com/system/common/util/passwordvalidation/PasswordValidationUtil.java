package com.system.common.util.passwordvalidation;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

public class PasswordValidationUtil {
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile(".*[A-Z].*");
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile(".*[a-z].*");
    private static final Pattern NUMBER_PATTERN = Pattern.compile(".*\\d.*");
    private static final Pattern SPECIAL_CHARACTER_PATTERN = Pattern.compile(".*[!@#$%^&*(),.?\":{}|<>].*");

    /**
     * 비밀번호가 정책을 준수하는지 검증한다.
     * 의도적으로 static하지 않게 인스턴스를 생성해서 사용하도록 만듦
     *
     * @param password 검증할 비밀번호
     * @param policy   적용할 비밀번호 정책
     * @return 실패 원인 메시지들
     */
    public List<String> validatePassword(String password, PasswordPolicy policy) {
        return validatePassword(password, policy, null);
    }

    /**
     * 비밀번호가 정책을 준수하는지 검증한다. (MessageSource를 사용한 국제화 지원)
     *
     * @param password      검증할 비밀번호
     * @param policy        적용할 비밀번호 정책
     * @param messageSource 국제화 메시지 소스 (null이면 기본 메시지 사용)
     * @return 실패 원인 메시지들
     */
    public List<String> validatePassword(String password, PasswordPolicy policy, MessageSource messageSource) {
        List<String> errors = new ArrayList<>();
        Locale locale = LocaleContextHolder.getLocale();

        if (policy == null) {
            errors.add(getMessage(messageSource, "EXCEPTION.PASSWORD.POLICY.NOT_SET",
                    "비밀번호 정책이 설정되지 않았습니다.", locale));
            return errors;
        }

        if (password.length() < policy.getMinLength()) {
            errors.add(getMessage(messageSource, "EXCEPTION.PASSWORD.POLICY.MIN_LENGTH",
                    "비밀번호는 최소 " + policy.getMinLength() + "자 이상이어야 합니다.", locale,
                    policy.getMinLength()));
        }
        if (policy.getMaxLength() < password.length()) {
            errors.add(getMessage(messageSource, "EXCEPTION.PASSWORD.POLICY.MAX_LENGTH",
                    "비밀번호는 최대 " + policy.getMaxLength() + "자 이하여야 합니다.", locale,
                    policy.getMaxLength()));
        }
        if (policy.isRequireUppercase() && !UPPERCASE_PATTERN.matcher(password).matches()) {
            errors.add(getMessage(messageSource, "EXCEPTION.PASSWORD.POLICY.REQUIRE_UPPERCASE",
                    "비밀번호에 최소 하나의 대문자가 포함되어야 합니다.", locale));
        }
        if (policy.isRequireLowercase() && !LOWERCASE_PATTERN.matcher(password).matches()) {
            errors.add(getMessage(messageSource, "EXCEPTION.PASSWORD.POLICY.REQUIRE_LOWERCASE",
                    "비밀번호에 최소 하나의 소문자가 포함되어야 합니다.", locale));
        }
        if (policy.isRequireNumber() && !NUMBER_PATTERN.matcher(password).matches()) {
            errors.add(getMessage(messageSource, "EXCEPTION.PASSWORD.POLICY.REQUIRE_NUMBER",
                    "비밀번호에 최소 하나의 숫자가 포함되어야 합니다.", locale));
        }
        if (policy.isRequireSpecialCharacter() && !SPECIAL_CHARACTER_PATTERN.matcher(password).matches()) {
            errors.add(getMessage(messageSource, "EXCEPTION.PASSWORD.POLICY.REQUIRE_SPECIAL_CHARACTER",
                    "비밀번호에 최소 하나의 특수문자가 포함되어야 합니다.", locale));
        }

        return errors;
    }

    /**
     * MessageSource에서 메시지를 가져오거나, 없으면 기본 메시지 반환
     */
    private String getMessage(MessageSource messageSource, String code, String defaultMessage, Locale locale,
            Object... args) {
        if (messageSource == null) {
            return defaultMessage;
        }
        try {
            return messageSource.getMessage(code, args, locale);
        } catch (Exception e) {
            return defaultMessage;
        }
    }
}