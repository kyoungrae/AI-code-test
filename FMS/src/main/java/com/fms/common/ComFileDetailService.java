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
public class ComFileDetailService extends AbstractCommonService<ComFileDetail> {
    private final ComFileDetailMapper comFileDetailMapper;
    private final ComFileMapper comFileMapper;

    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, code, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComFileDetail> selectPage(ComFileDetail request) throws Exception {
        return comFileDetailMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(ComFileDetail request) throws Exception {
        return comFileDetailMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    protected List<ComFileDetail> findImpl(ComFileDetail request) throws Exception {
        try {
            return comFileDetailMapper.SELECT(request);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(getMessage("EXCEPTION.FILE.TYPE"));
        }
    }

    @Override
    protected int removeImpl(ComFileDetail request) {
        return comFileDetailMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(ComFileDetail request) {
        return comFileDetailMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(ComFileDetail request) {
        return comFileDetailMapper.INSERT(request);
    }

    @Transactional(rollbackFor = Exception.class)
    protected int registerImpl(List<ComFileDetail> request) throws Exception {
        int rtn = 0;
        try {
            for (ComFileDetail map : request) {
                if (map.getFile_name() != null || !map.getFile_name().equals("")) {
                    rtn = comFileDetailMapper.INSERT(map);
                }
            }
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.FILE.TYPE"));
        }
        return rtn;
    }

    @Transactional(rollbackFor = Exception.class)
    protected int removeByFileIdAndUuid(ComFileDetail request) throws Exception {
        try {
            // NOTE: Retrieve full information including file_path before deletion
            List<ComFileDetail> details = comFileDetailMapper.SELECT(request);
            if (details == null || details.isEmpty()) {
                return 0;
            }

            ComFileDetail fileDetail = details.get(0);
            int deletedRows = comFileDetailMapper.DELETE(request);

            if (deletedRows > 0) {
                deleteFile(fileDetail);
            }
            var isDetailParam = ComFileDetail.builder().uuid(request.getUuid()).build();

            List<ComFileDetail> isDetails = comFileDetailMapper.SELECT(isDetailParam);
            if (isDetails == null || isDetails.isEmpty()) {
                var isComFileParam = ComFile.builder().uuid(request.getUuid()).build();
                int deleteComFile = comFileMapper.COM_FILE_DELETE(isComFileParam);
                if (deleteComFile > 0) {
                    System.out.println("deleteComFile : " + deleteComFile);
                }
            }

            return deletedRows;
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(getMessage("EXCEPTION.REMOVE"));
        }
    }

    protected void deleteFile(ComFileDetail param) throws IOException {
        if (param.getFile_path() != null && !param.getFile_path().isEmpty()) {
            File file = new File(param.getFile_path() + param.getFile_name());
            // System.out.println(file);
            Files.deleteIfExists(file.toPath());

        }
    }

    @Transactional(rollbackFor = Exception.class)
    protected int updateList(List<ComFileDetail> request) throws Exception {
        int rtn = 0;
        try {
            for (ComFileDetail map : request) {
                if (map.getUuid() != null && !map.getUuid().isEmpty()) {
                    rtn = comFileDetailMapper.UPDATE(map);
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