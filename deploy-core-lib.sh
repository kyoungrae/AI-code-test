#!/bin/bash
# Core-lib 빌드 및 배포 스크립트

echo "=== 1. Core-lib Maven 빌드 시작 ==="

# Maven 명령어 찾기
MVN_CMD="mvn"
FOUND_MVN=false

if command -v mvn &> /dev/null; then
    FOUND_MVN=true
else
    # 흔한 IntelliJ Maven 경로 탐색 (Mac OS 기준)
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

# Core-lib 디렉토리로 이동하여 빌드 수행
cd Core-lib

if [ "$FOUND_MVN" = true ]; then
    echo "🚀 빌드 명령 실행: $MVN_CMD clean install -DskipTests -Dmaven.javadoc.skip=true"
    "$MVN_CMD" clean install -DskipTests -Dmaven.javadoc.skip=true
    if [ $? -ne 0 ]; then
        echo "❌ Maven 빌드에 실패했습니다."
        exit 1
    fi
    echo "✅ Maven 빌드 성공!"
else
    echo "⚠️ 'mvn' 명령어를 찾을 수 없습니다. (IntelliJ Maven 경로 자동 탐색 실패)"
    echo "ℹ️ 터미널에서 'mvn'을 사용할 수 있도록 설정하거나, IDE에서 직접 빌드해주세요."
fi

# 다시 프로젝트 루트로 이동
cd ..
echo ""

echo "=== 2. JAR 파일 배포 시작 ==="

# JAR 파일 경로
JAR_PATH="Core-lib/core-lib/target/core-lib-1.0.jar"

# JAR 파일 존재 확인
if [ ! -f "$JAR_PATH" ]; then
    echo "❌ 오류: 빌드 결과물($JAR_PATH)을 찾을 수 없습니다."
    echo "👉 IntelliJ Maven 탭에서 'Core-lib > Lifecycle > install'을 실행했는지 확인해주세요."
    exit 1
fi

# lib 디렉토리 생성
mkdir -p vims-management-system/src/lib
mkdir -p vims-login/src/lib

# JAR 파일 복사
echo "📦 vims-management-system에 배포 중..."
cp "$JAR_PATH" vims-management-system/src/lib/

echo "📦 vims-login에 배포 중..."
cp "$JAR_PATH" vims-login/src/lib/

# 결과 확인
echo ""
echo "=== 배포 완료! ==="
echo ""
echo "배포된 파일:"
ls -lh vims-management-system/src/lib/core-lib-1.0.jar
ls -lh vims-login/src/lib/core-lib-1.0.jar

echo ""
echo "✅ 이제 각 애플리케이션을 재시작하세요!"

echo ""
echo "=== 3. vims-login 프로젝트 빌드 시작 ==="
cd vims-login
echo "🚀 vims-login 빌드 실행..."
"$MVN_CMD" clean package -DskipTests -Dmaven.javadoc.skip=true
if [ $? -ne 0 ]; then
    echo "❌ vims-login 빌드 실패"
    exit 1
fi
echo "✅ vims-login 빌드 성공!"
cd ..

echo ""
echo "=== 4. vims-management-system 프로젝트 빌드 시작 ==="
cd vims-management-system
echo "🚀 vims-management-system 빌드 실행..."
"$MVN_CMD" clean package -DskipTests -Dmaven.javadoc.skip=true
if [ $? -ne 0 ]; then
    echo "❌ vims-management-system 빌드 실패"
    exit 1
fi
echo "✅ vims-management-system 빌드 성공!"
cd ..

echo ""
echo "🎉 모든 작업이 완료되었습니다! 🎉"
