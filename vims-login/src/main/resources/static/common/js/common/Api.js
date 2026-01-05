/**
 * @title : 카카오맵
 * @see : 
 * @text : 카카오맵 생성 Class함수
 * @writer : 이경태
 */
class kakaoMap {
    constructor() {
        // 카카오 지도 API가 로드되었는지 확인
        if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
            loadKakaoMapScript(); // 카카오 맵 API 스크립트 로드 함수 호출
        }
    }

    // 지도 생성 함수
    createMap(id, keyword) {
        var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
        this.deleteMap(id);
        var mapContainer = document.getElementById(id), // 지도를 표시할 div
            mapOption = {
                center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

        // 지도를 생성합니다
        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        // 장소 검색 객체를 생성합니다
        var ps = new kakao.maps.services.Places();

        // 키워드로 장소를 검색합니다
        // ps.keywordSearch(keyword, placesSearchCB);

        // 주소로 좌표를 검색 검색합니다
        // 주소로 좌표를 검색합니다

        // 키워드 검색 완료 시 호출되는 콜백함수
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                // 검색된 장소 위치를 기준으로 지도 범위를 재설정
                var bounds = new kakao.maps.LatLngBounds();

                for (var i = 0; i < data.length; i++) {
                    displayMarker(data[i]);
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }

                // 지도 범위 재설정
                map.setBounds(bounds);
            }
        }
        geocoder.addressSearch(keyword, function (result, status) {

            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {

                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                var infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">' + keyword + '</div>'
                });
                infowindow.open(map, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
            }
        });
        // 지도에 마커를 표시하는 함수
        function displayMarker(place) {
            var marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x)
            });

            // 마커 클릭 시 인포윈도우 표시
            kakao.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                infowindow.open(map, marker);
            });
        }
    }

    // 지도 삭제 함수
    deleteMap(id) {
        $("#" + id).empty();
    }
}

// Kakao Maps API 스크립트 로딩 함수
function loadKakaoMapScript() {
    if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
        var script = document.createElement('script');
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=08b7a9bdd253ada6f1d65275b08aec58&libraries=services";
        script.type = "text/javascript";
        script.onload = function () {
        };
        document.head.appendChild(script); // head에 추가하여 스크립트 로드
    }
}