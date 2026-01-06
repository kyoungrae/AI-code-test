/**
 *  ++ giens Product ++
 */
package com.vims.common.user;

import com.system.auth.authuser.AuthUser;
import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.system.common.util.validation.ValidationService;
import com.vims.common.siteconfig.ComSiteConfig;
import com.vims.common.siteconfig.ComSiteConfigService;
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
public class ComUserService extends AbstractCommonService<ComUser> {
    private final ComUserMapper comUserMapper;
    private final ComUserRepository comUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final MessageSource messageSource;
    private final ComSiteConfigService comSiteConfigService;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }
    @Override
    protected List<ComUser> selectPage(ComUser request) throws Exception {
        try{
            return comUserMapper.SELECT_PAGE(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int selectPagingTotalNumber(ComUser request) throws Exception {
        try{
          return comUserMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }
    }
    @Override
    protected List<ComUser> findImpl(ComUser request) throws Exception {
        try{
            return comUserMapper.SELECT(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }

    }

    @Override
    protected int removeImpl(ComUser request) {
        try{
            return comUserMapper.DELETE(request);
        }catch (Exception e){
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
        if(flag){
            List<String> failReasons = validatePasswordPolicy(request.getPassword());
            if (failReasons.size() > 0) {
                throw new CustomException(failReasons.get(0));
            }
            request.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return comUserMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(ComUser request) {
        List<String> failReasons = validatePasswordPolicy(request.getPassword());
        if (failReasons.size() > 0) {
            throw new CustomException(failReasons.get(0));
        }

        return comUserMapper.INSERT(request);
    }

    public int changePassword(ComUser request) throws Exception {
        var comUser = ComUser.builder().email(request.getEmail()).build();
        List<ComUser> users = comUserMapper.SELECT(comUser);
        if (users == null || users.isEmpty() || users.size() != 1) {
            throw new CustomException(getMessage("EXCEPTION.NOT.FOUND.USER"));
        }

        if(!matchToPassword(request)){
            throw new CustomException(getMessage("EXCEPTION.PASSWORD.NOT_MATCH"));
        }
        validationPasswordPolicy(request.getPassword());

        var user = ComUser.builder()
                .id(users.get(0).getId())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        return comUserMapper.UPDATE(user);
    }

    public void validationPasswordPolicy(String newPassword) throws Exception {
        List<ComSiteConfig> list = new ArrayList<>();
        var comSiteConfig = ComSiteConfig.builder()
                .config_group_id("PASSWORD_POLICY")
                .use_yn("1")
                .build();
        list = comSiteConfigService.findImpl(comSiteConfig);
        for (ComSiteConfig csc : list) {
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

    public boolean matchToPassword(ComUser request){
        var comUser = ComUser.builder()
                .email(request.getEmail())
                .build();
        List<ComUser> userList = comUserMapper.SELECT(comUser);
        String before_password_encoded = userList.get(0).getPassword();
        return passwordEncoder.matches(request.getBefore_password(),before_password_encoded);
    }
//
//    public String getUserImageUrlByUserEmail(String email) {
//        // TODO 이미지 호출 방식이 변경되면 여기도 바껴야 함
//        String fileName = comUserMapper.GET_USER_IMAGE_FILE_NAME_BY_EMAIL(email);
//        if(fileName == null || fileName.isEmpty()){
//            return ""; // return null을 하면 에러나서 빈값 리턴
//        }
//        String imagePath = ApplicationResource.get("application.properties").get("imgPath").toString();
//        String filePath = ApplicationResource.get("application.properties").get("filePath").toString();
//        return imagePath + "?fileId=" + fileName + "&basePath=" + filePath + "/userImgFolder";
//    }
//    public int initializePassword(ComUser request) {
//        var comUser = ComUser.builder().email(request.getEmail()).build();
//        List<ComUser> users = comUserMapper.SELECT(comUser);
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
//        var comUserBean = ComUser.builder().id(users.get(0).getId())
//                .password(passwordEncoder.encode(request.get_password())).build();
//        return comUserMapper.UPDATE(comUserBean);
//    }
}