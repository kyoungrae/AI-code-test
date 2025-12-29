package com.vims.common.codegroup;

import com.system.common.base.AbstractCommonService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CommonCodeGroupService extends AbstractCommonService<CommonCodeGroup> {
    private final CommonCodeGroupMapper commonCodeGroupMapper;
    private final CommonCodeGroupRepository commonCodeGroupRepository;

    protected List<CommonCodeGroup> findByGroupId(CommonCodeGroup request) throws Exception {
        try{
            return commonCodeGroupRepository.findAll();
        }catch (Exception e){
            throw new Exception(e);
        }
    }
    @Override
    protected List<CommonCodeGroup> selectPage(CommonCodeGroup request) throws Exception {
        return commonCodeGroupMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(CommonCodeGroup request) throws Exception {
        return commonCodeGroupMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }
    @Override
    protected List<CommonCodeGroup> findImpl(CommonCodeGroup request) throws Exception {
        return commonCodeGroupMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(CommonCodeGroup request) {
        return commonCodeGroupMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(CommonCodeGroup request) {
        return commonCodeGroupMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(CommonCodeGroup request) {
        return commonCodeGroupMapper.INSERT(request);
    }
}
