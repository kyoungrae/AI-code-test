/**
 * @title : 파이 차트 초기화
 * @text : 파이차트 생성
 * @id : pieChart 적용 ID 파라미터 [String]
 * @writer : 이경태
 * */
FormUtility.prototype.pieChartInit = function (ID) {
    const canvas = $("#" + ID)[0];
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = $(canvas).width();
        canvas.height = $(canvas).height();

        drawChart();
    }
    function drawChart() {
        let width = canvas.width;
        let height = canvas.height;
        let cont = [
            { NUM: 9, TEXT: "남은 휴가" },
            { NUM: 3, TEXT: "반차" },
            { NUM: 3, TEXT: "연차" }
        ];

        ctx.clearRect(0, 0, width, height);

        let degree = 360;
        let radius = width * 0.9 / 2; // 반지름 동적 부여

        if (radius > height * 0.9 / 2) { // 캔버스의 넓이와 높이를 고려하여 최소크기 적용
            radius = height * 0.9 / 2;
        }

        const colorArray = ['#35a3e7', '#a2a5a6', '#918f8f'];
        let sum = 0;
        cont.forEach(arg => sum += arg.NUM);

        let conv_array = cont.slice().map((data) => { // 각도가 들어있는 배열
            let rate = data.NUM / sum;
            let myDegree = degree * rate;
            return myDegree;
        });

        degree = 0;

        let event_array = cont.slice().map(arg => []); // 이벤트(각도 범위가 있는)용 배열
        let current = -1; // 현재 동작중 인덱스
        let zero = 0; // 각(degree)에 대해서 증가하는 값

        let clr = setInterval(() => {
            for (let i = 0; i < conv_array.length; i++) {
                let item = conv_array[i];

                if (current === -1 || current === i) {
                    current = i;
                    if (zero < item) {
                        if (i === 0) {
                            arcMaker(radius, 0, zero, colorArray[i]);
                        } else {
                            let increase = degree + zero;
                            arcMaker(radius, degree, increase, colorArray[i]);
                        }
                        zero += 3;
                    } else {
                        current = i + 1;
                        zero = 0;
                        if (i !== 0) {
                            let increase = degree + item;
                            arcMaker(radius, degree, increase, colorArray[i]);
                            event_array[i] = [degree, increase];
                            degree = increase;
                        } else {
                            arcMaker(radius, 0, item, colorArray[i]);
                            degree = item;
                            event_array[i] = [0, degree];
                        }
                    }
                } else if (current === conv_array.length) {
                    clearInterval(clr);
                    makeText(-1);
                }
            }
        }, 1);

        function arcMaker(radius, begin, end, color) {
            ctx.lineJoin = 'round'; // 선이만나 꺾이는 부분때문에 부여(삐져나오는 현상 방지)
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(width / 2, height / 2);
            ctx.arc(width / 2, height / 2, radius, (Math.PI / 180) * begin, (Math.PI / 180) * end, false);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.strokeStyle = 'white';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            middelMaker();  // 가운데 원형그리기 함수 추가
        }

        let drawed = false;

        $(canvas).on('mousemove', function (event) {
            let x1 = event.clientX - canvas.offsetLeft;
            let y1 = event.clientY - canvas.offsetTop;
            let inn = isInsideArc(x1, y1);
            if (inn.index > -1) {  // 대상이 맞으면
                drawed = true;
                // hoverCanvas(inn.index);
                // makeText(inn.index);
            } else {  // 대상이 아니면
                if (drawed) {  // 대상이였다가 대상이 이제 아니면
                    // hoverCanvas(-1);
                    // makeText(-1);
                }
                drawed = false;
            }
        });

        function isInsideArc(x1, y1) {
            let result1 = false;
            let result2 = false;
            let index = -1;
            let circle_len = radius;
            let x = width / 2 - x1;
            let y = height / 2 - y1;
            let my_len = Math.sqrt(Math.abs(x * x) + Math.abs(y * y));  // 삼각함수

            if (circle_len >= my_len) {
                result1 = true;
            }

            let rad = Math.atan2(y, x);
            rad = (rad * 180) / Math.PI;  // 음수가 나온다
            rad += 180;  // 캔버스의 각도로 변경

            if (result1) {
                event_array.forEach((arr, idx) => {   // 각도 범위에 해당하는지 확인
                    if (rad >= arr[0] && rad <= arr[1]) {
                        result2 = true;
                        index = idx;
                    }
                });
            }
            return { result1: result1, result2: result2, index: index, degree: rad };
        }

        // 마우스 오버효과
        // function hoverCanvas(index){
        //     ctx.clearRect(0,0,width, height);
        //     for (let i = 0; i < conv_array.length; i++) {
        //         let item = conv_array[i];
        //         let innRadius = radius;
        //         if(index == i){
        //             innRadius = radius * 1.1;  // 대상이 맞으면 1.1배 크게 키운다.
        //         }
        //         if (i == 0) {
        //             arcMaker(innRadius, 0, item, colorArray[i])
        //             degree = item;
        //         } else {
        //             arcMaker(innRadius, degree, degree + item, colorArray[i])
        //             degree = degree + item;
        //         }
        //     }
        // }

        // 도(degree)를 라디안(radian)으로 바꾸는 함수
        function degreesToRadians(degrees) {
            const pi = Math.PI;
            return degrees * (pi / 180);
        }

        // 텍스트함수
        function makeText(index) {
            event_array.forEach((itm, idx) => {
                let half = (itm[1] - itm[0]) / 2;
                let degg = itm[0] + half;
                let xx = Math.cos(degreesToRadians(degg)) * radius * 0.7 + width / 2;
                let yy = Math.sin(degreesToRadians(degg)) * radius * 0.7 + height / 2;

                let txt = cont[idx].TEXT + '';
                let minus = ctx.measureText(txt).width / 2;
                ctx.save();
                if (index === idx) {
                    ctx.font = "normal 12px sans-serif";
                    ctx.fillStyle = 'blue';
                } else {
                    ctx.font = "normal 0.8rem sans-serif";
                    ctx.fillStyle = 'white';
                }
                ctx.fillText(txt, xx - minus, yy);
                let txt2 = cont[idx].NUM;
                ctx.fillText(txt2, xx, yy + 16);
                ctx.restore();
            });
        }

        // 중앙 구멍(원)을 만드는 함수
        function middelMaker() {
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
            ctx.lineJoin = 'round'; // 선이만나 꺾이는 부분때문에 부여(삐져나오는 현상 방지)
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(width / 2, height / 2);
            ctx.arc(width / 2, height / 2, radius / 3, 0, (Math.PI / 180) * 360, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

            let total = 0;
            cont.forEach((arg) => total += arg.NUM);

            let minus = ctx.measureText(total).width - 5;
            ctx.save();
            ctx.font = "normal 0.8rem sans-serif";
            ctx.fillStyle = '#656565';
            ctx.fillText("Total", width / 2 - ctx.measureText("Total").width / 2, height / 2);
            ctx.fillText(total, width / 2 - minus, height / 2 * 1.1);
            ctx.restore();
        }
    }
    let resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 500); // 100ms 후에 resizeCanvas 함수 호출
    });
    resizeCanvas();
}
