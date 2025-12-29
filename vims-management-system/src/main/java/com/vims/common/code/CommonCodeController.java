package com.vims.common.code;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/commonCode")
@RequiredArgsConstructor
public class CommonCodeController extends AbstractCommonController<CommonCode> {
    private final CommonCodeService commonCodeService;
    private final CommonCodeRepository commonCodeRepository;
    @RequestMapping("/findCommonCode")
    protected List<CommonCode> findCommonCode(@RequestBody CommonCode request) throws Exception {
        return commonCodeService.findCommonCode(request);
    }

    @PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody CommonCode reqeust) throws Exception{
        return commonCodeService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<CommonCode> findAll(@RequestBody CommonCode request) throws Exception{
        return commonCodeRepository.findAll();
    }

    @Override
    @PostMapping("/find")
    protected List<CommonCode> findImpl(@RequestBody CommonCode request) throws Exception{
        return commonCodeService.findImpl(request);
    }

    @Override
    @PostMapping("/remove")
    protected int removeImpl(@RequestBody CommonCode request) {
        return commonCodeService.removeImpl(request);
    }

    @Override
    @PostMapping("/update")
    protected int updateImpl(@RequestBody CommonCode request) {
        return commonCodeService.updateImpl(request);
    }

    @Override
    @PostMapping("/register")
    protected int registerImpl(@RequestBody CommonCode request) {
        return commonCodeService.registerImpl(request);
    }
}
