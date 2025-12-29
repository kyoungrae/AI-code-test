package com.vims.common.user;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/commonUser")
@RequiredArgsConstructor
public class CommonUserController extends AbstractCommonController<CommonUser> {

	private final CommonUserService commonUserService;
    private final CommonUserRepository commonUserRepository;

	@PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody CommonUser reqeust) throws Exception{
        return commonUserService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<CommonUser> findAll(@RequestBody CommonUser request) throws Exception{
        return commonUserRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<CommonUser> findImpl(@RequestBody CommonUser request) throws Exception{
        return commonUserService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    public int removeImpl(@RequestBody CommonUser request) {
        return commonUserService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    public int updateImpl(@RequestBody CommonUser request) {
        return commonUserService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    public int registerImpl(@RequestBody CommonUser request) {
        return commonUserService.registerImpl(request);
    }

//    @PostMapping("/matchToPassword")
//    public boolean matchToPassword(@RequestBody CommonUser request){
//        return commonUserService.matchToPassword(request);
//    }
//
//    @PostMapping("/getUserImageUrlByUserEmail")
//    protected String getUserImageUrlByUserEmail(@RequestBody CommonUser request) throws Exception{
//        return commonUserService.getUserImageUrlByUserEmail(request.getEmail());
//    }

    @PostMapping("/changePassword")
    public int changePassword(@RequestBody CommonUser request) throws Exception{
        return commonUserService.changePassword(request);
    }

//    @PostMapping("/validatePasswordPolicy")
//    public List<String> validatePasswordPolicy(@RequestBody String request) {
//        return commonUserService.validatePasswordPolicy(request);
//    }
//
//    @PostMapping("/initializePassword")
//    public int initializePassword(@RequestBody CommonUser request) {
//        return commonUserService.initializePassword(request);
//    }
}