## @title : grid 조회 컬럼 공통코드 자동 설정
## @date : 2026-01-08
## @author : 이경태
## @extend : ""
## @call : COM_CODE_GROUP_ID: "공통코드 그룹 아이디"
**example start**

<script>
     let service_Grid_header = {
                    title: "서비스 목록",
                    list: [
                        { HEADER: "사용여부", ID: "use_yn", WIDTH: "10", TYPE: "text", FONT_SIZE: "12px", TEXT_ALIGN: "center", COM_CODE_GROUP_ID: "USE_YN", HIDDEN: false },
                        .
                        .
                        .
                        .
                    ]
                };
</script>

**example end**

## @title : grid 조회 컬럼 checkbox 설정
## @date : 2026-01-08
## @author : 이경태
## @extend : ""
## @call : TYPE: 'checkbox'
**example start**

<script>
     let service_Grid_header = {
                    title: "서비스 목록",
                    list: [
                        { HEADER: 'checkbox', ID: 'checkbox', WIDTH: '25', TYPE: 'checkbox', FONT_SIZE: '12px', TEXT_ALIGN: 'center', HIDDEN: true }
                        .
                        .
                        .
                        .
                    ]
                };

        // 그리드 checkbox click 이벤트 설정
        #service#_grid.rowCheckboxClick(#service#RowCheckboxClick);
        function #service#RowCheckboxClick(rows){
           console.log(rows);
        }
</script>

**example end**

## @title : grid 조회 컬럼 detail button 설정
## @date : 2026-01-08
## @author : 이경태
## @extend : ""
## @call : TYPE: 'button'
**example start**

<script>
     let service_Grid_header = {
                    title: "서비스 목록",
                    list: [
                        { HEADER: Message.Label.Array["DETAIL_BTN"], ID: 'detail_btn', WIDTH: '15', TYPE: 'button', FONT_SIZE: '12px', TEXT_ALIGN: 'center', HIDDEN: false },
                        .
                        .
                        .
                        .
                    ]
                };

        //그리드 내부의 상세 버튼 클릭 이벤트(상세 팝업 호출) 설정(버튼클릭시 호출될 함수, 그리드 헤더 부분에 설정한 버튼 ID)
        #service#_grid.detailBtnClick(#service#DetailBtnClick, "detail_btn");

        function #service#DetailBtnClick(rows){
           console.log(rows);
        }
</script>

**example end**

## @title : grid 조회 컬럼 update button 설정
## @date : 2026-01-08
## @author : 이경태
## @extend : ""
## @call : TYPE: 'button'
**example start**

<script>
     let service_Grid_header = {
                    title: "서비스 목록",
                    list: [
                        { HEADER: Message.Label.Array["UPDATE_BTN"], ID: 'update_btn', WIDTH: '15', TYPE: 'button', FONT_SIZE: '12px', TEXT_ALIGN: 'center', HIDDEN: false },
                        .
                        .
                        .
                        .
                    ]
                };

        //그리드 내부의 상세 버튼 클릭 이벤트(상세 팝업 호출) 설정(버튼클릭시 호출될 함수, 그리드 헤더 부분에 설정한 버튼 ID)
        #service#_grid.updateBtnClick(#service#UpdateBtnClick, "update_btn");

        function #service#UpdateBtnClick(rows){
           console.log(rows);
        }
</script>

**example end**

## @title : grid 조회 컬럼 delete button 설정
## @date : 2026-01-08
## @author : 이경태
## @extend : ""
## @call : TYPE: 'button'
**example start**

<script>
     let service_Grid_header = {
                    title: "서비스 목록",
                    list: [
                        { HEADER: Message.Label.Array["DELETE_BTN"], ID: 'delete_btn', WIDTH: '15', TYPE: 'button', FONT_SIZE: '12px', TEXT_ALIGN: 'center', HIDDEN: false },
                        .
                        .
                        .
                        .
                    ]
                };

        //그리드 내부의 상세 버튼 클릭 이벤트(상세 팝업 호출) 설정(버튼클릭시 호출될 함수, 그리드 헤더 부분에 설정한 버튼 ID)
        #service#_grid.deleteBtnClick(#service#DeleteBtnClick, "delete_btn");

        function #service#DeleteBtnClick(rows){
           console.log(rows);
        }
</script>

**example end**

## @title : grid 조회 컬럼 side grid button 설정
## @date : 2026-01-08
## @author : 이경태
## @extend : ""
## @call : TYPE: 'button'
**example start**
<html>
        <div id="service_gi-Grid-side" class="gi-Grid-side" data-side-grid-open="false"></div>
</html>
<script>
     let service_Grid_header = {
                    title: "서비스 목록",
                    list: [
                        { HEADER: Message.Label.Array["SIDE_BTN"], ID: 'side_btn', WIDTH: '15', TYPE: 'button', FONT_SIZE: '12px', TEXT_ALIGN: 'center', HIDDEN: true },
                        .
                        .
                        .
                        .
                    ]
                };

        //사이드 그리드 설정
        #service#_grid.sideOpenBtnClick("#service#_gi-Grid-side", "side_btn", function (data) {
        //  console.log("Side Panel Data:", data);
        // 1. 사이드 패널 내 그리드 컨테이너 생성
         $("#service_gi-Grid-side").html('<div class="gi-padding-20px gi-row-100 gi-flex gi-flex-direction-column gi-grid-gap-10px">' +
           '<h3>[' + data.no + '] 로우 상세 내역</h3>' +
           '<div id="#serivce#Sub_gi-Grid" class="gi-Grid gi-row-100"></div>' +
           '</div>');
         // 2. 서브 그리드 헤더 설정
         let #serivce#SubGridHeader = {
           title: "상세 내역 리스트",
           list: [
             { HEADER: '순번', ID: 'sub_no', WIDTH: '10', TYPE: 'text', FONT_SIZE: '12px', TEXT_ALIGN: 'center', HIDDEN: false },
             { HEADER: '항목명', ID: 'item_name', WIDTH: '40', TYPE: 'text', FONT_SIZE: '12px', TEXT_ALIGN: 'left', HIDDEN: false },
             { HEADER: '내용', ID: 'item_content', WIDTH: '50', TYPE: 'text', FONT_SIZE: '12px', TEXT_ALIGN: 'left', HIDDEN: false }
           ]
         };
         // 3. 서브 그리드 데이터 생성 (샘플)
         let subData = [];
         for (let i = 1; i <= 5; i++) {
           subData.push({
             sub_no: i,
             item_name: "상세 항목 " + data.no + "-" + i,
             item_content: "이것은 " + data.no + "번 데이터의 상세 내용입니다."
           });
         }
         // 4. 서브 그리드 초기화 및 데이터 바인딩
         let sub_grid = formUtil.giGrid(#service#SubGridHeader, 1, 1, "#service#Sub_gi-Grid");
         sub_grid.DataSet(subData);
        });

</script>

**example end**

## @title : grid 조회 컬럼 visible option button 설정
## @date : 2026-01-08
## @author : 이경태
## @extend : ""
## @call : TYPE: 'button'
**example start**
: 컬럼 값에 따라 버튼 표시 여부 결정
: VISIBLE_OPTION_BTN: [{ "test2": "0" },{"test2": "1"}] : 다중 조건 설정 가능
<script>
     let service_Grid_header = {
                    title: "서비스 목록",
                    list: [
                        { HEADER: 'test2', ID: "test2", WIDTH: "5", TYPE: "button", FONT_SIZE: "12px", TEXT_ALIGN: "center", VISIBLE_OPTION_BTN: [{ "test2": "0" }], HIDDEN: true },
                        .
                        .
                        .
                        .
                    ]
                };

</script>

**example end**

## @title : grid 엑셀 다운로드 (Excel Download) 설정
## @date : 2026-01-12
## @author : 이경태
## @extend : ""
## @call : grid.excelDownloadEvent("파일명")
**example start**
: 그리드의 데이터를 엑셀 파일로 다운로드합니다. 
: (SheetJS 라이브러리가 필요하며, `/assets/excel/xlsx.full.min.js` 경로에 로컬로 포함되어 있습니다.)
<script>
    // 그리드 생성 후 엑셀 다운로드 활성화
    #service#_grid.excelDownloadEvent("사용자_목록_리포트");
</script>

**example end**

## @title : grid 계층형(Hierarchy) 구조 설정
## @date : 2026-01-12
## @author : 이경태
## @extend : ""
## @call : formUtil.giGridHierarchy(...) / grid.HierarchyOption(...)
**example start**
: 데이터를 트리(Tree) 형태의 계층 구조로 표시합니다. 
: 레벨(Level), 본인 코드, 부모 코드 데이터를 기준으로 자동으로 정렬 및 폴더 트리 UI를 생성합니다.

**1. 그리드 헤더 설정 (필수 컬럼 포함)**
: 계층 로직 작동을 위해 레벨과 부모 코드 값이 DOM에 존재해야 하므로, HIDDEN 컬럼으로라도 반드시 포함해야 합니다.
<script>
    let menuGridHeader = {
        title: "메뉴 목록",
        list: [
            { HEADER: "메뉴명", ID: "menu_name", WIDTH: "40", TYPE: "text", ... },
            { HEADER: "메뉴코드", ID: "menu_code", WIDTH: "20", TYPE: "text", ... },
            // 하이라키 로직 작동을 위한 필수 숨김 컬럼
            { HEADER: "레벨", ID: "menu_level", WIDTH: "0", TYPE: "text", HIDDEN: true },
            { HEADER: "상위코드", ID: "top_menu_code", WIDTH: "0", TYPE: "text", HIDDEN: true }
        ]
    };
</script>

**2. 그리드 생성 및 계층 옵션 설정**
: `giGridHierarchy`로 그리드를 생성하고, `HierarchyOption`으로 각 역할에 맞는 컬럼 ID를 매핑합니다.
<script>
    // 1) 계층형 그리드 생성
    let menu_grid = formUtil.giGridHierarchy(menuGridHeader, "", "", "gi-Grid");

    // 2) 계층 구조 옵션 매핑 (필수)
    menu_grid.HierarchyOption({ 
        level_column: "menu_level",      // [필수] 데이터의 깊이 (0부터 시작)
        parent_depth_column: "menu_code", // [필수] 본인의 고유 코드 (부모가 참조할 키)
        child_depth_column: "top_menu_code" // [필수] 부모의 고유 코드 (본인이 참조할 키)
    });

    // 3) 데이터 바인딩
    menu_grid.DataSet(data);
</script>

**주의사항**
- **Root 레벨**: 최상위 노드의 `level_column` 값은 반드시 문자열 "0" (또는 숫자 0) 이어야 합니다.
- **매핑 방식**: `parent_depth_column`은 '기준이 되는 ID', `child_depth_column`은 '내가 누구의 자식인지를 나타내는 FK' 개념입니다.
**example end**
