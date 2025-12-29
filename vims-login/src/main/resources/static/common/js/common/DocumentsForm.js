function DocumentsForm() {}

DocumentsForm.prototype.vacationRegisterForm = function(ID){
    const department = $("#input-department-container-canvas")[0];
    const position = $("#input-position-container-canvas")[0];
    const description = $("#input-description-container-canvas")[0];
    const vacation_type = $("#select-vacation_type-container-canvas")[0];

    const canvas = $("#"+ID)[0];
    const ctx = canvas.getContext("2d");
    let resizeTimer;

    let styleSheet = null;

    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 500);
    });
    resizeCanvas();

    function resizeCanvas() {
        canvas.width = $(canvas).width();
        canvas.height = $(canvas).height();

        department.style.width = canvas.width + "px";
        department.style.height = canvas.height /14 + "px";

        position.style.width = canvas.width + "px";
        position.style.height = canvas.height /14 + "px";

        description.style.width = canvas.width + "px";
        description.style.height = canvas.height /14 + "px";
        draw();
    }
    function draw(){
        let rect_width = canvas.width;
        let rect_height = canvas.height;
        let col = Math.ceil(rect_height/10);
        ctx.beginPath();

        ctx.moveTo(0 ,0);
        ctx.rect(rect_width/6, 10, rect_width/1.5, rect_height - 20);

        ctx.moveTo(rect_width/6 ,col);
        ctx.lineTo(rect_width/1.2, col);

        ctx.moveTo(rect_width/2 ,10);
        ctx.lineTo(rect_width/2, col);

        //직위 오른쪽 세로선
        ctx.moveTo(rect_width/2 + rect_width/8 ,10);
        ctx.lineTo(rect_width/2 + rect_width/8, col);

        ctx.moveTo(rect_width/6 ,col*2);
        ctx.lineTo(rect_width/1.2, col*2);

        ctx.moveTo(rect_width/6 ,col*3);
        ctx.lineTo(rect_width/1.2, col*3);

        ctx.moveTo(rect_width/6 ,col*4);
        ctx.lineTo(rect_width/1.2, col*4);

        ctx.moveTo(rect_width/6 ,col*8);
        ctx.lineTo(rect_width/1.2, col*8);

        ctx.moveTo(rect_width/4 ,col*8.5);
        ctx.lineTo(rect_width/1.2, col*8.5);

        ctx.moveTo(rect_width/4 , 10);
        ctx.lineTo((rect_width/4), rect_height - 10)


        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font =`${rect_width/6 /15}px Arial`;
        ctx.fillText("부 서", (rect_width/6) + (rect_width/6)/4 , col/1.6);
        ctx.fillText("직위", (rect_width/2) + (rect_width/2)/8 , col/1.6);
        ctx.fillText("설 명", (rect_width/6) + (rect_width/6)/4 , col + col/1.8);
        ctx.fillText("휴가의종류", (rect_width/6) + (rect_width/6)/4 , col*2 + col/2);
        ctx.fillText("기 간", (rect_width/6) + (rect_width/6)/4 , col*3 + col/1.8);
        ctx.fillText("결 재", (rect_width/6) + (rect_width/6)/4 , col*8.9);


        if (!styleSheet) {
            styleSheet = document.createElement("style");
            styleSheet.id = "dynamic-styles";
            document.head.appendChild(styleSheet);
        }
        let fontSize = rect_width / 6 /15;
        styleSheet.innerHTML = `.gi-input{font-size: ${fontSize}px !important;}`;


        let inputX = rect_width/3.8; // 수평선의 시작 x 좌표
        let inputY = 16;      // 수평선의 y 좌표
        let inputWidth = rect_width/2 - rect_width/3;// 입력 필드의 너비 설정
        department.style.left = inputX + "px";
        department.style.top = inputY + "px"; // 입력 필드 높이를 조정하여 중앙에 맞추기
        department.style.width = inputWidth + "px";
        department.style.display = "block";

        let position_inputX =(rect_width/2 + rect_width/7); // 수평선의 시작 x 좌표
        let position_inputY = 16;      // 수평선의 y 좌표
        let position_inputWidth = rect_width/2 - rect_width/3;// 입력 필드의 너비 설정
        position.style.left = position_inputX + "px";
        position.style.top = position_inputY + "px"; // 입력 필드 높이를 조정하여 중앙에 맞추기
        position.style.width = position_inputWidth + "px";
        position.style.display = "block";

        let description_inputX = rect_width/3.8; // 수평선의 시작 x 좌표
        let description_inputY = col;      // 수평선의 y 좌표
        let description_inputWidth = rect_width/2 - rect_width/3;// 입력 필드의 너비 설정
        description.style.left = description_inputX + "px";
        description.style.top = description_inputY + "px"; // 입력 필드 높이를 조정하여 중앙에 맞추기
        description.style.width = description_inputWidth + "px";
        description.style.display = "block";


        vacation_type.style.display = "block";


        ctx.closePath();
        ctx.stroke();
    }
}
