/**
 *  ++ giens Product ++
 */
package com.fms.common;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SysFileDetailService extends AbstractCommonService<SysFileDetail> {
    private final SysFileDetailMapper sysFileDetailMapper;
    private final SysFileMapper sysFileMapper;

    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, code, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<SysFileDetail> selectPage(SysFileDetail request) throws Exception {
        return sysFileDetailMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(SysFileDetail request) throws Exception {
        return sysFileDetailMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    protected List<SysFileDetail> findImpl(SysFileDetail request) throws Exception {
        try {
            return sysFileDetailMapper.SELECT(request);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(getMessage("EXCEPTION.FILE.TYPE"));
        }
    }

    @Override
    protected int removeImpl(SysFileDetail request) {
        return sysFileDetailMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(SysFileDetail request) {
        return sysFileDetailMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(SysFileDetail request) {
        return sysFileDetailMapper.INSERT(request);
    }

    @Transactional(rollbackFor = Exception.class)
    protected int registerImpl(List<SysFileDetail> request) throws Exception {
        int rtn = 0;
        try {
            for (SysFileDetail map : request) {
                if (map.getFile_name() != null || !map.getFile_name().equals("")) {
                    rtn = sysFileDetailMapper.INSERT(map);
                }
            }
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.FILE.TYPE"));
        }
        return rtn;
    }

    @Transactional(rollbackFor = Exception.class)
    protected int removeByFileIdAndUuid(SysFileDetail request) throws Exception {
        try {
            // NOTE: Retrieve full information including file_path before deletion
            List<SysFileDetail> details = sysFileDetailMapper.SELECT(request);
            if (details == null || details.isEmpty()) {
                return 0;
            }

            SysFileDetail fileDetail = details.get(0);
            int deletedRows = sysFileDetailMapper.DELETE(request);

            if (deletedRows > 0) {
                deleteFile(fileDetail);
            }
            var isDetailParam = SysFileDetail.builder().uuid(request.getUuid()).build();

            List<SysFileDetail> isDetails = sysFileDetailMapper.SELECT(isDetailParam);
            if (isDetails == null || isDetails.isEmpty()) {
                var isSysFileParam = SysFile.builder().uuid(request.getUuid()).build();
                int deleteSysFile = sysFileMapper.SYS_FILE_DELETE(isSysFileParam);
                if (deleteSysFile > 0) {
                    System.out.println("deleteSysFile : " + deleteSysFile);
                }
            }

            return deletedRows;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(getMessage("EXCEPTION.REMOVE"));
        }
    }

    protected void deleteFile(SysFileDetail param) throws IOException {
        if (param.getFile_path() != null && !param.getFile_path().isEmpty()) {
            File file = new File(param.getFile_path() + param.getFile_name());
            // System.out.println(file);
            Files.deleteIfExists(file.toPath());

        }
    }

    @Transactional(rollbackFor = Exception.class)
    protected int updateList(List<SysFileDetail> request) throws Exception {
        int rtn = 0;
        try {
            for (SysFileDetail map : request) {
                if (map.getUuid() != null && !map.getUuid().isEmpty()) {
                    rtn = sysFileDetailMapper.UPDATE(map);
                }
            }
        } catch (Exception e) {
            // todo 알맞은 Exception 추가 필요
            throw new CustomException(getMessage("EXCEPTION.FILE.TYPE"));
        }
        return rtn;
    }

    @Override
    protected int excelUploadImpl(MultipartFile file) throws Exception {
        return 0;
    }
}