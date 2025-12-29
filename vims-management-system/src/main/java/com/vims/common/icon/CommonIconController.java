package com.vims.common.icon;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/commonIcon")
@RequiredArgsConstructor
public class CommonIconController extends AbstractCommonController<CommonIcon> {

	private final CommonIconService commonIconService;
    private final CommonIconRepository commonIconRepository;

	@PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody CommonIcon reqeust) throws Exception{
        return commonIconService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<CommonIcon> findAll(@RequestBody CommonIcon request) throws Exception{
        return commonIconRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<CommonIcon> findImpl(@RequestBody CommonIcon request) throws Exception{
        return commonIconService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody CommonIcon request) {
        return commonIconService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody CommonIcon request) {
        return commonIconService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody CommonIcon request) {
        return commonIconService.registerImpl(request);
    }
}