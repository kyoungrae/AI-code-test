/**
 *  ++ giens Product ++
 */
package com.vims.common.menu;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.system.common.util.userinfo.UserInfo;
import com.vims.common.accessgroupmenu.ComAccsGroupMenu;
import com.vims.common.accessgroupmenu.ComAccsGroupMenuMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComMenuService extends AbstractCommonService<ComMenu> {
    private final ComMenuMapper comMenuMapper;
    private final ComMenuRepository comMenuRepository;
    private final MessageSource messageSource;
    private final ComAccsGroupMenuMapper comAccsGroupMenuMapper;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    public List<ComMenu> findHierarchy(ComMenu request) throws Exception {
        return comMenuMapper.SELECT_HIERARCHY(request);
    }

    public List<ComMenu> findAccessRightGroupForMenu(ComMenu request) throws Exception {
        String userEmail = UserInfo.getUserEmail();
        var comMenu = ComMenu.builder().user_email(userEmail).build();
        return comMenuMapper.SELECT_ACCESS_RIGHTS_GROUP_FOR_MENU(comMenu);
    }

    @Override
    protected List<ComMenu> selectPage(ComMenu request) throws Exception {
        return comMenuMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(ComMenu request) throws Exception {
        return comMenuMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    protected List<ComMenu> findImpl(ComMenu request) throws Exception {
        return comMenuMapper.SELECT(request);
    }

    public int removeMenuCode(ComMenu request) throws Exception {
        var containTopMenuCode = ComMenu.builder()
                .top_menu_code(request.getMenu_code())
                .build();
        var containMenuCode = ComMenu.builder()
                .menu_code(request.getMenu_code())
                .menu_sequence(request.getMenu_sequence())
                .build();
        var containAccessRightGroupCode = ComAccsGroupMenu.builder()
                .menu_code(request.getMenu_code())
                .build();
        List<ComAccsGroupMenu> acList = comAccsGroupMenuMapper.SELECT(containAccessRightGroupCode);
        List<ComMenu> list = comMenuMapper.SELECT(containTopMenuCode);
        boolean childNodeExist = !list.isEmpty();
        boolean accessRightGroupExist = !acList.isEmpty();
        try {
            if (childNodeExist) {
                throw new CustomException(getMessage("EXCEPTION.DELETE.EXIST.SBU_DATA"));
            } else if (accessRightGroupExist) {
                throw new CustomException(getMessage("EXCEPTION.DELETE.EXIST.ACCESS_RIGHTS_GROUP_DATA"));
            } else {
                return comMenuMapper.DELETE(containMenuCode);
            }
        } catch (CustomException ce) {
            throw ce;
        } catch (Exception e) {
            throw new Exception("FAIL TO REMOVE MENU", e);
        }
    }

    @Override
    protected int removeImpl(ComMenu request) {
        try {
            return comMenuMapper.DELETE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST.USER"));
        }
    }

    @Override
    protected int updateImpl(ComMenu request) {
        try {
            return comMenuMapper.UPDATE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int registerImpl(ComMenu request) throws Exception {
        try {
            return comMenuMapper.INSERT(request);
        } catch (DuplicateKeyException dke) {
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    @Override
    protected int excelUploadImpl(MultipartFile arg0) throws Exception {
        return 0;
    }
}