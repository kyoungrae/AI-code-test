let giCalendarSeletedDateList = [];
let addScheduleFlag = false;
let addClickDateFlag = false;
let addClickDateSettingFunction = "";
let addScheduleParameter = "";
let addScheduleFunction;
let setAfterEventFlag = false;
let setAfterEventFunction;

/**
 * @title : 캘린더 날짜 조회
 * @text : 캘린더 선택된 날짜 리스트 조회
 * @return : YYYY-MM-DD List
 * @writer : 이경태
 * */
FormUtility.prototype.giCalendarSeletedDate = function () {
    return giCalendarSeletedDateList;
}

/**
 * @title : 캘린더 생성
 * @date : new Date() 객체 파라미터 [new Date()]
 * @text : < div id='gi-calendar-main'> < /div> " 생성 후 사용(필수)
 * @writer : 이경태
 * */
FormUtility.prototype.giCalendar = function (e, direction) {
    let date = "";
    let nowMonth = 0;
    let nowYear = 0;

    // 이전 값 가져오기
    let oldYear = parseInt($("#gi-calendar-main").find(".gi-calendar-YEAR").text());
    let oldMonth = parseInt($("#gi-calendar-main").find(".gi-calendar-MONTH").text());

    if (formUtil.checkEmptyValue(e)) { //prev , next Month 클릭시
        date = e;
        nowYear = date.getFullYear();
        nowMonth = date.getMonth() + 1;
    } else { // 기본 현재 달력 정보(year , month)
        date = new Date();
        nowYear = date.getFullYear()
        nowMonth = date.getMonth() + 1;
    }

    let text_nowMonth = nowMonth; //달력에 월 표시

    let preMonthEndData = new Date(nowYear, nowMonth - 1, 0); // 전달 마지막날 데이터
    let nowMonthEndData = new Date(nowYear, nowMonth, 0); // 현재달 마지막 날 데이터
    let nowMonthStrData = new Date(nowYear, nowMonth - 1); // 현재달 첫째날 데이터
    let giCalendarNextMonthStrData = new Date(nowYear, nowMonth, 1); // 다음달 첫날 데이터


    let preEndDay = preMonthEndData.getDate(); // 전달 마지막 날짜
    let endDay = nowMonthEndData.getDate(); // 현재 마지막 날짜
    let endDate = nowMonthEndData.getDay(); //현재 마지막 날 요일
    let strDate = nowMonthStrData.getDay(); //현재 처음 날 요일
    let nextStrDate = giCalendarNextMonthStrData.getDate(); // 다음달 첫 날짜

    let weekly_date_html = "";

    let preDate_no = 0;
    let nextDate_no = 0;
    if (1 !== strDate) {
        if (0 === strDate) {
            preDate_no = 6;
        } else {
            preDate_no = strDate - 1;
        }
    }
    if (0 !== endDate) {
        nextDate_no = 7 - endDate;
    }

    // 애니메이션 클래스 결정
    let yearAnim = (direction && !isNaN(oldYear)) ? (oldYear !== nowYear ? (direction === 'up' ? 'gi-calendar-slot-up' : 'gi-calendar-slot-down') : '') : 'tilt-in-top-1';
    let monthAnim = (direction && !isNaN(oldMonth)) ? (oldMonth !== nowMonth ? (direction === 'up' ? 'gi-calendar-slot-up' : 'gi-calendar-slot-down') : '') : 'tilt-in-top-1';

    // 달력 헤더설정 (onclick 핸들러 수정: formUtil.giCalendarPrevMonth)
    let CalendarBox = '<div class="gi-col-100 gi-row-100 ">'
        + '<div class="gi-calendar-top gi-flex gi-flex-justify-content-center">'
        + '<div class="gi-calendar-pre gi-col-20px gi-flex gi-cursor-pointer" onclick="formUtil.giCalendarPrevMonth()"><i class="fa-solid fa-angle-left"></i></div>'
        + '<div class="gi-calendar-top-date gi-col-40 gi-row-100 gi-flex gi-flex-align-items-center gi-flex-justify-content-center gi-cursor-pointer" onclick="formUtil.openYearMonthPicker(null, \'all\')">'
        + '<span class="gi-calendar-YEAR ' + yearAnim + '">' + nowYear + '</span>년'
        + '<span class="gi-calendar-MONTH ' + monthAnim + '">' + text_nowMonth + '</span>월'
        + '<i class="fa-solid fa-chevron-down"></i>'
        + '</div>'
        + '<div class="gi-calendar-next gi-col-20px gi-flex gi-cursor-pointer" onclick="formUtil.giCalendarNextMonth()"><i class="fa-solid fa-angle-right"></i></div>'
        + '</div>'
        + '<div class="gi-calendar-body-container">'
        + '<div class="gi-calendar-week gi-flex gi-flex-justify-content-center">'
        + '<div class="gi-calendar-week-content">월</div>'
        + '<div class="gi-calendar-week-content">화</div>'
        + '<div class="gi-calendar-week-content">수</div>'
        + '<div class="gi-calendar-week-content">목</div>'
        + '<div class="gi-calendar-week-content">금</div>'
        + '<div class="gi-calendar-week-content">토</div>'
        + '<div class="gi-calendar-week-content">일</div>'
        + '</div>'
        + '<div id ="gi-calendar-weekly-box" class="gi-calendar-weekly gi-flex gi-col-100">'
        + '</div>'
        + '</div>'

    $("#gi-calendar-main").html(CalendarBox);

    //  현재 달력의 남은 부분 전 달 날짜로 채워 넣기
    for (let j = preDate_no; j--;) {
        weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
            + '<div class="gi-calendar-weekly-date gi-calendar-weekly-pre-date">' + (preEndDay - j) + '</div>'
            + '</div>';
    }
    // 현재 달력 출력
    for (let i = 1; i < endDay + 1; i++) {
        let date = new Date(nowYear, nowMonth - 1, i);
        let day = date.getDay();
        let weekend = (0 === day || day === 6) ? "Y" : "N";

        weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
            + '<div class="gi-calendar-weekly-date" data-weekend="' + weekend + '" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="' + i + '">'
            // +'<div class="gi-day gi-row-100 gi-overflow-scroll gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
            + '<div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
            + '<div class="gi-holiday"></div>' + i
            + '</div>'
            + '<div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>'
            + '</div>'
            + '</div>'
    }

    //  현재 달력의 끝부분 남는 부분 다음 달 날짜로 채워 넣기
    for (let k = 0; k < nextDate_no; k++) {
        weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
            + '<div class="gi-calendar-weekly-date gi-calendar-weekly-next-date">' + (nextStrDate + k) + '</div>'
            + '</div>'
    }

    $("#gi-calendar-main").find("#gi-calendar-weekly-box").html(weekly_date_html);

    formUtil.giCalendarToDayCheck(); //오늘 날짜 표시
    formUtil.searchHoliday(nowYear, text_nowMonth); //공휴일 표시

    /**
     * 날짜선택 이벤트
     **/
    $(".gi-calendar-weekly-date").on("click", function (e) {
        let selectStatus = $(this).data("day-select"); //선택여부
        let detailStatus = $(this).data("detail-status"); //상세창 오픈 여부
        let date = $(this).data("nowdate");

        if (detailStatus) { //상세가 열려있는데 클릭 할 시
            let $giCalendarWeeklyDateDataNowDate = $(".gi-calendar-weekly-date[data-nowdate='" + date + "']");
            $giCalendarWeeklyDateDataNowDate.parent().children(".gi-schedule-detail").remove();
            $giCalendarWeeklyDateDataNowDate.data("detail-status", false);
            return false;
        }

        //이전달 날자 선택 불가
        if (!$(this).hasClass("gi-calendar-weekly-next-date") && !$(this).hasClass("gi-calendar-weekly-pre-date")) {
            if (selectStatus) { // 이미 선택되어 있을시 선택 해제
                $(this).data("day-select", false);
                $(this).css({
                    "border": "none"
                });
                for (let i = 0; i < giCalendarSeletedDateList.length; i++) { // 배열에 값 제거
                    if (giCalendarSeletedDateList[i] === date) {
                        giCalendarSeletedDateList.splice(i, 1);
                        i--;
                    }
                }
            } else { // 선택 되어 있지 않을시 선택
                $(this).data("day-select", true);
                if (formUtil.checkEmptyValue(addScheduleFunction)) {
                    openScheduleDetailBox(e, date, detailStatus, addScheduleFunction); // 일정 상세 박스 open
                }

                giCalendarSeletedDateList.push(date); // 배열에 값 추가
            }
        }
    });

    return {
        setEventChoiceDate: function () {
            $(".gi-calendar-weekly-date").off("click"); //기존 이벤트 제거

            $(".gi-calendar-weekly-date").on("click", function () {
                let selectStatus = $(this).data("day-select"); //선택여부
                let date = $(this).data("nowdate");

                if (!$(this).hasClass("gi-calendar-weekly-next-date") && !$(this).hasClass("gi-calendar-weekly-pre-date")) {
                    // 단일 선택만 가능 하도록
                    $(".gi-calendar-weekly-date").data("day-select", false);
                    $(".gi-calendar-weekly-date").css({
                        "border": "none"
                    });
                    giCalendarSeletedDateList = [];

                    if (selectStatus) { // 이미 선택되어 있을시 선택 해제
                        $(this).data("day-select", false);
                        $(this).css({
                            "border": "none"
                        });
                        for (let i = 0; i < giCalendarSeletedDateList.length; i++) { // 배열에 값 제거
                            if (giCalendarSeletedDateList[i] === date) {
                                giCalendarSeletedDateList.splice(i, 1);
                                i--;
                            }
                        }
                    } else { // 선택 되어 있지 않을시 선택
                        $(this).data("day-select", true);
                        $(this).css({
                            "border": "1px solid blue"
                        });

                        giCalendarSeletedDateList.push(date); // 배열에 값 추가
                    }
                }
            });
        },
        addClickDateEvent: async function (fn) {
            addClickDateFlag = true;
            addClickDateSettingFunction = fn;
            fn();
        },
        addSchedule: function (cont, fn) {
            addScheduleFunction = fn;
            addScheduleParameter = cont;
            addScheduleFlag = true
            let scheduleData = "";
            let schedule_date = "";
            if (formUtil.checkEmptyValue(cont)) {
                scheduleData = cont;
                for (let i = 0; i < scheduleData.length; i++) {
                    schedule_date = parseInt(scheduleData[i].SCHEDULE_DATE.substring(6, 8)); // 날짜
                    let schedule_title = scheduleData[i].SCHEDULE_TITLE; // 제목
                    let schedule_color = scheduleData[i].SCHEDULE_COLOR; // 색상
                    let gi_schedule_data = '<div class="gi-schedule-content" style="background-color:' + schedule_color + '">' + schedule_title + '</div>';

                    //달력의 년, 월이 데이터의 년,월과 같을 경우만 출력
                    let cal_year = $(".gi-calendar-YEAR").text();
                    let cal_month = $(".gi-calendar-MONTH").text().padStart(2, '0');
                    if (cal_year === scheduleData[i].SCHEDULE_DATE.substring(0, 4) && cal_month === scheduleData[i].SCHEDULE_DATE.substring(4, 6)) {
                        $(".gi-calendar-weekly-date[data-nowdate=" + schedule_date + "] > .gi-day-schedule").append(gi_schedule_data);
                    }
                }
            }
        },
        addClickDateEventSetAfterEvent: function (event) {
            setAfterEventFlag = true;
            setAfterEventFunction = event;
            event();
        }
    }

    async function openScheduleDetailBox(e, date, detailStatus, fn) {
        let scheduleDetailHtml = "";
        let $giCalendarWeeklyDate = $(e.currentTarget);
        let week = ["일", "월", "화", "수", "목", "금", "토"];
        let dayOfWeek = week[new Date(nowYear + "-" + text_nowMonth + "-" + date).getDay()];
        let StringNowMonth = String(nowMonth).padStart(2, "0");
        let StringNowDay = String(date).padStart(2, '0');
        let $giCalendarWeeklyDateDataNowDate = $(".gi-calendar-weekly-date[data-nowdate='" + date + "']");

        let index = $giCalendarWeeklyDate.parent().index(); //현재 클릭한 날짜가 몇번째 인덱스인지
        let detail_cnt = $(".gi-schedule-detail").length;
        let detail_isEmpty = formUtil.checkEmptyValue(detail_cnt); // 현재 열려있는 상세창이 있는지 없는지

        let sundayFlag = false;

        if ((index + 1) % 7 === 0) { //일요일(마지막번째 칸) 클릭시
            /*
            * 일요일 클릭시 해당 Row 맨앞(월요일쪽)에 상세창 div를 append 시켜주어야 Grid가 깨지지 않음
            * 그래서 일요일 클릭시 index를 0(월요일)로 잡아서 해당 Row 맨앞으로 붙여주는 작업
            * */
            index = 0;
            sundayFlag = true;
        }

        let returnData = {
            YEAR: nowYear,
            MONTH: StringNowMonth,
            DAY: StringNowDay,
            EVENT: e,
            DATA: addScheduleParameter
        };

        if (detail_isEmpty) return false;

        if (1 <= detail_cnt) {
            if (detailStatus) {
                $giCalendarWeeklyDateDataNowDate.parent().children(".gi-schedule-detail").remove();
                $giCalendarWeeklyDateDataNowDate.data("detail-status", false);
            } else {
                if (sundayFlag) {
                    if (formUtil.checkEmptyValue(fn)) scheduleDetailHtml = await fn(returnData);

                    $giCalendarWeeklyDate.parent().children(".gi-schedule-detail").remove();
                    $giCalendarWeeklyDate.data("detail-status", false);

                    let detailHtml = '<div class="gi-schedule-detail">'
                        + '<div class="gi-schedule-detail-cancel-button"><i class="fa-solid fa-xmark"></i></div>'
                        + '<div class="gi-schedule-detail-title-box gi-flex ">'
                        + scheduleDetailHtml
                        + '</div>';

                    $giCalendarWeeklyDateDataNowDate.parent().append(detailHtml);
                    $giCalendarWeeklyDateDataNowDate.data("detail-status", true);

                    let children = $(".gi-schedule-detail-title-box").children()[0];

                    if (formUtil.checkEmptyValue(children)) {
                        $(".gi-schedule-detail").css("width", children.offsetWidth + "px");
                        $(".gi-schedule-detail").css("height", children.offsetHeight + "px");
                    }
                } else {
                    return false;
                }
            }
        } else {
            if (detailStatus) {
                $giCalendarWeeklyDateDataNowDate.parent().children(".gi-schedule-detail").remove();
                $giCalendarWeeklyDateDataNowDate.data("detail-status", false);
            } else {
                if (sundayFlag) {
                    if (formUtil.checkEmptyValue(fn)) scheduleDetailHtml = await fn(returnData);

                    let detailHtml = '<div class="gi-schedule-detail">'
                        + '<div class="gi-schedule-detail-cancel-button"><i class="fa-solid fa-xmark"></i></div>'
                        + '<div class="gi-schedule-detail-title-box gi-flex ">'
                        + scheduleDetailHtml
                        + '</div>';

                    $giCalendarWeeklyDateDataNowDate.parent().append(detailHtml);
                    $giCalendarWeeklyDateDataNowDate.data("detail-status", true);

                    let children = $(".gi-schedule-detail-title-box").children()[0];

                    if (formUtil.checkEmptyValue(children)) {
                        $(".gi-schedule-detail").css("width", children.offsetWidth + "px");

                        if (children.offsetHeight === 0) {
                            $(".gi-schedule-detail").css("height", "auto");
                        } else {
                            $(".gi-schedule-detail").css("height", children.offsetHeight + "px");
                        }
                    }
                } else {
                    return false;
                }
            }
        }

        if (setAfterEventFlag) {
            setAfterEventFunction(e);
        }

        $(".gi-schedule-detail-cancel-button").on("click", function () {
            $giCalendarWeeklyDateDataNowDate.parent().children(".gi-schedule-detail").remove();
            $giCalendarWeeklyDateDataNowDate.data("detail-status", false);
        })
    }
}
/**
 * @title : 공휴일 조회 API
 * @text : 공공포탈 API 공휴일 정보 받아오는 함수
 * @writer : 이경태
 * */
FormUtility.prototype.searchHoliday = function (nowYear, nowMonth) {
    let url = "/api/open/holiday/search";
    let param = {
        year: nowYear
    }

    axios.post(url, param).then(response => {
        let data = response.data[0].response.body.items.item;
        if (!formUtil.checkEmptyValue(sessionStorage.getItem("holiday" + nowYear))) {
            sessionStorage.setItem("holiday" + nowYear, JSON.stringify(data));
            formUtil.giCalendarAddHoliday(nowYear, nowMonth);
        }
    }).catch(error => {
        console.log("공휴일 API가 존재하지 않습니다. 관리자에게 문의해주세요");
    })
}
/**
 * @title : 색상 선택기
 * @text : 일정 등록 시 색상 선택 옵션 추가
 * @writer : 이경태
 * */
FormUtility.prototype.giCalendarColorSelector = function (e) {
    let colorOptions = [{ value: "#FF0000", text: "Red" },
    { value: "#0000FF", text: "Blue" },
    { value: "#00FF00", text: "Green" },
    { value: "#FFFF00", text: "Yellow" },
    { value: "#FFA500", text: "Orange" }];

    let options = '';
    for (let i = 0; i < colorOptions.length; i++) {
        i
        options += '<option value="' + colorOptions[i].value + '">' + colorOptions[i].text + '</option>';
    }
    $("." + e).append(options);
}

/**
 * @title : 시간 초기화
 * @text : 일정 detail 박스에 초기 시간 셋팅
 * @writer : 이경태
 * */
FormUtility.prototype.resetTime = function (startTime, endTime) {
    $("." + startTime).val("12:00");
    $("." + endTime).val("13:00");
}
/**
 * @title : 오늘 날짜 확인
 * @text : 달력에 오늘 날짜 표시 해주는 함수
 * @writer : 이경태
 * */
FormUtility.prototype.giCalendarToDayCheck = function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let today = date.getDate();

    let checkYear = parseInt($(".gi-calendar-YEAR").text());
    let checkMonth = parseInt($(".gi-calendar-MONTH").text());

    //현재 년,월이 달력의 checkYear ,checkMonth 가 각가 같으면 today(오늘)을 표시 해준다.
    if (checkYear === year && checkMonth === month) {
        $(".gi-calendar-weekly-date[data-nowdate='" + today + "'] > .gi-day").parent().css(
            {
                "border": "1px solid #d1d1d1"
                , "box-shadow": "0px 0px 8px #0000003b"
            }
        )
    }
}
/**
 * @title : 공휴일 추가
 * @text : 캘린더에 공휴일 정보 렌더링
 * @writer : 이경태
 * */
FormUtility.prototype.giCalendarAddHoliday = function (year, month) {
    if (formUtil.checkEmptyValue(sessionStorage.getItem("holiday" + year))) {
        if (formUtil.checkEmptyValue(JSON.parse(sessionStorage.getItem("holiday" + year)))) {
            let holidayData = JSON.parse(sessionStorage.getItem("holiday" + year));
            let tableData = [];

            holidayData.map(e => {
                let target_yyyy = parseInt(e.locdate.toString().substring(0, 4));
                let target_mm = parseInt(e.locdate.toString().substring(4, 6));
                let target_dt = parseInt(e.locdate.toString().substring(6, 8)).toString();
                let memo = e.dateName;
                let isholiday = e.isHoliday;
                tableData.push({
                    "target_yyyy": target_yyyy,
                    "target_mm": target_mm,
                    "target_dt": target_dt,
                    "memo": memo,
                    "isholiday": isholiday
                })
            })

            if (tableData.length !== 0) {
                for (let i = 0; i < tableData.length; i++) {
                    if (year === tableData[i].target_yyyy && month === tableData[i].target_mm) {
                        let schedule_date = tableData[i].target_dt
                        let gi_schedule_data = '<div class="gi-flex gi-flex-align-items-center">' + tableData[i].memo + '</div>';

                        $(".gi-calendar-weekly-date[data-nowdate=" + schedule_date + "] > .gi-day > .gi-holiday").append(gi_schedule_data);
                        if ("Y" === tableData[i].isholiday) {
                            $(".gi-calendar-weekly-date[data-nowdate=" + schedule_date + "]").attr("data-holiday", "Y");
                        }
                    }
                }
            }
        }
    } else {

    }
}
/**
 * @title : 이전달 조회
 * @text : 캘린더 이전달 보기
 * @writer : 이경태
 * */
FormUtility.prototype.giCalendarPrevMonth = function (flag1 = addScheduleFlag, flag2 = addScheduleParameter, flag3 = addClickDateFlag) {
    let year = parseInt($(".gi-calendar-YEAR").text());
    let month = parseInt($(".gi-calendar-MONTH").text());
    let date = new Date(year, month - 2);
    let giCalendarGrid = formUtil.giCalendar(date, 'down');

    if (flag3) {
        giCalendarGrid.addClickDateEvent(addClickDateSettingFunction);
    }
    if (flag1) {
        giCalendarGrid.addSchedule(flag2);
    }
    if (setAfterEventFlag) {
        giCalendarGrid.addClickDateEventSetAfterEvent(setAfterEventFunction);
    }
}
/**
 * @title : 다음달 조회
 * @text : 캘린더 다음달 보기
 * @writer : 이경태
 * */
FormUtility.prototype.giCalendarNextMonth = function (flag1 = addScheduleFlag, flag2 = addScheduleParameter, flag3 = addClickDateFlag) {
    let year = parseInt($(".gi-calendar-YEAR").text());
    let month = parseInt($(".gi-calendar-MONTH").text());

    let date = new Date(year, month);
    let giCalendarGrid = formUtil.giCalendar(date, 'up');

    if (flag3) {
        giCalendarGrid.addClickDateEvent(addClickDateSettingFunction);
    }
    if (flag1) {
        giCalendarGrid.addSchedule(flag2);
    }
    if (setAfterEventFlag) {
        giCalendarGrid.addClickDateEventSetAfterEvent(setAfterEventFunction);
    }
}

/**
 * @title : 데이트 피커 생성
 * @e : {form_date ID, to_date ID}
 * @text : input 태그에 커스텀 태그로 사용 input[data-datepicker]
 * @writer : 이경태
 * */
FormUtility.prototype.giDatePicker = function (input, e, direction) {
    let date = new Date();
    let nowMonth = 0;
    let nowYear = 0;
    let datepickerId = "gi-datepicker_calendar-main";

    // 이전 값 가져오기
    let $datepicker = $("#" + datepickerId);
    let oldYear = parseInt($datepicker.find(".gi-calendar-YEAR").text());
    let oldMonth = parseInt($datepicker.find(".gi-calendar-MONTH").text());

    if (formUtil.checkEmptyValue(e)) { //prev , next Month 클릭시
        date = e;
        nowYear = date.getFullYear();
        nowMonth = date.getMonth() + 1;
    } else { // 기본 현재 달력 정보(year , month)
        nowYear = date.getFullYear()
        nowMonth = date.getMonth() + 1;
    }

    let text_nowMonth = nowMonth; //달력에 월 표시

    let preMonthEndData = new Date(nowYear, nowMonth - 1, 0); // 전달 마지막날 데이터
    let nowMonthEndData = new Date(nowYear, nowMonth, 0); // 현재달 마지막 날 데이터
    let nowMonthStrData = new Date(nowYear, nowMonth - 1); // 현재달 첫째날 데이터
    let giCalendarNextMonthStrData = new Date(nowYear, nowMonth, 1); // 다음달 첫날 데이터


    let preEndDay = preMonthEndData.getDate(); // 전달 마지막 날짜
    let endDay = nowMonthEndData.getDate(); // 현재 마지막 날짜
    let endDate = nowMonthEndData.getDay(); //현재 마지막 날
    let strDate = nowMonthStrData.getDay(); //현재 처음 날
    let nextStrDate = giCalendarNextMonthStrData.getDate(); // 다음달 첫 날짜

    let weekly_date_html = "";

    let preDate_no = 0;
    let nextDate_no = 0;
    if (1 !== strDate) {
        if (0 === strDate) {
            preDate_no = 6;
        } else {
            preDate_no = strDate - 1;
        }
    }
    if (0 !== endDate) {
        nextDate_no = 7 - endDate;
    }
    // 애니메이션 클래스 결정
    let yearAnim = (direction && !isNaN(oldYear)) ? (oldYear !== nowYear ? (direction === 'up' ? 'gi-calendar-slot-up' : 'gi-calendar-slot-down') : '') : 'tilt-in-top-1';
    let monthAnim = (direction && !isNaN(oldMonth)) ? (oldMonth !== nowMonth ? (direction === 'up' ? 'gi-calendar-slot-up' : 'gi-calendar-slot-down') : '') : 'tilt-in-top-1';

    // 달력 헤더설정 (onclick 수정 formUtil.giDatePickerPrevMonth)
    let CalendarBox = '<div id="' + datepickerId + '" class="gi-col-100 gi-row-100 ">'
        + '<div class="gi-calendar-top gi-flex gi-flex-justify-content-center">'
        + '<div class="gi-calendar-pre gi-col-20px gi-flex gi-cursor-pointer" onclick="formUtil.giDatePickerPrevMonth(\'' + input + '\')"><i class="fa-solid fa-angle-left"></i></div>'
        + '<div class="gi-calendar-top-date gi-col-40 gi-row-100 gi-flex gi-flex-align-items-center gi-flex-justify-content-center gi-cursor-pointer" onclick="formUtil.openYearMonthPicker(\'' + input + '\', \'all\')">'
        + '<span class="gi-calendar-YEAR ' + yearAnim + '">' + nowYear + '</span>년'
        + '<span class="gi-calendar-MONTH ' + monthAnim + '">' + text_nowMonth + '</span>월'
        + '<i class="fa-solid fa-chevron-down"></i>'
        + '</div>'
        + '<div class="gi-calendar-next gi-col-20px gi-flex gi-cursor-pointer" onclick="formUtil.giDatePickerNextMonth(\'' + input + '\')"><i class="fa-solid fa-angle-right"></i></div>'
        + '</div>'
        + '<div class="gi-calendar-body-container">'
        + '<div class="gi-calendar-week gi-flex gi-flex-justify-content-center">'
        + '<div class="gi-calendar-week-content">월</div>'
        + '<div class="gi-calendar-week-content">화</div>'
        + '<div class="gi-calendar-week-content">수</div>'
        + '<div class="gi-calendar-week-content">목</div>'
        + '<div class="gi-calendar-week-content">금</div>'
        + '<div class="gi-calendar-week-content">토</div>'
        + '<div class="gi-calendar-week-content">일</div>'
        + '</div>'
        + '<div id ="gi-calendar-weekly-box" class="gi-calendar-weekly gi-flex gi-col-100">'
        + '</div>'
        + '</div>'
        + '</div>'

    $("#giDatePicker").html(CalendarBox);

    //  현재 달력의 남은 부분 전 달 날짜로 채워 넣기
    for (let j = preDate_no; j--;) {
        weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
            + '<div class="gi-calendar-weekly-date gi-calendar-weekly-pre-date">' + (preEndDay - j) + '</div>'
            + '</div>';

    }
    if ($("#" + input).attr("data-datepicker") === "notBeforeDate") {
        // 오늘보다 이전 선택 불가 달력 출력
        notBeforeSelect();
    } else if ($("#" + input).attr("data-datepicker") === "notAfterDate") {
        // 오늘보다 이후 선택 불가 달력 출력
        notAfterSelect();
    } else if ($("#" + input).attr("data-datepicker") === "fromTodayUntilAMonthLater") {
        // 오늘 포함 한달 뒤 까지만 선택 가능
        fromTodayUntilAMonthLaterSelect();
    } else if ($("#" + input).attr("data-datepicker") === "setRange") {
        // gi-date-min , gi-date-max 사이의 날짜만 선택 가능 (min, max는 옵셔널이며 'YYYY-MM-DD')
        selectByRange();
    } else {
        nowMonthSelectAble();
    }


    //  현재 달력의 끝부분 남는 부분 다음 달 날짜로 채워 넣기
    for (let k = 0; k < nextDate_no; k++) {
        weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
            + '<div class="gi-calendar-weekly-date gi-calendar-weekly-next-date">' + (nextStrDate + k) + '</div>'
            + '</div>'
    }

    $("#" + datepickerId).find("#gi-calendar-weekly-box").html(weekly_date_html);

    formUtil.giCalendarToDayCheck(); //오늘 날짜 표시

    /**
     * 날짜선택 이벤트
     **/
    $(".gi-calendar-weekly-date").on("click", function (e) {
        //이전달 날자 선택 불가
        if (!$(this).hasClass("gi-calendar-weekly-next-date") && !$(this).hasClass("gi-calendar-weekly-pre-date")) {
            let date = $(this).data("nowdate").toString().padStart(2, '0');
            let month = $(e.currentTarget).parents().find("#" + datepickerId).find(".gi-calendar-MONTH").text().padStart(2, '0');
            let year = $(e.currentTarget).parents().find("#" + datepickerId).find(".gi-calendar-YEAR").text();
            let selectDate = year + "-" + month + "-" + date;
            $("#" + input).val(selectDate).trigger("change");
            commonTag.inputTagReset($(".gi-input"));
            giDatepickerBodyEmpty();
        }
    });
    $(".gi-day").on("click", function (e) {
        let date = $(this).parent().data("nowdate").toString().padStart(2, '0');
        let month = $(e.currentTarget).parents().find("#" + datepickerId).find(".gi-calendar-MONTH").text().padStart(2, '0');
        let year = $(e.currentTarget).parents().find("#" + datepickerId).find(".gi-calendar-YEAR").text();
        let selectDate = year + "-" + month + "-" + date;
        $("#" + input).val(selectDate).trigger("change");
        commonTag.inputTagReset($(".gi-input"));
        giDatepickerBodyEmpty();
    });
    $(document).off("mousedown.calendarMouseDownEventHandler").on("mousedown.calendarMouseDownEventHandler", function (event) {
        calendarMouseDownEventHandler(event);

    });
    function calendarMouseDownEventHandler(event) {
        // 클릭한 요소를 확인
        const target = $(event.target);
        // `gi-calendar-main` 또는 그 하위 요소를 클릭했는지 확인
        if (!target.closest("#gi-datepicker_calendar-main").length) {
            giDatepickerBodyEmpty();
        }
    }



    function giDatepickerBodyEmpty() {
        $("#giDatepickerBody").empty();
    }
    function nowMonthSelectAble() {
        // 현재 달력 출력
        for (let i = 1; i < endDay + 1; i++) {
            let date = new Date(nowYear, nowMonth - 1, i);
            let day = date.getDay();
            let weekend = (0 === day || day === 6) ? "Y" : "N";

            weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                + '<div class="gi-calendar-weekly-date" data-weekend="' + weekend + '" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="' + i + '">'
                // +'<div class="gi-day gi-row-100 gi-overflow-scroll gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                + '<div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                + '<div class="gi-holiday"></div>' + i
                + '</div>'
                + '<div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>'
                + '</div>'
                + '</div>'
        }
    }
    function notBeforeSelect() {
        for (let i = 1; i < endDay + 1; i++) {
            let date = new Date(nowYear, nowMonth - 1, i);
            let day = date.getDay();
            let weekend = (0 === day || day === 6) ? "Y" : "N";
            let toDate = new Date();
            if (date < toDate) {
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    + '<div class="gi-calendar-weekly-date gi-calendar-weekly-pre-date">' + i + '</div>'
                    + '</div>';

            } else {
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    + '<div class="gi-calendar-weekly-date" data-weekend="' + weekend + '" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="' + i + '">'
                    // +'<div class="gi-day gi-row-100 gi-overflow-scroll gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    + '<div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    + '<div class="gi-holiday"></div>' + i
                    + '</div>'
                    + '<div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>'
                    + '</div>'
                    + '</div>'
            }
        }
    }
    function notAfterSelect() {
        for (let i = 1; i < endDay + 1; i++) {
            let date = new Date(nowYear, nowMonth - 1, i);
            let day = date.getDay();
            let weekend = (0 === day || day === 6) ? "Y" : "N";
            let toDate = new Date();

            if (date > toDate) {
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    + '<div class="gi-calendar-weekly-date gi-calendar-weekly-next-date">' + i + '</div>'
                    + '</div>'

            } else {
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    + '<div class="gi-calendar-weekly-date" data-weekend="' + weekend + '" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="' + i + '">'
                    // +'<div class="gi-day gi-row-100 gi-overflow-scroll gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    + '<div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    + '<div class="gi-holiday"></div>' + i
                    + '</div>'
                    + '<div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>'
                    + '</div>'
                    + '</div>'
            }
        }
    }

    function fromTodayUntilAMonthLaterSelect() {
        for (let i = 1; i < endDay + 1; i++) {
            let date = new Date(nowYear, nowMonth - 1, i);
            let day = date.getDay();
            let weekend = (0 === day || day === 6) ? "Y" : "N";
            let toDate = new Date();

            if (date < toDate.setDate(toDate.getDate() - 1) || date > toDate.setDate(toDate.getDate() + 31)) {
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    + '<div class="gi-calendar-weekly-date gi-calendar-weekly-pre-date">' + i + '</div>'
                    + '</div>';

            } else {
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    + '<div class="gi-calendar-weekly-date" data-weekend="' + weekend + '" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="' + i + '">'
                    // +'<div class="gi-day gi-row-100 gi-overflow-scroll gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    + '<div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    + '<div class="gi-holiday"></div>' + i
                    + '</div>'
                    + '<div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>'
                    + '</div>'
                    + '</div>'
            }
        }
    }

    function selectByRange() {
        let minDateAttr = $("#" + input).attr("gi-date-min");
        let maxDateAttr = $("#" + input).attr("gi-date-max");

        let minDate = minDateAttr ? new Date(minDateAttr).setHours(0, 0, 0, 0) : null;
        let maxDate = maxDateAttr ? new Date(maxDateAttr).setHours(23, 59, 59, 999) : null;

        for (let i = 1; i < endDay + 1; i++) {
            let currentDate = new Date(nowYear, nowMonth - 1, i);
            currentDate.setHours(0, 0, 0, 0);

            let isInRange =
                (minDate ? currentDate >= minDate : true) &&
                (maxDate ? currentDate <= maxDate : true);

            let day = currentDate.getDay();
            let weekend = (day === 0 || day === 6) ? "Y" : "N";

            if (isInRange) {
                weekly_date_html += `
                  <div class="gi-calendar-weekly-date-layer">
                    <div class="gi-calendar-weekly-date" data-weekend="${weekend}" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="${i}">
                      <div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">
                        <div class="gi-holiday"></div>${i}
                      </div>
                      <div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>
                    </div>
                  </div>`;
            } else {
                weekly_date_html += `
                  <div class="gi-calendar-weekly-date-layer">
                    <div class="gi-calendar-weekly-date gi-calendar-weekly-pre-date">${i}</div>
                  </div>`;
            }
        }
    }
}

/**
 * @title : 데이트 피커 이전달
 * @text : 데이트 피커 이전달 조회
 * @writer : 이경태
 * */
FormUtility.prototype.giDatePickerPrevMonth = function (input) {
    let year = parseInt($("#gi-datepicker_calendar-main").find(".gi-calendar-YEAR").text());
    let month = parseInt($("#gi-datepicker_calendar-main").find(".gi-calendar-MONTH").text());
    let date = new Date(year, month - 2);
    formUtil.giDatePicker(input, date, 'down');
}
/**
 * @title : 데이트 피커 다음달
 * @text : 데이터 피커 다음달 조회
 * @writer : 이경태
 * */
FormUtility.prototype.giDatePickerNextMonth = function (input) {
    let year = parseInt($("#gi-datepicker_calendar-main").find(".gi-calendar-YEAR").text());
    let month = parseInt($("#gi-datepicker_calendar-main").find(".gi-calendar-MONTH").text());
    let date = new Date(year, month);

    formUtil.giDatePicker(input, date, 'up');
}

/**
 * @title : 년/월 선택 피커 오픈
 * @text : 슬롯머신 스타일의 년/월 선택창 오픈
 */
FormUtility.prototype.openYearMonthPicker = function (input, type) {
    let year = parseInt($(".gi-calendar-YEAR").text());
    let month = parseInt($(".gi-calendar-MONTH").text());

    let isDatePicker = input !== null;
    let datepickerId = isDatePicker ? "gi-datepicker_calendar-main" : "gi-calendar-main";
    let $calendar = isDatePicker ? $("#" + datepickerId) : $("#gi-calendar-main");
    let $header = $calendar.find(".gi-calendar-top-date");

    // 이미 열려있으면 닫기 (토글 기능)
    if ($calendar.find(".gi-picker-overlay").length > 0) {
        $calendar.find(".gi-picker-overlay").remove();
        $header.removeClass("active");
        return;
    }

    $header.addClass("active");

    let years = [];
    for (let i = year - 10; i <= year + 10; i++) years.push(i);

    let months = [];
    for (let i = 1; i <= 12; i++) months.push(i);

    let pickerHtml = `
        <div class="gi-picker-overlay">
            <div class="gi-picker-header">
                <span>날짜 선택</span>
                <span class="gi-picker-close-btn" onclick="let $cal = $(this).closest('.gi-col-100'); $cal.find('.gi-picker-overlay').remove(); $cal.find('.gi-calendar-top-date').removeClass('active');"><i class="fa-solid fa-xmark"></i></span>
            </div>
            <div class="gi-picker-content">
                <div class="gi-picker-highlight"></div>
                <div class="gi-picker-column gi-picker-year-col">
                    <div class="gi-picker-spacer"></div>
                    ${years.map(y => `<div class="gi-picker-item ${y === year ? 'active' : ''}" data-value="${y}">${y}</div>`).join('')}
                    <div class="gi-picker-spacer"></div>
                </div>
                <div class="gi-picker-column gi-picker-month-col">
                    <div class="gi-picker-spacer"></div>
                    ${months.map(m => `<div class="gi-picker-item ${m === month ? 'active' : ''}" data-value="${m}">${m}월</div>`).join('')}
                    <div class="gi-picker-spacer"></div>
                </div>
            </div>
            <div class="gi-picker-footer">
                <button type="button" class="gi-picker-confirm-btn">확인</button>
            </div>
        </div>
    `;

    $calendar.find(".gi-calendar-body-container").append(pickerHtml);

    // 초기 스크롤 위치 설정
    setTimeout(() => {
        const $yearCol = $calendar.find(".gi-picker-year-col");
        const $monthCol = $calendar.find(".gi-picker-month-col");

        const $activeYear = $yearCol.find(".gi-picker-item.active");
        const $activeMonth = $monthCol.find(".gi-picker-item.active");

        if ($activeYear.length) {
            $yearCol.scrollTop($activeYear[0].offsetTop - $yearCol.height() / 2 + $activeYear.height() / 2);
        }
        if ($activeMonth.length) {
            $monthCol.scrollTop($activeMonth[0].offsetTop - $monthCol.height() / 2 + $activeMonth.height() / 2);
        }
    }, 150);

    // 스크롤 이벤트로 활성화된 아이템 강조 및 3D 효과 적용
    $calendar.find(".gi-picker-column").on("scroll", function () {
        let $col = $(this);
        let center = $col.scrollTop() + $col.height() / 2;
        let closestItem = null;
        let minDiff = Infinity;

        $col.find(".gi-picker-item").each(function () {
            let itemCenter = this.offsetTop + this.offsetHeight / 2;
            let diff = center - itemCenter; // 중앙으로부터의 거리
            let absDiff = Math.abs(diff);

            // 3D 회전 효과 및 투명도 계산
            let rotation = (diff / 2); // 회전 각도
            let opacity = Math.max(0.2, 1 - (absDiff / 120)); // 투명도
            let scale = Math.max(0.8, 1 - (absDiff / 350)); // 크기 조절

            $(this).css({
                "transform": `rotateX(${rotation}deg) scale(${scale})`,
                "opacity": opacity
            });

            if (absDiff < minDiff) {
                minDiff = absDiff;
                closestItem = $(this);
            }
        });

        if (closestItem && !closestItem.hasClass("active")) {
            $col.find(".gi-picker-item").removeClass("active");
            closestItem.addClass("active");
        }
    });

    // 항목 클릭 시 해당 항목으로 스크롤 이동 기능 추가
    $calendar.find(".gi-picker-item").on("click", function () {
        let $item = $(this);
        let $col = $item.closest(".gi-picker-column");

        // 해당 아이템이 중앙에 오도록 스크롤 이동
        $col.animate({
            scrollTop: this.offsetTop - $col.height() / 2 + this.offsetHeight / 2
        }, 150);
    });

    // 확인 버튼 클릭 이벤트
    $(".gi-picker-confirm-btn").on("click", function () {
        let selectedYear = $(".gi-picker-year-col .gi-picker-item.active").data("value");
        let selectedMonth = $(".gi-picker-month-col .gi-picker-item.active").data("value");

        if (isDatePicker) {
            formUtil.giDatePicker(input, new Date(selectedYear, selectedMonth - 1));
        } else {
            formUtil.giCalendar(new Date(selectedYear, selectedMonth - 1));
        }
    });
}
