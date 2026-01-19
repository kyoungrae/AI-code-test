#!/bin/bash
# VIMS 애플리케이션 중지 스크립트 (Gateway, FMS, CMS, Login)

echo "=== 🛑 VIMS 애플리케이션 중지 시작 ==="

# 중지 대상 Application 메인 클래스명
# pgrep/ps 검색을 위해 메인 클래스 키워드를 사용합니다.
APPS=(
    "vims-login-ROOT.jar"
    "vims-management-ROOT.jar"
    "FMS-ROOT.jar"
    "vims-gateway-ROOT.jar"
)

# 사용자 친화적인 이름 매핑
NAMES=(
    "Login (vims-login)"
    "CMS (vims-management-system)"
    "FMS (FMS)"
    "Gateway (vims-gateway)"
)

for i in "${!APPS[@]}"; do
    APP=${APPS[$i]}
    NAME=${NAMES[$i]}
    
    echo "🔍 $NAME 프로세스 확인 중..."
    
    # 클래스명을 포함하는 프로세스 ID 찾기
    PIDS=$(ps -ef | grep "$APP" | grep -v grep | awk '{print $2}')
    
    if [ -n "$PIDS" ]; then
        for PID in $PIDS; do
            echo "⏳ $NAME (PID: $PID) 중지 시도 (SIGTERM)..."
            kill -15 $PID
        done
        
        # 종료 대기
        sleep 5
        
        # 여전히 살아있는지 재확인
        PIDS_RECHECK=$(ps -ef | grep "$APP" | grep -v grep | awk '{print $2}')
        if [ -n "$PIDS_RECHECK" ]; then
            for PID in $PIDS_RECHECK; do
                echo "⚠️ $NAME (PID: $PID) 가 정상 종료되지 않아 강제 종료(SIGKILL)합니다."
                kill -9 $PID
            done
        fi
        echo "✅ $NAME 중지 완료."
    else
        echo "ℹ️ $NAME 가 실행 중이 아닙니다."
    fi
    echo "--------------------------------------"
done

echo "=== 🎉 모든 애플리케이션 중지 완료! ==="
