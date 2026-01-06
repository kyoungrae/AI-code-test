/**
 *  ++ giens Product ++
 */
package com.vims.common.user;

import com.system.auth.authuser.AuthUser;
import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.system.common.util.passwordvalidation.PasswordPolicy;
import com.system.common.util.passwordvalidation.PasswordValidationUtil;
import com.system.common.util.validation.ValidationService;
import com.vims.common.siteconfig.ComSiteConfig;
import com.vims.common.siteconfig.ComSiteConfigService;
import com.system.auth.domain.Token;
import com.system.auth.domain.TokenType;
import com.system.auth.mapper.SequenceMapper;
import com.system.auth.token.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComUserService extends AbstractCommonService<ComUser> {
    private final ComUserMapper comUserMapper;
    private final ComUserRepository comUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final MessageSource messageSource;
    private final ComSiteConfigService comSiteConfigService;
    private final SequenceMapper sequenceMapper;
    private final TokenService tokenService;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComUser> selectPage(ComUser request) throws Exception {
        try {
            return comUserMapper.SELECT_PAGE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int selectPagingTotalNumber(ComUser request) throws Exception {
        try {
            return comUserMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected List<ComUser> findImpl(ComUser request) throws Exception {
        try {
            return comUserMapper.SELECT(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.NOT.FOUND.USER"));
        }

    }

    @Override
    protected int removeImpl(ComUser request) {
        try {
            return comUserMapper.DELETE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }
    }

    @Transactional(rollbackFor = Exception.class)
    protected int removeToken(AuthUser request) throws Exception {
        int rtn = 0;
        try {
            rtn = comUserMapper.DELETE_TOKEN(request);
        } catch (Exception e) {
            throw new Exception(e + ": Fail to Remove Token");
        }
        return rtn;
    }

    @Transactional(rollbackFor = Exception.class)
    protected int removeUser(ComUser request) throws Exception {
        int rtn = 0;
        try {
            rtn = comUserMapper.DELETE(request);
        } catch (Exception e) {
            throw new Exception(e + ": Fail to Remove User");
        }
        return rtn;
    }

    @Override
    protected int updateImpl(ComUser request) {
        ValidationService validationService = new ValidationService();
        boolean flag = validationService.checkEmptyValue(request.getPassword());
        if (flag) {
            List<String> failReasons = validatePasswordPolicy(request.getPassword());
            if (failReasons.size() > 0) {
                throw new CustomException(failReasons.get(0));
            }
            request.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return comUserMapper.UPDATE(request);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    protected int registerImpl(ComUser request) throws Exception {
        // 비밀번호 확인
        if (!request.getPassword().equals(request.getPassword_confirm())) {
            throw new CustomException(getMessage("EXCEPTION.PASSWORD.NOT_MATCH"));
        }
        // 비밀번호 정책 확인
        validationPasswordPolicy(request.getPassword());

        // 비밀번호 암호화
        request.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            int result = comUserMapper.INSERT(request);

            // Register Token
            int tokenId = sequenceMapper.SELECT_NEXT_TOKEN_ID();
            var token = Token.builder()
                    .id(tokenId)
                    .token("")
                    .token_type(TokenType.AUTHORIZATION)
                    .expired(false)
                    .revoked(false)
                    .auth_user(AuthUser.builder().id(request.getId()).build())
                    .build();
            tokenService.save(token);

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e + "");

        }
    }

    public int changePassword(ComUser request) throws Exception {
        var comUser = ComUser.builder().email(request.getEmail()).build();
        List<ComUser> users = comUserMapper.SELECT(comUser);
        if (users == null || users.isEmpty() || users.size() != 1) {
            throw new CustomException(getMessage("EXCEPTION.NOT.FOUND.USER"));
        }

        if (!matchToPassword(request)) {
            throw new CustomException(getMessage("EXCEPTION.PASSWORD.NOT_MATCH"));
        }
        validationPasswordPolicy(request.getPassword());

        var user = ComUser.builder()
                .id(users.get(0).getId())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        return comUserMapper.UPDATE(user);
    }

    /**
     * DB에서 비밀번호 정책을 조회하여 PasswordPolicy 객체로 변환
     * 캐싱을 통해 매번 DB 조회를 방지하여 성능 개선
     */
    @Cacheable(value = "passwordPolicy", unless = "#result == null")
    private PasswordPolicy getPasswordPolicyFromConfig() throws Exception {
        var comSiteConfig = ComSiteConfig.builder()
                .config_group_id("PASSWORD_POLICY")
                .use_yn("1")
                .build();
        List<ComSiteConfig> configList = comSiteConfigService.findImpl(comSiteConfig);

        PasswordPolicy policy = new PasswordPolicy();
        for (ComSiteConfig config : configList) {
            String key = config.getConfig_key();
            String value = config.getConfig_value();

            switch (key) {
                case "MAX_LENGTH":
                    policy.setMaxLength(Integer.parseInt(value));
                    break;
                case "MIN_LENGTH":
                    policy.setMinLength(Integer.parseInt(value));
                    break;
                case "REQUIRE_UPPERCASE":
                    policy.setRequireUppercase("1".equals(value) || "true".equalsIgnoreCase(value));
                    break;
                case "REQUIRE_LOWERCASE":
                    policy.setRequireLowercase("1".equals(value) || "true".equalsIgnoreCase(value));
                    break;
                case "REQUIRE_NUMBER":
                    policy.setRequireNumber("1".equals(value) || "true".equalsIgnoreCase(value));
                    break;
                case "REQUIRE_SPECIAL_CHARACTER":
                    policy.setRequireSpecialCharacter("1".equals(value) || "true".equalsIgnoreCase(value));
                    break;
                default:
                    // 알 수 없는 설정 키는 무시 (로그 남기는 것도 고려 가능)
                    break;
            }
        }
        return policy;
    }

    /**
     * 비밀번호 정책 검증 (Core 라이브러리의 PasswordValidationUtil 사용)
     * MessageSource를 통한 국제화 지원 및 모든 에러 메시지 표시
     */
    public void validationPasswordPolicy(String newPassword) throws Exception {
        PasswordPolicy policy = getPasswordPolicyFromConfig();
        PasswordValidationUtil validator = new PasswordValidationUtil();
        List<String> errors = validator.validatePassword(newPassword, policy, messageSource);

        if (!errors.isEmpty()) {
            // 모든 에러를 한 번에 표시하여 사용자 경험 개선
            String allErrors = String.join(" / ", errors);
            throw new CustomException(allErrors);
        }
    }

    /**
     * 비밀번호 정책 검증 후 실패 이유 목록 반환 (MessageSource 지원)
     */
    public List<String> validatePasswordPolicy(String password) {
        try {
            PasswordPolicy policy = getPasswordPolicyFromConfig();
            PasswordValidationUtil validator = new PasswordValidationUtil();
            return validator.validatePassword(password, policy, messageSource);
        } catch (Exception e) {
            List<String> errors = new ArrayList<>();
            errors.add(getMessage("EXCEPTION.PASSWORD.POLICY.LOAD_FAILED"));
            return errors;
        }
    }

    public boolean matchToPassword(ComUser request) {
        var comUser = ComUser.builder()
                .email(request.getEmail())
                .build();
        List<ComUser> userList = comUserMapper.SELECT(comUser);
        String before_password_encoded = userList.get(0).getPassword();
        return passwordEncoder.matches(request.getBefore_password(), before_password_encoded);
    }
}