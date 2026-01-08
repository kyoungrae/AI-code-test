package com.vims.common.office;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/comOffice")
@RequiredArgsConstructor
public class ComOfficeController extends AbstractCommonController<ComOffice> {

    private final ComOfficeService comOfficeService;
    private final ComOfficeRepository comOfficeRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComOffice reqeust) throws Exception {
        return comOfficeService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComOffice> findAll(@RequestBody ComOffice request) throws Exception {
        return comOfficeRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<ComOffice> findImpl(@RequestBody ComOffice request) throws Exception {
        return comOfficeService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComOffice request) {
        return comOfficeService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComOffice request) {
        return comOfficeService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody ComOffice request) {
        return comOfficeService.registerImpl(request);
    }
}