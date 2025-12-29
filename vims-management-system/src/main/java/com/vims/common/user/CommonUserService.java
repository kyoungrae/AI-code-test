/**
 *  ++ giens Product ++
 */
package com.vims.common.user;

import com.system.auth.authuser.AuthUser;
import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.system.common.util.validation.ValidationService;
import com.vims.common.siteconfig.CommonSiteConfig;
import com.vims.common.siteconfig.CommonSiteConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CommonUserService extends AbstractCommonService<CommonUser> {
    private final CommonUserMapper commonUserMapper;
    private final CommonUserRepository commonUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final MessageSource messageSource;
    private final CommonSiteConfigService commonSiteConfigService;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }
    @Override
    protected List<CommonUser> selectPage(CommonUser request) throws Exception {
        try{
            return commonUserMapper.SELECT_PAGE(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int selectPagingTotalNumber(CommonUser request) throws Exception {
        try{
          return commonUserMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }
    }
    @Override
    protected List<CommonUser> findImpl(CommonUser request) throws Exception {
        try{
            return commonUserMapper.SELECT(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }

    }

    @Override
    protected int removeImpl(CommonUser request) {
        try{
            return commonUserMapper.DELETE(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }
    }

    @Transactional(rollbackFor = Exception.class)
    protected int removeToken(AuthUser request) throws Exception {
        int rtn = 0;
        try {
            rtn = commonUserMapper.DELETE_TOKEN(request);
        } catch (Exception e) {
            throw new Exception(e + ": Fail to Remove Token");
        }
        return rtn;
    }

    @Transactional(rollbackFor = Exception.class)
    protected int removeUser(CommonUser request) throws Exception {
        int rtn = 0;
        try {
            rtn = commonUserMapper.DELETE(request);
        } catch (Exception e) {
            throw new Exception(e + ": Fail to Remove User");
        }
        return rtn;
    }

    @Override
    protected int updateImpl(CommonUser request) {
        ValidationService validationService = new ValidationService();
        boolean flag = validationService.checkEmptyValue(request.getPassword());
        if(flag){
            List<String> failReasons = validatePasswordPolicy(request.getPassword());
            if (failReasons.size() > 0) {
                throw new CustomException(failReasons.get(0));
            }
            request.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return commonUserMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(CommonUser request) {
        List<String> failReasons = validatePasswordPolicy(request.getPassword());
        if (failReasons.size() > 0) {
            throw new CustomException(failReasons.get(0));
        }

        return commonUserMapper.INSERT(request);
    }

    public int changePassword(CommonUser request) throws Exception {
        var commonUser = CommonUser.builder().email(request.getEmail()).build();
        List<CommonUser> users = commonUserMapper.SELECT(commonUser);
        if (users == null || users.isEmpty() || users.size() != 1) {
            throw new CustomException(getMessage("EXCEPTION.NOT.FOUND.USER"));
        }

        if(!matchToPassword(request)){
            throw new CustomException(getMessage("EXCEPTION.PASSWORD.NOT_MATCH"));
        }
        validationPasswordPolicy(request.getPassword());

        var user = CommonUser.builder()
                .id(users.get(0).getId())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        return commonUserMapper.UPDATE(user);
    }

    public void validationPasswordPolicy(String newPassword) throws Exception {
        List<CommonSiteConfig> list = new ArrayList<>();
        var commonSiteConfig = CommonSiteConfig.builder()
                .config_group_id("PASSWORD_POLICY")
                .use_yn("1")
                .build();
        list = commonSiteConfigService.findImpl(commonSiteConfig);
        for (CommonSiteConfig csc : list) {
            String key = csc.getConfig_key();
            String value = csc.getConfig_value();
            //NOTE: 비밀번호 최대길이 설정
            if (key.equals("MAX_LENGTH")) {
                if (newPassword.length() > Integer.parseInt(value)) {
                    throw new CustomException(getMessage("EXCEPTION.PASSWORD.POLICY.MAX_LENGTH"));
                }
            //NOTE: 비밀번호 최소 길이 설정
            }else if(key.equals("MIN_LENGTH")){
                if(newPassword.length() < Integer.parseInt(value)){
                    throw new CustomException(getMessage("EXCEPTION.PASSWORD.POLICY.MIN_LENGTH"));
                }
            //NOTE: 비밀번호 대문자 설정
            }else if(key.equals("REQUIRE_UPPERCASE")){
                Pattern UPPERCASE_PATTERN  = Pattern.compile(".*[A-Z].*");
                if(!UPPERCASE_PATTERN.matcher(newPassword).matches()){
                    throw new CustomException(getMessage("EXCEPTION.PASSWORD.POLICY.REQUIRE_UPPERCASE"));
                }
            //NOTE: 비밀번호 소문자 설정
            }else if(key.equals("REQUIRE_LOWERCASE")){
                Pattern LOWRERCASE_PATTERN  = Pattern.compile(".*[a-z].*");
                if(!LOWRERCASE_PATTERN.matcher(newPassword).matches()){
                    throw new CustomException(getMessage("EXCEPTION.PASSWORD.POLICY.REQUIRE_LOWERCASE"));
                }
            //NOTE: 비밀번호 숫자 포함 설정
            }else if(key.equals("REQUIRE_NUMBER")){
                Pattern NUMBER_PATTERN = Pattern.compile(".*\\d.*");
                if(!NUMBER_PATTERN.matcher(newPassword).matches()){
                    throw new CustomException(getMessage("EXCEPTION.PASSWORD.POLICY.REQUIRE_NUMBER"));
                }
            //NOTE: 비빌번호 특수 문자 포함 설정
            }else if(key.equals("REQUIRE_SPECIAL_CHARACTER")) {
                Pattern SPECIAL_CHARACTER_PATTERN = Pattern.compile(".*[!@#$%^&*(),.?\":{}|<>].*");
                if (!SPECIAL_CHARACTER_PATTERN.matcher(newPassword).matches()) {
                    throw new CustomException(getMessage("EXCEPTION.PASSWORD.POLICY.REQUIRE_SPECIAL_CHARACTER"));
                }
            }else{
                throw new CustomException(getMessage("EXCEPTION.PASSWORD.POLICY.NOT_EXISTS") + key);
            }
        }
    }
    public List<String> validatePasswordPolicy(String newPassword) {
        return null;
    }

    public boolean matchToPassword(CommonUser request){
        var commonUser = CommonUser.builder()
                .email(request.getEmail())
                .build();
        List<CommonUser> userList = commonUserMapper.SELECT(commonUser);
        String before_password_encoded = userList.get(0).getPassword();
        return passwordEncoder.matches(request.getBefore_password(),before_password_encoded);
    }
//
//    public String getUserImageUrlByUserEmail(String email) {
//        // TODO 이미지 호출 방식이 변경되면 여기도 바껴야 함
//        String fileName = commonUserMapper.GET_USER_IMAGE_FILE_NAME_BY_EMAIL(email);
//        if(fileName == null || fileName.isEmpty()){
//            return ""; // return null을 하면 에러나서 빈값 리턴
//        }
//        String imagePath = ApplicationResource.get("application.properties").get("imgPath").toString();
//        String filePath = ApplicationResource.get("application.properties").get("filePath").toString();
//        return imagePath + "?fileId=" + fileName + "&basePath=" + filePath + "/userImgFolder";
//    }
//    public int initializePassword(CommonUser request) {
//        var commonUser = CommonUser.builder().email(request.getEmail()).build();
//        List<CommonUser> users = commonUserMapper.SELECT(commonUser);
//
//        if (users == null || users.isEmpty() || users.size() != 1) {
//            throw new UsernameNotFoundException("NO_USER");
//        }
//
//        List<String> failReasons = validatePasswordPolicy(request.getPassword());
//        if (failReasons.size() > 0) {
//            throw new CustomException(failReasons.get(0));
//        }
//
//        var commonUserBean = CommonUser.builder().id(users.get(0).getId())
//                .password(passwordEncoder.encode(request.get_password())).build();
//        return commonUserMapper.UPDATE(commonUserBean);
//    }
}