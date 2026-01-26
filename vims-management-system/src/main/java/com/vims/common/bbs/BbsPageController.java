package com.vims.common.bbs;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/bbs")
@RequiredArgsConstructor
public class BbsPageController {

    private final SysBbsService sysBbsService;
    private final SysBbsMstService sysBbsMstService;

    @GetMapping("/view")
    public String viewBoard(@RequestParam("bbsId") String bbsId, Model model) throws Exception {
        // 1. 게시판 정보 조회
        SysBbs sysBbs = new SysBbs();
        sysBbs.setBbs_id(bbsId);
        List<SysBbs> bbsList = sysBbsService.findImpl(sysBbs);

        if (bbsList == null || bbsList.isEmpty()) {
            // 게시판이 없으면 에러 처리가 필요하지만, 여기서는 빈 페이지나 목록으로 보냄
            return "page/bbs/sysBbsList";
        }
        SysBbs currentBbs = bbsList.get(0);

        // 2. 게시판 타입 조회 (Master 정보)
        SysBbsMst sysBbsMst = new SysBbsMst();
        sysBbsMst.setBbs_mst_id(currentBbs.getBbs_mst_id());
        List<SysBbsMst> mstList = sysBbsMstService.findImpl(sysBbsMst);

        String layoutType = "basic"; // 기본값
        if (mstList != null && !mstList.isEmpty()) {
            // BBS_TYPE 값을 소문자로 변환하여 파일명에 매핑
            // 예: NOTICE -> notice, GALLERY -> gallery
            // 공통 코드에 등록된 값이 무엇이든 소문자로 처리하여 매칭 시도
            String type = mstList.get(0).getBbs_type();
            if (type != null) {
                layoutType = type.toLowerCase();
            }
        }

        model.addAttribute("bbsInfo", currentBbs);

        // 3. 레이아웃 리턴
        // templates/page/bbs/bbsLayout_{type}.html 파일과 매핑
        return "page/bbs/bbsLayout_" + layoutType;
    }
}
