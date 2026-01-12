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