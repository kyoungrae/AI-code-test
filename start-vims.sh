#!/bin/bash
# VIMS 애플리케이션 시작 스크립트 (Gateway, FMS, CMS, Login)

echo "=== 🚀 VIMS 애플리케이션 시작 시작 ==="

# JAR 파일 경로 정의
LOGIN_JAR="vims-login/target/vims-login-ROOT.jar"
CMS_JAR="vims-management-system/target/vims-management-ROOT.jar"
FMS_JAR="FMS/target/FMS-ROOT.jar"
GATEWAY_JAR="vims-gateway/target/vims-gateway-ROOT.jar"

# 로그 디렉토리 생성
LOG_DIR="logs"
mkdir -p "$LOG_DIR"

# 시작 함수 정의
start_app() {
    local NAME=$1
    local JAR=$2
    local NAME_LOWER=$(echo "$NAME" | tr '[:upper:]' '[:lower:]')
    local LOG_FILE="$LOG_DIR/${NAME_LOWER}.log"

    echo "--- $NAME 시작 중 ---"
    
    # JAR 파일 존재 여부 확인
    if [ ! -f "$JAR" ]; then
        echo "❌ 오류: $JAR 파일을 찾을 수 없습니다."
        echo "👉 'deploy-core-lib.sh'를 실행하거나 각 프로젝트를 먼저 빌드해주세요."
        echo ""
        return 1
    fi

    # 이미 실행 중인지 확인
    # JAR 파일명을 키워드로 프로세스 검색
    JAR_NAME=$(basename "$JAR")
    EXISTING_PID=$(ps -ef | grep "$JAR_NAME" | grep -v grep | awk '{print $2}')
    
    if [ -n "$EXISTING_PID" ]; then
        echo "ℹ️ $NAME 가 이미 실행 중입니다. (PID: $EXISTING_PID)"
        echo ""
        return 0
    fi

    # 백그라운드 실행 (nohup)
    nohup java -jar "$JAR" > "$LOG_FILE" 2>&1 &
    
    # 실행 성공 여부 확인 (짧은 대기 후 PID 확인)
    sleep 1
    NEW_PID=$(ps -ef | grep "$JAR_NAME" | grep -v grep | awk '{print $2}')
    
    if [ -n "$NEW_PID" ]; then
        echo "✅ $NAME 시작 성공! (PID: $NEW_PID)"
        echo "📜 로그 위치: $LOG_FILE"
    else
        echo "❌ $NAME 시작 실패. 로그($LOG_FILE)를 확인하세요."
    fi
    echo ""
}

# 실행 순서: 서비스들 -> 게이트웨이
start_app "Login" "$LOGIN_JAR"
start_app "CMS" "$CMS_JAR"
start_app "FMS" "$FMS_JAR"
start_app "Gateway" "$GATEWAY_JAR"

echo "=== 🎉 모든 애플리케이션 시작 프로세스 요청 완료! ==="
echo "💡 각 서비스의 상태는 'ps -ef | grep java' 또는 로그 파일을 확인하세요."
echo "💡 로그 실시간 확인: tail -f logs/[서비스명].log"
