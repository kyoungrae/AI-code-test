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
import com.vims.common.usergroup.ComUserGroup;
import com.vims.common.usergroup.ComUserGroupService;
import com.vims.fmsClient.ExcelDataResponse;
import com.vims.fmsClient.FmsExcelClient;
import com.system.auth.domain.Token;
import com.system.auth.domain.TokenType;
import com.system.auth.mapper.SequenceMapper;
import com.system.auth.token.TokenMapper;
import com.system.auth.token.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.system.auth.authuser.Role;

import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComUserService extends AbstractCommonService<ComUser> {
    private final ComUserMapper comUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final MessageSource messageSource;
    private final ComSiteConfigService comSiteConfigService;
    private final TokenService tokenService;
    private final ComUserGroupService comUserGroupService;
    private final FmsExcelClient fmsExcelClient; // FMS 서비스 통신용 Feign Client

    @Value("${fms.internal.api-key}")
    private String fmsInternalApiKey; // 내부 API 키 (application.yml에서 주입)

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

    @Transactional(rollbackFor = Exception.class)
    @Override
    protected int removeImpl(ComUser request) {
        try {
            int tokenDeleteResult = tokenService.deleteExpiredTokens(request.getId());
            if (tokenDeleteResult < 0) {
                throw new CustomException(getMessage("EXCEPTION.REMOVE.TOKEN"));
            }

            var comUserGroup = ComUserGroup.builder().id(request.getId()).build();
            int userGroupDeleteResult = comUserGroupService.removeImpl(comUserGroup);
            if (userGroupDeleteResult < 0) {
                throw new CustomException(getMessage("EXCEPTION.REMOVE.USER_GROUP"));
            }
            return comUserMapper.DELETE(request);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(getMessage("EXCEPTION.REMOVE"));
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

    @Override
    protected int updateImpl(ComUser request) {
        ValidationService validationService = new ValidationService();
        boolean isPasswordProvided = validationService.checkEmptyValue(request.getPassword());

        if (isPasswordProvided) {
            // 1. 비밀번호 확인 체크
            if (!request.getPassword().equals(request.getPassword_confirm())) {
                throw new CustomException(getMessage("EXCEPTION.PASSWORD.CONFIRM_NOT_MATCH"));
            }

            // 2. 기존 비밀번호와 동일한지 체크 (raw 패스워드와 비교)
            ComUser existingUser = comUserMapper.SELECT(ComUser.builder().id(request.getId()).build()).get(0);
            if (passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
                throw new CustomException(getMessage("EXCEPTION.PASSWORD.SAME_AS_OLD"));
            }

            // 3. 비밀번호 정책 확인
            validationPasswordPolicy(request.getPassword());

            // 4. 비밀번호 암호화
            request.setPassword(passwordEncoder.encode(request.getPassword()));
        } else {
            // 비밀번호가 입력되지 않은 경우 기존 비밀번호를 유지
            request.setPassword(null);
        }
        return comUserMapper.UPDATE(request);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    protected int registerImpl(ComUser request) throws Exception {
        // 비밀번호 확인
        if (!request.getPassword().equals(request.getPassword_confirm())) {
            throw new CustomException(getMessage("EXCEPTION.PASSWORD.CONFIRM_NOT_MATCH"));
        }
        // 비밀번호 정책 확인
        validationPasswordPolicy(request.getPassword());

        // 비밀번호 암호화
        request.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            int result = comUserMapper.INSERT(request);

            // Register Token

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
        // 기본값 설정 (DB에 설정이 없을 경우 대비)
        // policy.setMinLength(8);
        // policy.setMaxLength(20);
        // policy.setRequireUppercase(false);
        // policy.setRequireLowercase(false);
        // policy.setRequireNumber(true);
        // policy.setRequireSpecialCharacter(true);

        if (configList == null || configList.isEmpty()) {
            return policy;
        }

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
    public void validationPasswordPolicy(String newPassword) {
        try {
            PasswordPolicy policy = getPasswordPolicyFromConfig();
            PasswordValidationUtil validator = new PasswordValidationUtil();
            List<String> errors = validator.validatePassword(newPassword, policy, messageSource);

            if (!errors.isEmpty()) {
                String allErrors = String.join(" / ", errors);
                throw new CustomException(allErrors);
            }
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(getMessage("EXCEPTION.PASSWORD.POLICY.LOAD_FAILED"));
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

    @Override
    protected int excelUploadImpl(MultipartFile file) throws Exception {
        try {
            // FMS 서비스의 엑셀 업로드 API 호출
            ExcelDataResponse excelData = fmsExcelClient.uploadExcel(file, fmsInternalApiKey);
            System.out.println("excelData::::" + excelData);
            // 엑셀 데이터 검증
            if (excelData == null || excelData.getDataRows() == null || excelData.getDataRows().isEmpty()) {
                throw new CustomException(getMessage("EXCEPTION.FMS.NO_DATA"));
            }
            return 0;

        } catch (IllegalArgumentException e) {
            throw new CustomException(getMessage("EXCEPTION.FMS.INVALID_FILE_FORMAT"));
        } catch (SecurityException e) {
            throw new CustomException(getMessage("EXCEPTION.FMS.ACCESS_DENIED"));
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.FMS.UPLOAD_ERROR"));
        }
    }
}