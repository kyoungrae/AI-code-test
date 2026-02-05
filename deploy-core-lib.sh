#!/bin/bash
# Core-lib 빌드 및 배포 스크립트
# 각 서비스별로 두 가지 JAR 파일 생성:
#   - [서비스명]-ROOT.jar (application.yml 적용 - 로컬/개발 환경)
#   - [서비스명]-podman-ROOT.jar (application-podman.yml을 기본으로 적용 - Podman 운영 환경)

# 출력 디렉토리 설정
OUTPUT_DIR="$(pwd)/deploy-output"
mkdir -p "$OUTPUT_DIR"

echo "=== 0. 빌드 찌꺼기 폴더 정리 ==="
find . -type d -name "* [0-9]*" -exec rm -rf {} +
find . -type f -name "* [0-9]*.jar" -exec rm -f {} +
echo "✅ 중복 생성된 폴더 및 파일 정리 완료!"
echo ""

echo "=== 1. Core-lib Maven 빌드 시작 ==="

# Maven 명령어 찾기
MVN_CMD="mvn"
FOUND_MVN=false

if command -v mvn &> /dev/null; then
    FOUND_MVN=true
else
    POSSIBLE_PATHS=(
        "/Applications/IntelliJ IDEA.app/Contents/plugins/maven/lib/maven3/bin/mvn"
        "/Applications/IntelliJ IDEA CE.app/Contents/plugins/maven/lib/maven3/bin/mvn"
        "$HOME/Applications/IntelliJ IDEA.app/Contents/plugins/maven/lib/maven3/bin/mvn"
        "$HOME/Applications/IntelliJ IDEA CE.app/Contents/plugins/maven/lib/maven3/bin/mvn"
    )
    
    for PATH_CHECK in "${POSSIBLE_PATHS[@]}"; do
        if [ -f "$PATH_CHECK" ]; then
            MVN_CMD="$PATH_CHECK"
            FOUND_MVN=true
            echo "ℹ️ IntelliJ 내장 Maven을 찾았습니다: $MVN_CMD"
            break
        fi
    done
fi

if [ "$FOUND_MVN" = false ]; then
    echo "⚠️ 'mvn' 명령어를 찾을 수 없습니다."
    exit 1
fi

# Core-lib 빌드
cd Core-lib
echo "🚀 빌드 명령 실행: $MVN_CMD clean install -DskipTests -Dmaven.javadoc.skip=true"
"$MVN_CMD" clean install -DskipTests -Dmaven.javadoc.skip=true
if [ $? -ne 0 ]; then
    echo "❌ Maven 빌드에 실패했습니다."
    exit 1
fi
echo "✅ Maven 빌드 성공!"
cd ..
echo ""

echo "=== 2. JAR 파일 배포 시작 ==="

JAR_PATH="Core-lib/core-lib/target/core-lib-1.0.jar"

if [ ! -f "$JAR_PATH" ]; then
    echo "❌ 오류: 빌드 결과물($JAR_PATH)을 찾을 수 없습니다."
    exit 1
fi

# lib 디렉토리 생성 및 배포
for dir in vims-management-system vims-login FMS vims-web-app; do
    mkdir -p "$dir/src/lib"
    echo "📦 $dir에 배포 중..."
    cp "$JAR_PATH" "$dir/src/lib/"
done

echo ""
echo "=== Core-lib 배포 완료! ==="

# ==========================================
# 함수: 프로젝트 빌드 및 JAR 파일 생성
# ==========================================
build_project_dual() {
    local PROJECT_DIR=$1
    local ARTIFACT_ID=$2
    local DISPLAY_NAME=$3
    local RESOURCES_DIR="$PROJECT_DIR/src/main/resources"
    
    echo ""
    echo "=========================================="
    echo "=== $DISPLAY_NAME 프로젝트 빌드 시작 ==="
    echo "=========================================="
    cd "$PROJECT_DIR"
    
    # application.yml 백업
    if [ -f "$RESOURCES_DIR/application.yml" ]; then
        cp "$RESOURCES_DIR/application.yml" "$RESOURCES_DIR/application.yml.backup"
    fi
    
    # ==========================================
    # 1. 기본 프로파일로 빌드 (application.yml)
    # ==========================================
    echo ""
    echo "📌 [1단계] 기본 프로파일 빌드 (application.yml)..."
    "$MVN_CMD" clean package -DskipTests -Dmaven.javadoc.skip=true
    if [ $? -ne 0 ]; then
        echo "⚠️ 첫 번째 시도 실패, 재시도 중..."
        sleep 1
        "$MVN_CMD" clean package -DskipTests -Dmaven.javadoc.skip=true
        if [ $? -ne 0 ]; then
            echo "❌ $DISPLAY_NAME 기본 빌드 실패"
            # 백업 복원
            if [ -f "$RESOURCES_DIR/application.yml.backup" ]; then
                cp "$RESOURCES_DIR/application.yml.backup" "$RESOURCES_DIR/application.yml"
                rm "$RESOURCES_DIR/application.yml.backup"
            fi
            cd ..
            return 1
        fi
    fi
    
    # 기본 JAR 파일 복사
    if [ -f "target/${ARTIFACT_ID}-0.0.1-SNAPSHOT.jar" ]; then
        cp "target/${ARTIFACT_ID}-0.0.1-SNAPSHOT.jar" "$OUTPUT_DIR/${ARTIFACT_ID}-ROOT.jar"
        echo "✅ ${ARTIFACT_ID}-ROOT.jar 생성 완료!"
    else
        echo "⚠️ 기본 JAR 파일을 찾을 수 없습니다"
    fi
    
    # ==========================================
    # 2. Podman 프로파일로 빌드 
    # (application-podman.yml을 application.yml로 임시 대체)
    # ==========================================
    if [ -f "$RESOURCES_DIR/application-podman.yml" ]; then
        echo ""
        echo "📌 [2단계] Podman 프로파일 빌드..."
        echo "   → application-podman.yml을 기본 설정으로 적용"
        
        # application-podman.yml을 application.yml로 복사
        cp "$RESOURCES_DIR/application-podman.yml" "$RESOURCES_DIR/application.yml"
        
        # 빌드
        "$MVN_CMD" clean package -DskipTests -Dmaven.javadoc.skip=true
        if [ $? -ne 0 ]; then
            echo "⚠️ Podman 빌드 첫 번째 시도 실패, 재시도 중..."
            sleep 1
            "$MVN_CMD" clean package -DskipTests -Dmaven.javadoc.skip=true
        fi
        
        # Podman JAR 파일 복사
        if [ -f "target/${ARTIFACT_ID}-0.0.1-SNAPSHOT.jar" ]; then
            cp "target/${ARTIFACT_ID}-0.0.1-SNAPSHOT.jar" "$OUTPUT_DIR/${ARTIFACT_ID}-podman-ROOT.jar"
            echo "✅ ${ARTIFACT_ID}-podman-ROOT.jar 생성 완료!"
        else
            echo "⚠️ Podman JAR 파일을 찾을 수 없습니다"
        fi
        
        # 원본 application.yml 복원
        cp "$RESOURCES_DIR/application.yml.backup" "$RESOURCES_DIR/application.yml"
    else
        echo "⚠️ application-podman.yml이 없습니다. 기본 JAR만 생성됩니다."
    fi
    
    # 백업 파일 삭제
    rm -f "$RESOURCES_DIR/application.yml.backup"
    
    echo "✅ $DISPLAY_NAME 빌드 완료!"
    cd ..
    return 0
}

# ==========================================
# 각 프로젝트 빌드
# ==========================================

echo ""
echo "=== 3. vims-login 프로젝트 빌드 ==="
build_project_dual "vims-login" "vims-login" "vims-login"

echo ""
echo "=== 4. vims-management-system 프로젝트 빌드 ==="
build_project_dual "vims-management-system" "vims-management" "vims-management-system"

echo ""
echo "=== 5. vims-gateway 프로젝트 빌드 ==="
build_project_dual "vims-gateway" "vims-gateway" "vims-gateway"

echo ""
echo "=== 6. FMS 프로젝트 빌드 ==="
build_project_dual "FMS" "FMS" "FMS"

echo ""
echo "=== 7. vims-web-app 프로젝트 빌드 ==="
build_project_dual "vims-web-app" "vims-web-app" "vims-web-app"

echo ""
echo "=========================================="
echo "🎉 모든 작업이 완료되었습니다! 🎉"
echo "=========================================="
echo ""
echo "📦 생성된 JAR 파일 목록:"
echo "----------------------------------------"
ls -lh "$OUTPUT_DIR"/*.jar 2>/dev/null | while read line; do
    echo "   $line"
done
echo ""
echo "=========================================="
echo "📋 JAR 파일 설명:"
echo "=========================================="
echo "  [서비스명]-ROOT.jar         : 로컬/개발 환경용"
echo "                               (application.yml 적용)"
echo ""
echo "  [서비스명]-podman-ROOT.jar  : Podman 운영 환경용"
echo "                               (application-podman.yml 적용)"
echo "                               DB: host.containers.internal:3306"
echo "                               서비스간 통신: host.containers.internal"
echo "=========================================="
echo ""
echo "🚀 Podman 컨테이너에서 실행 방법:"
echo "=========================================="
echo "# 각 컨테이너에 JAR 파일 복사 후:"
echo ""
echo "# vims-gateway (포트 8080)"
echo "java -jar vims-gateway-podman-ROOT.jar"
echo ""
echo "# vims-login (포트 8081)"
echo "java -jar vims-login-podman-ROOT.jar"
echo ""
echo "# vims-management (포트 8082)"
echo "java -jar vims-management-podman-ROOT.jar"
echo ""
echo "# FMS (포트 8083)"
echo "java -jar FMS-podman-ROOT.jar"
echo ""
echo "# vims-web-app (포트 8084)"
echo "java -jar vims-web-app-podman-ROOT.jar"
echo "=========================================="
