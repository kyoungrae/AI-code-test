/**
 * @title : 그리드 생성
 * @text : 그리드 관련 유틸리티 (giGrid 등)
 */
FormUtility.prototype.giGrid = function (layout, paging, page, gridId) {
    let gridSortManager = formUtil.gridSortManager;
    //localStorage에서 정렬값을 가져와 setting
    gridSortManager.loadSortState();
    if (!formUtil.checkEmptyValue(paging)) paging = 1;
    if (!formUtil.checkEmptyValue(page)) page = 1;

    let title = layout.title;
    let grid_list_header = "";
    let headerItem = [];
    let prePageAnimationCont = $("#gi-grid-list-body").data("pageNumber");
    let currentPageAnimationCont = page
    let pagingAnimationClass = "";

    if (!formUtil.checkEmptyValue(gridId)) gridId = "gi-Grid";

    if (formUtil.checkEmptyValue(prePageAnimationCont)) {
        //애니메이션 효과 적용
        if (prePageAnimationCont > currentPageAnimationCont) {
            pagingAnimationClass = "tilt-in-left-1";
        } else if (prePageAnimationCont < currentPageAnimationCont) {
            pagingAnimationClass = "tilt-in-right-1";
        } else if (prePageAnimationCont === currentPageAnimationCont) {
            pagingAnimationClass = "fade-in";
        }
    }


    layout.list.map((item) => {
        let hidden = "";
        let sort = "";
        //그리드 데이터 각 row 생성하기 위해 데이터 담기
        headerItem.push({
            ID: item.ID,
            WIDTH: item.WIDTH,
            TEXT_ALIGN: item.TEXT_ALIGN,
            FONT_SIZE: item.FONT_SIZE,
            TYPE: item.TYPE,
            HEADER: item.HEADER,
            COMMON_CODE_GROUP_ID: item.COMMON_CODE_GROUP_ID,
            TARGET: item.TARGET,
            HIDDEN: item.HIDDEN
        });
        // //정렬 대상이라면 정렬순서 추가
        // if (gridSortManager.sortColumn !== null && gridSortManager.sortColumn !== undefined && gridSortManager.sortColumn.trim() !== '') {
        //     if (gridSortManager.sortColumn === item.ID) {
        //         sort = 'gi-grid-sort-'+gridSortManager.sortColumn;
        //     }
        // }

        //컬럼 히든처리
        if (formUtil.checkEmptyValue(item.HIDDEN)) {
            if (item.HIDDEN) {
                hidden = "gi-hidden ";
            } else {
                hidden = "gi-show-li ";
            }
        } else {
        }

        let sortArray = gridSortManager.getSort();

        if (sortArray.order !== null) {
            if (item.ID === sortArray.column) {
                sort = 'gi-grid-sort-' + sortArray.order;
            }
        }
        // grid_list_header += '<li class="gi-row-' + item.WIDTH + ' gi-flex gi-flex-center gi-overflow-scroll gi-col-30px '+hidden+'">' +
        switch (item.TYPE) {
            case "checkbox":
                grid_list_header += '<li data-column="' + item.ID + '_checkbox_all" class="resizableBox gi-min-row-50px gi-row-' + item.WIDTH + ' gi-overflow-scroll gi-col-30px ' + hidden + '' + sort + '">' +
                    '<input type="checkbox" id="' + gridId + '_checkbox_all" class="gi-padding-left-right-10px"/>' +
                    '</li>';
                break;
            default:
                grid_list_header += '<li data-column="' + item.ID + '" class="resizableBox gi-min-row-50px gi-row-' + item.WIDTH + ' gi-overflow-scroll gi-col-30px ' + hidden + '' + sort + '">' +
                    '<span class="gridColumResizer gi-padding-left-right-10px gi-flex gi-flex-justify-content-center">' + item.HEADER + '</span>' +
                    '</li>';
                break;
        }

    })

    let totalPageCount = Math.ceil(paging);
    let maxPagesToShow = 10;

    let startPage = Math.floor((page - 1) / maxPagesToShow) * maxPagesToShow + 1;
    let endPage = Math.min(totalPageCount, startPage + maxPagesToShow - 1);

    let pagingArea = '';
    let giGridPagingBtn = gridId + "_gi-grid-paging-btn";
    if (startPage > 1) {
        pagingArea += '<span class="' + giGridPagingBtn + ' gi-grid-paging-btn gi-grid-paging-prev-btn" data-field="' + (startPage - maxPagesToShow) + '">&lsaquo;</span>';
    }

    for (let i = startPage; i <= endPage; i++) {
        pagingArea += '<span class="' + giGridPagingBtn + ' gi-grid-paging-btn" data-field="' + i + '">' + i + '</span>';
    }

    if (endPage < totalPageCount) {
        pagingArea += '<span class="' + giGridPagingBtn + ' gi-grid-paging-btn gi-grid-paging-next-btn" data-field="' + (startPage + maxPagesToShow) + '">&rsaquo;</span>';
    }

    //페이징 row 개수 설정
    let options = "";
    let giGridRowSelectorId = "gi-grid-row-selector_" + gridId;
    for (let i = 1; i < 11; i++) {
        let selectedOption = "";
        if (parseInt($("#" + giGridRowSelectorId + " option:selected").val()) === 10 * i) {
            selectedOption = "selected";
        }
        options += '<option value="' + 10 * i + '" ' + selectedOption + '>' + 10 * i + ' row</option>>'
    }

    let grid =
        '            <figure class="gi-figure-content gi-overflow-scroll gi-col-100 gi-row-100 gi-flex gi-flex-justify-content-center gi-flex gi-flex-direction-column">' +
        '                <div class="gi-article-content gi-min-col-90 gi-col-100 gi-row-100">' +
        // '                    <header class="gi-row-100 gi-col-5 gi-margin-bottom-1"><h4>' + title + '</h4></header>' +
        '                    <div class="gi-row-100 gi-flex gi-margin-bottom-1 ">' +
        '                        <select class="gi-grid-row-selector" id="' + giGridRowSelectorId + '" class="gi-row-65px">' +
        options +
        '                        </select>' +
        '                    </div>' +
        '                    <div id="gi-grid-list-body" data-page-number="' + page + '" class="gi-row-100 gi-overflow-scroll gi-flex gi-flex-direction-column">' +
        '                        <ul class="gi-grid-list-header gi-row-100 gi-col-30px gi-ul gi-flex">' +
        grid_list_header +
        '                        </ul>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="gi-grid-paging-content gi-col-5 gi-row-100">' +
        pagingArea +
        '                </div>' +
        '            </figure>';


    $("#" + gridId).html(grid);

    let items = $("#" + gridId).find(".gi-show-li");
    items.map((index, item) => {
        if (index !== items.length - 1) {
            item.style.borderRight = '1px solid #bbbbbb6e';
        }
    });

    // 초기 활성화 페이징 번호 설정
    $(`.${giGridPagingBtn}[data-field="${page}"]`).addClass("active");

    //그리드 생성 후 데이터 바인딩
    return {
        //그리드 데이터 설정
        DataSet: async function (data) {
            let flag = formUtil.checkEmptyValue(data);
            let grid_list = "";
            let commonCodeGroupIdArray = [];
            if (flag) {
                for (let i = 0; i < data.length; i++) {
                    grid_list += '<ul class="gi-grid-list gi-row-100 gi-ul gi-flex ' + pagingAnimationClass + '" data-row-num="' + i + '">';

                    for (let j = 0; j < headerItem.length; j++) {
                        let item = headerItem[j];
                        let tag = "";
                        let commonCodeName = "";
                        let commonCodeValue = "";
                        let hidden = true;
                        if (formUtil.checkEmptyValue(item.COMMON_CODE_GROUP_ID)) {

                            //NOTE: 불필요한 다중 공통코드 조회 차단
                            commonCodeName = await checkSameCode(commonCodeGroupIdArray, item.COMMON_CODE_GROUP_ID, data[i]);
                            commonCodeValue = data[i][item.ID];
                        } else {
                            commonCodeName = data[i][item.ID];
                        }
                        if (formUtil.checkEmptyValue(item.HIDDEN)) {
                            if (item.HIDDEN) {
                                hidden = "hidden";
                            } else {
                                hidden = "";
                            }
                        }

                        if (!formUtil.checkEmptyValue(commonCodeName)) commonCodeName = "";

                        switch (item.TYPE) {
                            case "text":
                                commonCodeValue
                                    ?
                                    tag = '<span class="resizer gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" data-grid-value="' + commonCodeValue + '">' + commonCodeName + '</span>'
                                    :
                                    tag = '<span class="resizer gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '">' + commonCodeName + '</span>';
                                break;
                            // case "radio":
                            //     tag = '<input type="radio" class="gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" data-field="'+data[i][item.ID]+'"/>';
                            //     break;
                            case "button":
                                tag = '<button type="button" id="' + item.ID + "_" + i + '" class="gi-grid-btn gi-row-50 gi-font-size-' + item.FONT_SIZE + ' ' + item.ID + '" data-row-num="' + i + '" data-btn-target="' + item.TARGET + '">' + item.HEADER + '</button>';
                                break;
                            case "map":
                                tag = '<span id="' + item.ID + "_" + i + '" class="gi-map-btn gi-row-50 gi-font-size-' + item.FONT_SIZE + ' ' + item.ID + '" data-row-num="' + i + '" data-btn-target="' + item.TARGET + '">' + '</span>';
                                break;
                            case "checkbox":
                                tag = '<input type="checkbox" id="' + gridId + '_checkbox_' + i + '" class="gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" value="' + data[i][item.ID] + '" />';
                                break;
                        }

                        grid_list += '<li class="resizableBox gi-min-row-50px gi-row-' + item.WIDTH + ' gi-col-16px gi-flex gi-overflow-scroll gi-flex-justify-content-' + item.TEXT_ALIGN + ' gi-text-align-' + item.TEXT_ALIGN + ' ' + hidden + '" data-grid-row="' + j + '" data-field="' + item.ID + '">' + tag + '</li>';
                    }
                    grid_list += '</ul>';
                }
            } else {
                grid_list = '<div class="gi-row-100 gi-col-100 gi-flex gi-flex-align-items-center gi-flex-justify-content-center bounce-in-top">No Data</div>';
                $("#" + gridId + " .gi-grid-paging-content").html('');
            }
            $("#" + gridId + " .gi-grid-list-header").after(grid_list);

            let rows = $("#" + gridId + " .gi-grid-list");
            rows.map((i, row) => {
                let rowInLi = $(row).find("li");

                $(rows).not("[data-row-num='0']").addClass("border-top-dotted-gray");
                $(rowInLi).not(":last").addClass("gi-grid-li-border-dotted");
                unUsedMenuUISettings(row);
            })

            function unUsedMenuUISettings(e) {
                let flag = $(e).find("li[data-field='use_yn']").not(".hidden").find("span[data-grid-value]").length === 0;
                let a = ""; //NOTE: 그리드 내부에 COMMON_CODE_GROUP_ID 함수로 인해 값이 동적으로 변화 하는걸 대비(공통코드 적용시 text, 미적용시 interger)
                let b = "";
                let c = "";

                if (flag) {
                    a = $(e).find("li[data-field='use_yn']").not(".hidden").find("span").text();
                    b = "0";
                    c = "1";
                } else {
                    a = $(e).find("li[data-field='use_yn']").not(".hidden").find("span").data("gridValue");
                    b = 0;
                    c = 1;
                }

                if (a === b) {
                    $(e).addClass("unused-menu");
                } else {
                    if (a === b && a === c) {
                        $(e.$row).removeClass("unused-menu");
                    }
                }
            }
        },
        //그리드 row 개수 변경 및 페이징 버튼 이벤트 설정
        pagingSet: function (fn) {
            let range = "";

            $("#" + giGridRowSelectorId).change(function () {
                range = parseInt($("#" + giGridRowSelectorId + " option:selected").val());
                $("#" + giGridRowSelectorId).val(range);
                fn(1, range);
            })
            $("." + giGridPagingBtn).click(function () {
                // 기존에 활성화된 페이징 넘버에서 active 클래스를 제거
                $("." + giGridPagingBtn).removeClass("active");

                // 현재 클릭된 페이징 넘버에 active 클래스 추가
                $(this).addClass("active");

                let pagingNum = $(this).data("field");
                range = parseInt($("#" + giGridRowSelectorId + " option:selected").val());
                fn(pagingNum, range);
            })
        },
        //그리드 내부의 상세 버튼 클릭 이벤트 설정(버튼클릭시 호출될 함수, 그리드 헤더 부분에 설정한 버튼 ID)
        detailBtnClick: function (fn, btnName) {
            let flag = formUtil.checkEmptyValue(fn);
            if (flag) {

                //최초 한번은 이벤트 등록
                $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                    detailBtnClickEventHandler(e);
                });
                // grid 안에 상세버튼 클릭 이벤트
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect();
                            }
                            $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                                detailBtnClickEventHandler(e);
                            });
                        }
                    });
                });
                observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
                function detailBtnClickEventHandler(e) {
                    let rowId = $(e.target).data("rowNum");
                    let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                    let dataList = {};

                    dataItems.map((i, item) => {
                        let columnName = $(item).data("field");
                        let columnValue = "";

                        $(item).children().each(function () {
                            if ($(this).is("span")) {
                                formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue") + "" : columnValue = $(this).text();

                            } else if ($(this).is("button")) {
                                columnName = "target";
                                columnValue = $(this).data("btn-target");
                            }
                        });

                        if (columnValue === '') columnValue = null;

                        dataList[columnName] = columnValue;
                    })
                    // console.log(dataList);
                    fn(dataList);
                }
            } else {
                formUtil.showMessage("detailBtnClick : please set function call name");
            }
        },
        //수정 버튼 설정
        updateBtnClick: function (fn, btnName) {
            $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                updateBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                            updateBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            function updateBtnClickEventHandler(e) {
                let rowId = $(e.target).data("rowNum");
                let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                let dataList = {};

                dataItems.map((i, item) => {
                    let columnName = $(item).data("field");
                    let columnValue = "";

                    $(item).children().each(function () {
                        if ($(this).is("span")) {
                            formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue") + "" : columnValue = $(this).text();

                        } else if ($(this).is("button")) {
                            columnName = "target";
                            columnValue = $(this).data("btn-target");
                        }
                    });

                    if (columnValue === '') columnValue = null;

                    dataList[columnName] = columnValue;
                })

                // console.log(dataList);
                formUtil.popup("updatePopup_" + btnName, Message.Label.Array["CONFIRM.UPDATE"], fn, dataList);
                // fn(dataList);
            }
        },
        //삭제 버튼 설정
        deleteBtnClick: function (fn, btnName) {
            //최초 한번 이벤트 바인딩
            $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                deleteBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                            deleteBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            function deleteBtnClickEventHandler(e) {
                let rowId = $(e.target).data("rowNum");
                let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                let dataList = {};

                dataItems.map((i, item) => {
                    let columnName = $(item).data("field");
                    let columnValue = "";

                    $(item).children().each(function () {
                        if ($(this).is("span")) {
                            formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue") + "" : columnValue = $(this).text();

                        } else if ($(this).is("button")) {
                            columnName = "target";
                            columnValue = $(this).data("btn-target");
                        }
                    });

                    if (columnValue === '') columnValue = null;

                    dataList[columnName] = columnValue;
                })

                // console.log(dataList);
                formUtil.popup("deletePopup_" + btnName, Message.Label.Array["CONFIRM.DELETE"], fn, dataList);
                // fn(dataList);
            }
        },
        //수정 버튼 설정
        resendBtnClick: function (fn, btnName) {
            $("." + btnName).off("click.resendBtnClickEventHandler").on("click.resendBtnClickEventHandler", function (e) {
                resendBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("." + btnName).off("click.resendBtnClickEventHandler").on("click.resendBtnClickEventHandler", function (e) {
                            resendBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            function resendBtnClickEventHandler(e) {
                let rowId = $(e.target).data("rowNum");
                let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                let dataList = {};
                dataItems.map((i, item) => {
                    let columnName = $(item).data("field");
                    let columnValue = "";

                    $(item).children().each(function () {
                        if ($(this).is("span")) {
                            formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue") + "" : columnValue = $(this).text();

                        } else if ($(this).is("button")) {
                            columnName = "target";
                            columnValue = $(this).data("btn-target");
                        }
                    });

                    if (columnValue === '') columnValue = null;

                    dataList[columnName] = columnValue;
                })
                // console.log(dataList);
                formUtil.popup("updatePopup_" + btnName, Message.Label.Array["CONFIRM.RESEND"], fn, dataList);
                // fn(dataList);
            }
        },
        mapBtnClick: function (tagId, keywordColumnName, btnName) {
            let map = new kakaoMap();
            //최초 한번 이벤트 바인딩
            $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                mapBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                            mapBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            function mapBtnClickEventHandler(e) {
                let mapCloseBtn = '<div class="map_close-btn"><span>X</span></div>'
                let $tagId = $("#" + tagId);
                let targetUl = $(e.currentTarget).parent().parent();
                let targetLi = $(targetUl).children("li");
                let keyword = "";

                $("[data-side-grid-open]").map((i, item) => {
                    $(item).attr("data-side-grid-open", "false");
                    $(item).empty();
                })

                $($tagId).attr("data-side-grid-open", "true");

                targetLi.map((i, item) => {
                    if ($(item).data("field") === keywordColumnName) {
                        keyword = $(item)[0].innerText;
                    }
                });

                map.createMap(tagId, keyword);
                $tagId.append(mapCloseBtn);

                $(".map_close-btn").click(function (e) {
                    $($tagId).attr("data-side-grid-open", "false");
                    $("#" + tagId).empty();
                })
            }
        },
        sideOpenBtnClick: function (tagId, btnName) {
            let $tagId = $("#" + tagId);
            let $btnName = $("." + btnName);
            let sideGridOpenCloseBtn = '<div class="side_grid_close-btn"><span>X</span></div>'
            let $sideGridCloseBtn = $(".side_grid_close-btn");

            if ($btnName.length === 0) {
                // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                            }
                            let $btnName = $("." + btnName);
                            // 이벤트 처리
                            $btnName.off("click.sideOpenBtnClickEventHandler").on("click.sideOpenBtnClickEventHandler", function (e) {
                                sideOpenBtnClickEventHandler(e);
                            });
                        }
                    });
                });

                observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            } else {
                $btnName.off("click.sideOpenBtnClickEventHandler").on("click.sideOpenBtnClickEventHandler", function (e) {
                    sideOpenBtnClickEventHandler(e);
                });
            }

            function sideOpenBtnClickEventHandler(e) {
                $("[data-side-grid-open]").map((i, item) => {
                    $(item).attr("data-side-grid-open", "false");
                })

                $($tagId).attr("data-side-grid-open", "true");
                $tagId.append(sideGridOpenCloseBtn);
                sideGridCloseBtnEvent();

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                            }
                            if ($tagId.find(".side_grid_close-btn").length === 0) {
                                $tagId.append(sideGridOpenCloseBtn);
                                sideGridCloseBtnEvent();
                            }
                        }
                    });
                });

                observer.observe($("#" + tagId)[0], { childList: true, subtree: true });

                function sideGridCloseBtnEvent() {
                    $(".side_grid_close-btn").off("click.sideGridCloseBtnClickEventHandler").on("click.sideGridCloseBtnClickEventHandler", function (e) {
                        sideGridCloseBtnClickEventHandler();
                    })
                    function sideGridCloseBtnClickEventHandler() {
                        $("[data-side-grid-open]").map((i, item) => {
                            if (formUtil.checkEmptyValue($(item).data("sideGridOpenInit"))) {
                                let flag = $(item).data("sideGridOpenInit");
                                flag = flag.toString();
                                $(item).attr("data-side-grid-open", flag);
                            }
                        })
                        $($tagId).attr("data-side-grid-open", "false");
                        $("#" + tagId).empty();
                    }
                }
            }
        },
        //정렬용 컬럼 클릭 이벤트
        sortDataSet: function (fn, notSortList) {
            notSortList = notSortList || [];
            // 이벤트 위임: 부모 요소에 클릭 이벤트 등록
            $("#" + gridId + ' ul.gi-grid-list-header').off('click').on('click', 'li', function (e) {
                let column = $(this).data('column');

                // 버튼 컬럼이나 제외 컬럼은 처리하지 않음
                if (column.endsWith('_btn') || column.endsWith('_checkbox_all') || notSortList.includes(column)) {
                    return;
                }

                // 정렬 상태 변경
                if (gridSortManager.sortColumn === column && gridSortManager.sortOrder === 'asc') {
                    gridSortManager.setSort(column, 'desc');
                } else if (gridSortManager.sortColumn === column && gridSortManager.sortOrder === 'desc') {
                    gridSortManager.setSort(null, null); // 정렬 해제
                } else {
                    gridSortManager.setSort(column, 'asc');
                }

                // 현재 설정된 옵션
                let pagingOption = $('#' + giGridRowSelectorId + ' option:selected').val();
                let currentPage = $('.active').data('field');

                // 정렬용 콜백 함수 실행
                fn(currentPage, pagingOption, gridSortManager.sortColumn, gridSortManager.sortOrder);
            });
        },
        rowClick: function (fn) {
            // 최초 로딩 시 이벤트를 설정
            setRowClickEvent(fn);

            // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                        }
                        // 이벤트 처리
                        setRowClickEvent(fn);  // 추가된 그리드에도 rowClick 이벤트 설정
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });

            // rowClick 이벤트를 설정하는 함수
            function setRowClickEvent(fn) {
                let gridSelector = "#" + gridId;
                $(gridSelector).find(".gi-grid-list").addClass("gi-cursor-pointer");
                $(gridSelector).find(".gi-grid-list")
                    .mouseenter(function () {
                        $(this).addClass("gi-grid-list-hover");
                    })
                    .mouseleave(function () {
                        $(this).removeClass("gi-grid-list-hover");
                    })
                    .click(function () {
                        if ($(this).hasClass("gi-grid-list-select")) {
                            $(this).removeClass("gi-grid-list-select");
                        } else {
                            $(gridSelector).find(".gi-grid-list").removeClass("gi-grid-list-select");
                            $(this).addClass("gi-grid-list-select");
                        }
                    });


                $(gridSelector).find("ul[data-row-num]").off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                    if (!$(e.target).is("button")) {
                        rowClickEventHandler(e, fn);
                    }
                });
            }

            // rowClick 이벤트 핸들러
            // rowClick 이벤트 핸들러
            function rowClickEventHandler(e, fn) {
                let columnArray = $(e.currentTarget).children("li");
                let resultList = [];
                columnArray.map((i, item) => {
                    const columnName = $(item).data("field");
                    const columnValue = $(item).children("span").text();
                    const hasDataGridValue = $(item).children("span").data("gridValue");

                    if (formUtil.checkEmptyValue(hasDataGridValue)) {
                        resultList[columnName + "_value"] = hasDataGridValue;
                    }
                    resultList[columnName] = columnValue;
                });
                fn(resultList, e);
            }
        },
        //NOTE : doubleClick 이벤트 설정
        rowDoubleClick: function (fn) {
            // 최초 로딩 시 이벤트를 설정
            setRowDoubleClickEvent(fn);

            // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                        }
                        // 이벤트 처리
                        setRowDoubleClickEvent(fn);  // 추가된 그리드에도 rowClick 이벤트 설정
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });

            // rowClick 이벤트를 설정하는 함수
            function setRowDoubleClickEvent(fn) {
                let gridSelector = "#" + gridId;
                $(gridSelector).find(".gi-grid-list").addClass("gi-cursor-pointer");
                $(gridSelector).find(".gi-grid-list")
                    .mouseenter(function () {
                        $(this).addClass("gi-grid-list-hover");
                        $(this).addClass("no-drag");
                    })
                    .mouseleave(function () {
                        $(this).removeClass("gi-grid-list-hover");
                    });
                $(gridSelector).find("ul[data-row-num]").off("dblclick.rowDoubleClickEventHandler").on("dblclick.rowDoubleClickEventHandler", function (e) {
                    if (!$(e.target).is("button") && e.target.type !== "checkbox") {
                        rowDoubleClickEventHandler(e, fn);
                    }
                });
            }

            // rowClick 이벤트 핸들러
            // rowClick 이벤트 핸들러
            function rowDoubleClickEventHandler(e, fn) {
                let columnArray = $(e.currentTarget).children("li");
                let resultList = [];

                columnArray.map((i, item) => {
                    const columnName = $(item).data("field");
                    const columnValue = $(item).children("span").text();
                    const hasDataGridValue = $(item).children("span").data("gridValue");

                    if (formUtil.checkEmptyValue(hasDataGridValue)) {
                        resultList[columnName + "_value"] = hasDataGridValue;
                    }
                    resultList[columnName] = columnValue;
                });
                fn(resultList);
            }
        },
        rowCheckboxClick: function (fn) {
            setRowCheckBoxClickEvent(fn);
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                        }
                        // 이벤트 처리
                        setRowCheckBoxClickEvent(fn);  // 추가된 그리드에도 CheckBoxClick 이벤트 설정
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });

            function setRowCheckBoxClickEvent(fn) {
                let gridSelector = "#" + gridId;
                $(gridSelector).find("input[type='checkbox']").addClass("gi-cursor-pointer");
                $(gridSelector).find("input[type='checkbox']").off("click.rowCheckBoxClickEventHandler").on("click.rowCheckBoxClickEventHandler", function (e) {
                    if (!$(e.target).is("button")) {
                        rowCheckBoxClickEventHandler(e, fn);
                    }
                });
            }
            function rowCheckBoxClickEventHandler(e, fn) {
                let $checkBoxArray = $("#" + gridId + " input[type='checkbox']");
                let resultList = [];
                let isCheckBoxAll = e.currentTarget.id.includes("_checkbox_all");
                let isChecked = $(e.currentTarget).is(":checked");

                // 전체 선택/해제 로직 최적화
                if (isCheckBoxAll) {
                    $checkBoxArray.prop("checked", isChecked);
                }

                // 체크된 항목 정보 수집
                $checkBoxArray.each((i, item) => {
                    if ($(item).is(":checked") && !item.id.includes("_checkbox_all")) {
                        let tempArray = {};
                        $(item).closest(".gi-grid-list").children("li").each((_, liItem) => {
                            const columnName = $(liItem).data("field");
                            const columnValue = $(liItem).children("span").text();
                            tempArray[columnName] = columnValue;
                        });
                        resultList.push(tempArray);
                    }
                });

                // "_checkbox_all" 체크 상태 동기화
                $checkBoxArray.each((_, item) => {
                    if (item.id.includes("_checkbox_all")) {
                        $(item).prop("checked", resultList.length === $checkBoxArray.length - 1);
                    }
                });

                fn(resultList);
            }
        },
        rowMultiSelectClick: function (fn) {
            setMultiRowClickEvent(fn);
            // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                        }
                        setMultiRowClickEvent(fn)// 이벤트 처리
                    }
                });
            });

            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            function setMultiRowClickEvent(fn) {
                $(".gi-grid-list").addClass("gi-cursor-pointer");
                $(".gi-grid-list").mouseenter(function () {
                    $(this).addClass("gi-grid-list-hover");
                }).mouseleave(function () {
                    $(this).removeClass("gi-grid-list-hover");
                });

                // 클릭 시 이벤트 설정
                $("ul[data-row-num]").off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                    if (!$(e.target).is("button")) {
                        rowMultiClickEventHandler(e, fn);
                    }
                });
                function rowMultiClickEventHandler(e, fn) {
                    let target = e.currentTarget;
                    let isSelected = target.classList.contains("gi-grid-list-multi_select");
                    let resultList = [];

                    if (isSelected) {
                        $(target).removeClass("gi-grid-list-multi_select");
                    } else {
                        $(target).addClass("gi-grid-list-multi_select");
                    }

                    let isSelectedVolume = $("#" + gridId + " .gi-grid-list-multi_select");
                    isSelectedVolume.each((i, item) => {
                        let columnArray = $(item).children("li");
                        let tempList = [];
                        columnArray.map((i, item) => {
                            const columnName = $(item).data("field");
                            const columnValue = $(item).children("span").text();
                            tempList[columnName] = columnValue;
                        });
                        resultList.push(tempList);
                    })
                    fn(resultList);
                }
            }
        },
        gridColumResize: function (gridId) {
            formUtil.gridResize(gridId);
        }
    }
}

//NOTE: 불필요한 COMMON_CODE 조회 차단 로직
async function checkSameCode(commonCodeGroupIdArray, commonGroupCodeId, cont) {
    let param = { group_id: commonGroupCodeId };
    let commonCodeArray = [];
    //NOTE: 공통코드 Array에 그리드 COMMON_CODE_GROUP_ID 값과 일치하는 값이 있는지 여부
    let isExist = commonCodeGroupIdArray.some(item => {
        return Object.keys(item)[0] === commonGroupCodeId;
    });

    //NOTE : 그리드 DataSet 호출 시 그리드 내의 COMMON_CODE_GROUP_ID로 COMMON_CODE 조회 후 commonCodeGroupIdArray 배열에 추가
    if (!isExist) {
        let commonCodeList = await findCommonCode(param);
        commonCodeList.map(item => {
            commonCodeArray.push({ [item.code_id]: item.code_name });
        })
        commonCodeGroupIdArray.push({ [commonGroupCodeId]: commonCodeArray });
    }
    //NOTE: commonCodeGroupIdArray 배열의 COMMON_CODE 키:값 으로 데이터 바인딩
    for (let key in cont) {
        let returnVALUE = "";
        let lowerKey = commonGroupCodeId.toLowerCase();
        //NOTE : 그리드 row의 키가 COMMON_CODE_GROUP_ID와 일치 하는지 여부 파악
        if (key.toLowerCase() === lowerKey) {
            //NOTE: commonCodeGroupIdArray 배열안의 키:값과 일치 하면 CODE_NAME 리턴
            commonCodeGroupIdArray.find(item => {
                if (formUtil.checkEmptyValue(item[commonGroupCodeId])) {
                    item[commonGroupCodeId].find(valueItem => {
                        if (Object.keys(valueItem)[0] === cont[key]) {
                            returnVALUE = valueItem[cont[key]];
                        }
                    })
                }
            })
            return returnVALUE;
        }
    }
    // console.log("푸쉬 푸쉬::", JSON.parse(JSON.stringify(commonCodeGroupIdArray)));
}
FormUtility.prototype.giGridHierarchy = function (layout, paging, page, gridId) {
    let gridSortManager = formUtil.gridSortManager;
    //localStorage에서 정렬값을 가져와 setting
    gridSortManager.loadSortState();
    if (!formUtil.checkEmptyValue(paging)) paging = 1;
    if (!formUtil.checkEmptyValue(page)) page = 1;

    let title = layout.title;
    let grid_list_header = "";
    let headerItem = [];
    let prePageAnimationCont = $("#gi-grid-list-body").data("pageNumber");
    let currentPageAnimationCont = page
    let pagingAnimationClass = "";
    let application_level_hierarchyOptionColumn = "";
    let application_parent_hierarchyOptionColumn = "";
    let application_sub_hierarchyOptionColumn = "";

    if (!formUtil.checkEmptyValue(gridId)) gridId = "gi-Grid";

    if (formUtil.checkEmptyValue(prePageAnimationCont)) {
        //애니메이션 효과 적용
        if (prePageAnimationCont > currentPageAnimationCont) {
            pagingAnimationClass = "tilt-in-left-1";
        } else if (prePageAnimationCont < currentPageAnimationCont) {
            pagingAnimationClass = "tilt-in-right-1";
        } else if (prePageAnimationCont === currentPageAnimationCont) {
            pagingAnimationClass = "fade-in";
        }
    }


    layout.list.map((item) => {
        let hidden = "";
        let sort = "";
        //그리드 데이터 각 row 생성하기 위해 데이터 담기
        headerItem.push({
            ID: item.ID,
            WIDTH: item.WIDTH,
            TEXT_ALIGN: item.TEXT_ALIGN,
            FONT_SIZE: item.FONT_SIZE,
            TYPE: item.TYPE,
            HEADER: item.HEADER,
            COMMON_CODE_GROUP_ID: item.COMMON_CODE_GROUP_ID,
            TARGET: item.TARGET,
            HIDDEN: item.HIDDEN,
            VISIBLE_OPTION_BTN: item.VISIBLE_OPTION_BTN
        });
        // //정렬 대상이라면 정렬순서 추가
        // if (gridSortManager.sortColumn !== null && gridSortManager.sortColumn !== undefined && gridSortManager.sortColumn.trim() !== '') {
        //     if (gridSortManager.sortColumn === item.ID) {
        //         sort = 'gi-grid-sort-'+gridSortManager.sortColumn;
        //     }
        // }

        //컬럼 히든처리
        if (formUtil.checkEmptyValue(item.HIDDEN)) {
            if (item.HIDDEN) {
                hidden = "gi-hidden ";
            } else {
                hidden = "gi-show-li ";
            }
        } else {
        }
        let sortArray = gridSortManager.getSort();
        if (sortArray.order !== null) {
            if (item.ID === sortArray.column) {
                sort = 'gi-grid-sort-' + sortArray.order;
            }
        }
        // grid_list_header += '<li class="gi-row-' + item.WIDTH + ' gi-flex gi-flex-center gi-overflow-scroll gi-col-30px '+hidden+'">' +
        grid_list_header +=
            '<li data-column="' + item.ID + '" class="resizableBox gi-min-row-50px gi-row-' + item.WIDTH + ' gi-overflow-scroll gi-col-30px ' + hidden + '' + sort + '">' +
            '<span class="gridColumResizer gi-padding-left-right-10px gi-flex gi-flex-justify-content-center">' + item.HEADER + '</span>' +
            '</li>';
    })
    let totalPageCount = Math.ceil(paging);
    let maxPagesToShow = 10;

    let startPage = Math.floor((page - 1) / maxPagesToShow) * maxPagesToShow + 1;
    let endPage = Math.min(totalPageCount, startPage + maxPagesToShow - 1);

    let pagingArea = '';
    let giGridPagingBtn = gridId + "_gi-grid-paging-btn";
    if (startPage > 1) {
        pagingArea += '<span class="' + giGridPagingBtn + ' gi-grid-paging-btn gi-grid-paging-prev-btn" data-field="' + (startPage - maxPagesToShow) + '">&lsaquo;</span>';
    }

    for (let i = startPage; i <= endPage; i++) {
        pagingArea += '<span class="' + giGridPagingBtn + ' gi-grid-paging-btn" data-field="' + i + '">' + i + '</span>';
    }

    if (endPage < totalPageCount) {
        pagingArea += '<span class="' + giGridPagingBtn + ' gi-grid-paging-btn gi-grid-paging-next-btn" data-field="' + (startPage + maxPagesToShow) + '">&rsaquo;</span>';
    }

    //페이징 row 개수 설정
    let options = "";
    let giGridRowSelectorId = "gi-grid-row-selector_" + gridId;
    for (let i = 1; i < 11; i++) {
        let selectedOption = "";
        if (parseInt($("#" + giGridRowSelectorId + " option:selected").val()) === 10 * i) {
            selectedOption = "selected";
        }
        options += '<option value="' + 10 * i + '" ' + selectedOption + '>' + 10 * i + ' row</option>>'
    }

    let grid =
        '            <figure class="gi-figure-content gi-overflow-scroll gi-col-100 gi-row-100 gi-flex gi-flex-justify-content-center gi-flex gi-flex-direction-column">' +
        '                <div class="gi-article-content gi-min-col-90 gi-col-100 gi-row-100">' +
        // '                    <header class="gi-row-100 gi-col-5 gi-margin-bottom-1"><h4>' + title + '</h4></header>' +
        //'                    <div class="gi-row-100 gi-flex gi-margin-bottom-1 gi-col-25px">' +
        // '                        <select id="gi-grid-row-selector" class="gi-row-65px">' +
        // options+
        // '                        </select>'+
        //'                    </div>'+
        '                    <div id="gi-grid-list-body" data-page-number="' + page + '" class="gi-row-100 gi-overflow-scroll gi-flex gi-flex-direction-column gi-margin-top-10px">' +
        '                        <ul class="gi-grid-list-header gi-row-100 gi-col-30px gi-ul gi-flex">' +
        grid_list_header +
        '                        </ul>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="gi-grid-paging-content gi-col-5 gi-row-100">' +
        // pagingArea +
        '                </div>' +
        '            </figure>';


    $("#" + gridId).html(grid);

    const items = document.querySelectorAll('.gi-grid-list-header > .gi-show-li');
    items.forEach((item, index) => {
        if (index !== items.length - 1) {
            item.style.borderRight = '1px solid #bbbbbb6e';
        }
    });

    // 초기 활성화 페이징 번호 설정
    $(`.${giGridPagingBtn}[data-field="${page}"]`).addClass("active");

    //그리드 생성 후 데이터 바인딩
    return {
        //계층구조 기준 컬럼 설정
        DataSet: async function (data) {
            let flag = formUtil.checkEmptyValue(data);
            let isHierarchy = formUtil.checkEmptyValue(application_level_hierarchyOptionColumn)
                && formUtil.checkEmptyValue(application_parent_hierarchyOptionColumn)
                && formUtil.checkEmptyValue(application_sub_hierarchyOptionColumn);
            let grid_list = "";
            let commonCodeGroupIdArray = [];

            //NOTE: rows BTN 노출 이벤트 로직 설정
            let visibleOptionArray = [];
            let originalDataForVisibleOption = [];
            function constSetVisibleOption() {
                headerItem.map(item => {
                    if (formUtil.checkEmptyValue(item.VISIBLE_OPTION_BTN)) {
                        item.VISIBLE_OPTION_BTN["BTN_ID"] = item.ID;
                        visibleOptionArray.push(item.VISIBLE_OPTION_BTN);
                    }
                })
            }

            if (flag) {
                //NOTE: rows BTN 노출 이벤트 함수 호출
                constSetVisibleOption();
                for (let i = 0; i < data.length; i++) {
                    grid_list += '<ul class="gi-grid-list gi-row-100 gi-ul gi-flex ' + pagingAnimationClass + '" data-row-num="' + i + '">';
                    originalDataForVisibleOption = [];
                    for (let j = 0; j < headerItem.length; j++) {
                        let item = headerItem[j];
                        let tag = "";
                        let commonCodeName = "";
                        let commonCodeValue = "";
                        let hidden = true;

                        if (formUtil.checkEmptyValue(item.COMMON_CODE_GROUP_ID)) {
                            commonCodeName = await checkSameCode(commonCodeGroupIdArray, item.COMMON_CODE_GROUP_ID, data[i]);
                            commonCodeValue = data[i][item.ID];
                        } else {
                            commonCodeName = data[i][item.ID];
                        }
                        if (formUtil.checkEmptyValue(item.HIDDEN)) {
                            if (item.HIDDEN) {
                                hidden = "hidden";
                            } else {
                                hidden = "";
                            }
                        }

                        //NOTE: rows BTN 노출 이벤트 함수 호출
                        visibleOptionArray.map(visibleOptionKeys => {
                            //NOTE: VISIBLE_OPTION_BTN:[{"menu_level":"0"},{"menu_level":"1"}] 조건이 배열일때 적용 합수
                            if (formUtil.checkEmptyValue(visibleOptionKeys.length)) {
                                visibleOptionKeys.map(ArrItem => {
                                    if (Object.keys(ArrItem)[0] === item.ID) {
                                        let isExist = originalDataForVisibleOption.some(optionItem => {
                                            return Object.keys(optionItem)[0] === item.ID;
                                        });

                                        if (!isExist) {
                                            if (ArrItem[item.ID] === commonCodeName) {
                                                originalDataForVisibleOption[visibleOptionKeys.BTN_ID] = "true";
                                            }
                                        }
                                    }
                                })
                            } else {
                                //NOTE: VISIBLE_OPTION_BTN:{"menu_level":"0"} 조건이 하나 일때
                                if (Object.keys(visibleOptionKeys)[0] === item.ID) {
                                    let isExist = originalDataForVisibleOption.some(optionItem => {
                                        return Object.keys(optionItem)[0] === item.ID;
                                    });

                                    if (!isExist) {
                                        if (visibleOptionKeys[item.ID] === commonCodeName) {
                                            originalDataForVisibleOption[visibleOptionKeys.BTN_ID] = "true";
                                        }
                                    }
                                }
                            }
                        })
                        if (!formUtil.checkEmptyValue(commonCodeName)) commonCodeName = "";
                        switch (item.TYPE) {
                            case "text":
                                commonCodeValue
                                    ?
                                    tag = '<span class="resizer gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" data-grid-value="' + commonCodeValue + '">' + commonCodeName + '</span>'
                                    :
                                    tag = '<span class="resizer gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '">' + commonCodeName + '</span>';
                                break;
                            // case "radio":
                            //     tag = '<input type="radio" class="gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" data-field="'+data[i][item.ID]+'"/>';
                            //     break;
                            case "button":
                                if (!originalDataForVisibleOption[item.ID]) {
                                    tag = '<button type="button" id="' + item.ID + "_" + i + '" class="resizer gi-grid-btn gi-row-50 gi-font-size-' + item.FONT_SIZE + ' ' + item.ID + '" data-row-num="' + i + '" data-btn-target="' + item.TARGET + '">' + item.HEADER + '</button>';
                                    break;
                                }
                            // case "checkbox":
                            //     tag = '<input type="checkbox" class="gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" value="' + data[i][item.ID] + '" />';
                            //     break;
                        }
                        grid_list += '<li class="resizableBox gi-min-row-50px gi-row-' + item.WIDTH + ' gi-col-16px gi-flex gi-overflow-scroll gi-flex-justify-content-' + item.TEXT_ALIGN + ' gi-text-align-' + item.TEXT_ALIGN + ' ' + hidden + '" data-grid-row="' + j + '" data-field="' + item.ID + '">' + tag + '</li>';
                    }
                    grid_list += '</ul>';
                }
            } else {
                grid_list = '<div class="gi-row-100 gi-col-100 gi-flex gi-flex-align-items-center gi-flex-justify-content-center bounce-in-top">No Data</div>';
                $("#" + gridId + " .gi-grid-paging-content").html('');
            }

            $("#" + gridId + " .gi-grid-list-header").after(grid_list);

            if (isHierarchy) {
                // 1. 필요한 데이터 추출 rows에 보관
                let rows = [];
                $("#" + gridId + " .gi-grid-list").each(function () {
                    let $row = $(this);
                    // 각 행 내부에서 필요한 값을 추출 (trim()으로 공백 제거)
                    let level = $row.find(`li[data-field="${application_level_hierarchyOptionColumn}"] span`)
                        .first().text().trim();
                    let parentVal = $row.find(`li[data-field="${application_parent_hierarchyOptionColumn}"] span`)
                        .first().text().trim();
                    let subVal = $row.find(`li[data-field="${application_sub_hierarchyOptionColumn}"] span`)
                        .first().text().trim();
                    rows.push({ $row, level, parentVal, subVal });
                });

                // [추가] 자식 여부 확인
                rows.forEach(r => {
                    r.hasChild = rows.some(child => child.subVal === r.parentVal);
                });

                // 2. 레벨별 그룹화
                let depth0 = rows.filter(r => r.level === "0");
                let depth1 = rows.filter(r => r.level === "1");
                let depth2 = rows.filter(r => r.level === "2");

                // HIDDEN이 아닌 첫번째 li에 계층 클래스 추가
                rows.forEach((r, i) => {
                    //NOTE: row의 li 요소중 hidden과 마지막 li 요소를 제외한 li에 border dotted 추가
                    r.$row.find("li").not('.hidden').not(":last").addClass("gi-grid-li-border-dotted");

                    let $firstLi = r.$row.find("li").not('.hidden').first();

                    // [추가] 토글 아이콘 추가 (자식이 있는 경우에만)
                    if (r.hasChild) {
                        if ($firstLi.find('.gi-tree-toggle').length === 0) {
                            $firstLi.prepend('<i class="fa-solid fa-caret-down gi-tree-toggle expanded" style="cursor:pointer; margin-right:5px; float: left;"></i>');
                        }
                    }

                    if (r.level === "0") {
                        $firstLi.addClass("gi-grid-hierarchy-depth0");
                        //NOTE: 첫번째 row를 제외한 row에 border-top-dotted-gray 추가
                        if (r !== depth0[0]) {
                            r.$row.addClass("border-top-dotted-gray");
                        }
                        unUsedMenuUISettings(r);

                    } else if (r.level === "1") {
                        $firstLi.addClass("gi-grid-hierarchy-depth1");
                        unUsedMenuUISettings(r);
                    } else if (r.level === "2") {
                        $firstLi.addClass("gi-grid-hierarchy-depth2");
                        unUsedMenuUISettings(r);
                    }

                    //NOTE: 사용여부에 따른 ui 변경
                    function unUsedMenuUISettings(e) {
                        //NOTE: 미사용시 메뉴 비활성화
                        let flag = e.$row.find("li[data-field='use_yn']").not(".hidden").find("span[data-grid-value]").length === 0;
                        let a = ""; //NOTE: 그리드 내부에 COMMON_CODE_GROUP_ID 함수로 인해 값이 동적으로 변화 하는걸 대비(공통코드 적용시 text, 미적용시 interger)
                        let b = "";
                        let c = "";

                        if (flag) {
                            a = e.$row.find("li[data-field='use_yn']").not(".hidden").find("span").text();
                            b = "0";
                            c = "1";
                        } else {
                            a = e.$row.find("li[data-field='use_yn']").not(".hidden").find("span").data("gridValue");
                            b = 0;
                            c = 1;
                        }

                        if (a === b) {
                            $(e.$row).addClass("unused-menu");
                            let parentValue = $(e)[0].parentVal;
                            let dept2CodeName = "";
                            rows.forEach(item => {
                                if (item.subVal === parentValue) {
                                    $(item.$row).addClass("unused-menu")
                                    dept2CodeName = $(item.$row).find("li[data-field='menu_code']").find("span").text();
                                }
                                if (item.subVal === dept2CodeName) {
                                    $(item.$row).addClass("unused-menu")
                                }
                            });
                        } else {
                            //NOTE: 사용중인 최상위 메뉴의 하위메뉴 비활성화
                            if (a === b && a === c) {
                                $(e.$row).removeClass("unused-menu");
                            }
                        }
                    }
                });

                // 3. 데이터 배치
                let finalOrder = [];
                depth0.forEach((r0, idx0) => {
                    finalOrder.push(r0);
                    // depth1에서 부모로 찾기
                    let matchingDepth1 = depth1.filter(r1 => r1.subVal === r0.parentVal);
                    matchingDepth1.forEach((r1, idx1) => {
                        let isParentLast = (idx1 === matchingDepth1.length - 1);
                        if (isParentLast) {
                            r1.$row.find(".gi-grid-hierarchy-depth1").addClass("gi-grid-hierarchy-last");
                        }
                        finalOrder.push(r1);
                        // depth2에서 부모로 찾기
                        let matchingDepth2 = depth2.filter(r2 => r2.subVal === r1.parentVal);
                        matchingDepth2.forEach((r2, idx2) => {
                            if (isParentLast) {
                                r2.$row.find(".gi-grid-hierarchy-depth2").addClass("gi-grid-hierarchy-parent-last");
                            }
                            if (idx2 === matchingDepth2.length - 1) {
                                r2.$row.find(".gi-grid-hierarchy-depth2").addClass("gi-grid-hierarchy-last");
                            }
                            finalOrder.push(r2);
                        });
                    });
                });

                // 4. 삽입
                let $body = $("#" + gridId + " #gi-grid-list-body");

                $body.find("ul.gi-grid-list").detach(); //remove대신 사용

                finalOrder.forEach(r => {
                    $body.append(r.$row);
                });

                // [추가] 토글 이벤트 핸들러
                $body.off("click", ".gi-tree-toggle").on("click", ".gi-tree-toggle", function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    let $btn = $(this);
                    let $row = $btn.closest("ul.gi-grid-list");
                    let isExpanded = $btn.hasClass("expanded");

                    // 현재 Row의 PK (parentVal)
                    let myPK = $row.find(`li[data-field="${application_parent_hierarchyOptionColumn}"] span`).first().text().trim();

                    if (isExpanded) {
                        $btn.removeClass("expanded fa-caret-down").addClass("collapsed fa-caret-right");
                        toggleChildren(myPK, false);
                    } else {
                        $btn.removeClass("collapsed fa-caret-right").addClass("expanded fa-caret-down");
                        toggleChildren(myPK, true);
                    }
                });

                function toggleChildren(parentPK, show) {
                    $body.find("ul.gi-grid-list").each(function () {
                        let $childRow = $(this);
                        // Child의 FK (subVal)
                        let childFK = $childRow.find(`li[data-field="${application_sub_hierarchyOptionColumn}"] span`).first().text().trim();

                        if (childFK === parentPK) {
                            if (show) {
                                $childRow.removeClass("gi-hidden");
                                // 자식이 펼쳐져 있다면 그 후손도 보여줌
                                let $childBtn = $childRow.find(".gi-tree-toggle");
                                if ($childBtn.hasClass("expanded")) {
                                    let childPK = $childRow.find(`li[data-field="${application_parent_hierarchyOptionColumn}"] span`).first().text().trim();
                                    toggleChildren(childPK, true);
                                }
                            } else {
                                $childRow.addClass("gi-hidden");
                                // 후손도 숨김
                                let childPK = $childRow.find(`li[data-field="${application_parent_hierarchyOptionColumn}"] span`).first().text().trim();
                                toggleChildren(childPK, false);
                            }
                        }
                    });
                }
            }
        },
        //그리드 데이터 설정
        HierarchyOption: function (hierarchyOptionItem) {
            application_level_hierarchyOptionColumn = hierarchyOptionItem.level_column;
            application_parent_hierarchyOptionColumn = hierarchyOptionItem.parent_depth_column;
            application_sub_hierarchyOptionColumn = hierarchyOptionItem.child_depth_column;
        },
        //그리드 row 개수 변경 및 페이징 버튼 이벤트 설정
        pagingSet: function (fn) {
            let range = "";
            $("#" + giGridRowSelectorId).change(function () {
                range = parseInt($("#" + giGridRowSelectorId + " option:selected").val());
                $("#" + giGridRowSelectorId).val(range);
                fn(1, range);
            })
            $("." + giGridPagingBtn).click(function () {
                // 기존에 활성화된 페이징 넘버에서 active 클래스를 제거
                $("." + giGridPagingBtn).removeClass("active");

                // 현재 클릭된 페이징 넘버에 active 클래스 추가
                $(this).addClass("active");

                let pagingNum = $(this).data("field");
                range = parseInt($("#" + giGridRowSelectorId + " option:selected").val());
                fn(pagingNum, range);
            })
        },
        //그리드 내부의 상세 버튼 클릭 이벤트 설정(버튼클릭시 호출될 함수, 그리드 헤더 부분에 설정한 버튼 ID)
        detailBtnClick: function (fn, btnName) {
            let flag = formUtil.checkEmptyValue(fn);
            if (flag) {

                //최초 한번은 이벤트 등록
                $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                    detailBtnClickEventHandler(e);
                });
                // grid 안에 상세버튼 클릭 이벤트
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect();
                            }
                            $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                                detailBtnClickEventHandler(e);
                            });
                        }
                    });
                });
                observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
                function detailBtnClickEventHandler(e) {
                    let rowId = $(e.target).data("rowNum");
                    let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                    let dataList = {};

                    dataItems.map((i, item) => {
                        let columnName = $(item).data("field");
                        let columnValue = "";

                        $(item).children().each(function () {
                            if ($(this).is("span")) {
                                formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue") + "" : columnValue = $(this).text();

                            } else if ($(this).is("button")) {
                                columnName = "target";
                                columnValue = $(this).data("btn-target");
                            }
                        });

                        if (columnValue === '') columnValue = null;

                        dataList[columnName] = columnValue;
                    })
                    // console.log(dataList);
                    fn(dataList);
                }
            } else {
                formUtil.showMessage("detailBtnClick : please set function call name");
            }
        },
        //수정 버튼 설정
        updateBtnClick: function (fn, btnName) {
            $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                updateBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                            updateBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            function updateBtnClickEventHandler(e) {
                let rowId = $(e.target).data("rowNum");
                let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                let dataList = {};

                dataItems.map((i, item) => {
                    let columnName = $(item).data("field");
                    let columnValue = "";

                    $(item).children().each(function () {
                        if ($(this).is("span")) {
                            formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue") + "" : columnValue = $(this).text();

                        } else if ($(this).is("button")) {
                            columnName = "target";
                            columnValue = $(this).data("btn-target");
                        }
                    });

                    if (columnValue === '') columnValue = null;

                    dataList[columnName] = columnValue;
                })

                // console.log(dataList);
                formUtil.popup("updatePopup_" + btnName, Message.Label.Array["CONFIRM.UPDATE"], fn, dataList);
                // fn(dataList);
            }
        },
        //삭제 버튼 설정
        deleteBtnClick: function (fn, btnName) {
            //최초 한번 이벤트 바인딩
            $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                deleteBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("." + btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                            deleteBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            function deleteBtnClickEventHandler(e) {
                let rowId = $(e.target).data("rowNum");
                let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                let dataList = {};

                dataItems.map((i, item) => {
                    let columnName = $(item).data("field");
                    let columnValue = "";

                    $(item).children().each(function () {
                        if ($(this).is("span")) {
                            formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue") + "" : columnValue = $(this).text();

                        } else if ($(this).is("button")) {
                            columnName = "target";
                            columnValue = $(this).data("btn-target");
                        }
                    });

                    if (columnValue === '') columnValue = null;

                    dataList[columnName] = columnValue;
                })

                // console.log(dataList);
                formUtil.popup("deletePopup_" + btnName, Message.Label.Array["CONFIRM.DELETE"], fn, dataList);
                // fn(dataList);
            }
        },
        //정렬용 컬럼 클릭 이벤트
        sortDataSet: function (fn, notSortList) {
            notSortList = notSortList || [];

            // 중복실행이 너무 많아서 수정 -> 부모 요소에 클릭 이벤트 등록
            $("#" + gridId + ' ul.gi-grid-list-header').off('click').on('click', 'li', function () {
                let column = $(this).data('column');

                // 버튼 컬럼이나 제외 컬럼은 처리하지 않음
                if (column.endsWith('_btn') || notSortList.includes(column)) {
                    return;
                }

                // 정렬 상태 변경
                if (gridSortManager.sortColumn === column && gridSortManager.sortOrder === 'asc') {
                    gridSortManager.setSort(column, 'desc');
                } else if (gridSortManager.sortColumn === column && gridSortManager.sortOrder === 'desc') {
                    gridSortManager.setSort(null, null); // 정렬 해제
                } else {
                    gridSortManager.setSort(column, 'asc');
                }

                // 현재 설정된 옵션
                let pagingOption = $('#' + giGridRowSelectorId + ' option:selected').val();
                let currentPage = $('.active').data('field');

                // 정렬용 콜백 함수 실행
                fn(currentPage, pagingOption, gridSortManager.sortColumn, gridSortManager.sortOrder);
            });
        },
        rowClick: function (fn) {
            // 최초 로딩 시 이벤트를 설정
            setRowClickEvent(fn);
            // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
            const observer = new MutationObserver((mutations) => {
                const hasAddedNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
                if (hasAddedNodes) {
                    let $giGridList = $(".gi-grid-list");
                    if ($giGridList.length > 0) {
                        observer.disconnect(); // 필요시 사용
                    }
                    setRowClickEvent(fn);
                }
            });

            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });

            // rowClick 이벤트를 설정하는 함수
            function setRowClickEvent(fn) {
                let gridSelector = "#" + gridId;
                $(gridSelector).find(".gi-grid-list").addClass("gi-cursor-pointer");
                $(gridSelector).find(".gi-grid-list, .unused-menu")
                    .mouseenter(function () {
                        $(this).addClass("gi-grid-list-hover");
                    })
                    .mouseleave(function () {
                        $(this).removeClass("gi-grid-list-hover");
                    })
                    .click(function () {
                        if ($(this).hasClass("gi-grid-list-select")) {
                            $(this).removeClass("gi-grid-list-select");
                        } else {
                            $(".gi-grid-list").removeClass("gi-grid-list-select");
                            $(this).addClass("gi-grid-list-select");
                        }
                    })
                    ;

                // 클릭 시 이벤트 설정
                $("ul[data-row-num]").off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                    if (!$(e.target).is("button")) {
                        rowClickEventHandler(e, fn);
                    }
                });
            }

            // rowClick 이벤트 핸들러
            function rowClickEventHandler(e, fn) {
                let columnArray = $(e.currentTarget).children("li");
                let resultList = [];

                columnArray.map((i, item) => {
                    const columnName = $(item).data("field");
                    const columnValue = $(item).children("span").text();
                    const hasDataGridValue = $(item).children("span").data("gridValue");

                    if (formUtil.checkEmptyValue(hasDataGridValue)) {
                        resultList[columnName + "_value"] = hasDataGridValue;
                    }

                    resultList[columnName] = columnValue;
                    resultList["EVENT"] = e;
                });

                fn(resultList, e);
            }
        },
        rowMultiSelectClick: function (fn) {
            setMultiRowClickEvent(fn);
            // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                        }
                        setMultiRowClickEvent(fn)// 이벤트 처리
                    }
                });
            });

            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            function setMultiRowClickEvent(fn) {
                $(".gi-grid-list").addClass("gi-cursor-pointer");
                $(".gi-grid-list").mouseenter(function () {
                    $(this).addClass("gi-grid-list-hover");
                }).mouseleave(function () {
                    $(this).removeClass("gi-grid-list-hover");
                });

                // 클릭 시 이벤트 설정
                $("ul[data-row-num]").off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                    if (!$(e.target).is("button")) {
                        rowMultiClickEventHandler(e, fn);
                    }
                });
                function rowMultiClickEventHandler(e, fn) {
                    let target = e.currentTarget;
                    let isSelected = target.classList.contains("gi-grid-list-multi_select");
                    let resultList = [];

                    if (isSelected) {
                        $(target).removeClass("gi-grid-list-multi_select");
                    } else {
                        $(target).addClass("gi-grid-list-multi_select");
                    }

                    let isSelectedVolume = $("#" + gridId + " .gi-grid-list-multi_select");
                    isSelectedVolume.each((i, item) => {
                        let columnArray = $(item).children("li");
                        let tempList = [];
                        columnArray.map((i, item) => {
                            const columnName = $(item).data("field");
                            const columnValue = $(item).children("span").text();
                            tempList[columnName] = columnValue;
                        });
                        resultList.push(tempList);
                    })
                    fn(resultList);
                }
            }
        },
        sideOpenBtnClick: function (tagId, btnName) {
            let $tagId = $("#" + tagId);
            let $btnName = $("." + btnName);
            let sideGridOpenCloseBtn = '<div class="side_grid_close-btn"><span>X</span></div>'
            let $sideGridCloseBtn = $(".side_grid_close-btn");

            if ($btnName.length === 0) {
                // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                            }
                            let $btnName = $("." + btnName);
                            // 이벤트 처리
                            $btnName.off("click.sideOpenBtnClickEventHandler").on("click.sideOpenBtnClickEventHandler", function (e) {
                                sideOpenBtnClickEventHandler(e);
                            });
                        }
                    });
                });

                observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            } else {
                $btnName.off("click.sideOpenBtnClickEventHandler").on("click.sideOpenBtnClickEventHandler", function (e) {
                    sideOpenBtnClickEventHandler(e);
                });
            }


            function sideOpenBtnClickEventHandler(e) {
                $("[data-side-grid-open]").map((i, item) => {
                    $(item).attr("data-side-grid-open", "false");
                })

                $($tagId).attr("data-side-grid-open", "true");
                $tagId.html(sideGridOpenCloseBtn);
                sideGridCloseBtnEvent();

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                            }
                            if ($tagId.find(".side_grid_close-btn").length === 0) {
                                $tagId.html(sideGridOpenCloseBtn);
                                sideGridCloseBtnEvent();
                            }
                        }
                    });
                });

                observer.observe($("#" + tagId)[0], { childList: true, subtree: true });

                function sideGridCloseBtnEvent() {
                    $(".side_grid_close-btn").off("click.sideGridCloseBtnClickEventHandler").on("click.sideGridCloseBtnClickEventHandler", function (e) {
                        sideGridCloseBtnClickEventHandler();
                    });

                    function sideGridCloseBtnClickEventHandler() {
                        $("[data-side-grid-open]").map((i, item) => {
                            if (formUtil.checkEmptyValue($(item).data("sideGridOpenInit"))) {
                                let flag = $(item).data("sideGridOpenInit");
                                flag = flag.toString();
                                $(item).attr("data-side-grid-open", flag);
                            }
                        });

                        $($tagId).attr("data-side-grid-open", "false");
                        $("#" + tagId).empty();
                    }
                }
            }
        },
        Hierarchy2DepthMultiSelectClick: function (fn) {
            //cursor & hover
            $(".gi-grid-list").addClass("gi-cursor-pointer");

            // clickEvent
            $("ul[data-row-num]").off("click.hierarchy2DepthMultiSelectClickEventHandler").on("click.hierarchy2DepthMultiSelectClickEventHandler", function (e) {
                let $ul = $(e.currentTarget);
                let firstLi = $ul.children("li").not('.hidden').first(); //depth 클래스가 있는 위치
                let resultList = [];

                // 'gi-grid-hierarchy-depth0'(상위)인지 확인
                if (firstLi.hasClass("gi-grid-hierarchy-depth0")) {
                    let isSelected = $ul.hasClass("gi-grid-list-root-select");

                    $ul.toggleClass("gi-grid-list-root-select");

                    // 다음 상위 요소가 나오기 전까지 모든 하위 요소 처리
                    $ul.nextAll("ul[data-row-num]").each(function () {
                        let $nextUl = $(this);
                        let $firstLi = $nextUl.children("li").first();

                        if ($firstLi.hasClass("gi-grid-hierarchy-depth0")) {
                            return false;
                        }
                        $nextUl.toggleClass("gi-grid-list-multi_select", !isSelected);
                    });
                } else { // 하위요소라면 본인만 처리
                    $ul.toggleClass("gi-grid-list-multi_select");
                }

                // 선택된 모든 요소의 데이터를 가져와서 배열로 변환
                let isSelectedVolume = $(".gi-grid-list-multi_select");
                isSelectedVolume.each((i, item) => {
                    let columnArray = $(item).children("li");
                    let tempList = {};
                    columnArray.each((i, li) => {
                        const columnName = $(li).data("field");
                        const columnValue = $(li).children("span").text();
                        tempList[columnName] = columnValue;
                    });
                    resultList.push(tempList);
                });

                fn(resultList);
            });
        },
        gridColumResize: function (gridId) {
            formUtil.gridResize(gridId);
        }
    }
}
FormUtility.prototype.gridResize = function (gridId) {
    $(".gridColumResizer").css("cursor", "ew-resize");
    $("#" + gridId + " .gridColumResizer").on("mousedown", function (e) {
        const $resizer = $(this);
        const $headerLi = $resizer.closest("li");
        const columnKey = $headerLi.data("column");
        const startX = e.clientX;

        // 헤더: data-column
        const $headerCols = $("#" + gridId + " li[data-column='" + columnKey + "']");
        // 바디: data-field
        const $bodyCols = $("#" + gridId + " li[data-field='" + columnKey + "']");

        const $allCols = $headerCols.add($bodyCols);

        // 각각의 시작 너비 저장
        const startWidths = $allCols.map(function () {
            return $(this).outerWidth();
        }).get();

        // 마우스 이동 이벤트
        $(window).on("mousemove.resize", function (e) {
            const delta = e.clientX - startX;

            $allCols.each(function (i) {
                const newWidth = startWidths[i] + delta;
                if (newWidth > 30) {
                    $(this).width(newWidth);
                }
            });
        });

        // 마우스 해제 시 이벤트 제거
        $(window).on("mouseup.resize", function () {
            $(window).off(".resize");
        });

        e.preventDefault(); // 드래그 시 텍스트 선택 방지
    });
}
