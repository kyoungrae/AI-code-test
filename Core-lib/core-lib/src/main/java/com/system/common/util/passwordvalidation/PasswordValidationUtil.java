package com.system.common.util.passwordvalidation;

import java.util.ArrayList;
import java.util.List;
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
        List<String> errors = new ArrayList<>();

        if (policy == null) {
            errors.add("비밀번호 정책이 설정되지 않았습니다.");
            return errors;
        }

        if (password.length() < policy.getMinLength()) {
            errors.add("비밀번호는 최소 " + policy.getMinLength() + "자 이상이어야 합니다.");
        }
        if (policy.getMaxLength() < password.length()) {
            errors.add("비밀번호는 최대 " + policy.getMaxLength() + "자 이하여야 합니다.");
        }
        if (policy.isRequireUppercase() && !UPPERCASE_PATTERN.matcher(password).matches()) {
            errors.add("비밀번호에 최소 하나의 대문자가 포함되어야 합니다.");
        }
        if (policy.isRequireLowercase() && !LOWERCASE_PATTERN.matcher(password).matches()) {
            errors.add("비밀번호에 최소 하나의 소문자가 포함되어야 합니다.");
        }
        if (policy.isRequireNumber() && !NUMBER_PATTERN.matcher(password).matches()) {
            errors.add("비밀번호에 최소 하나의 숫자가 포함되어야 합니다.");
        }
        if (policy.isRequireSpecialCharacter() && !SPECIAL_CHARACTER_PATTERN.matcher(password).matches()) {
            errors.add("비밀번호에 최소 하나의 특수문자가 포함되어야 합니다.");
        }

        return errors;
    }
}