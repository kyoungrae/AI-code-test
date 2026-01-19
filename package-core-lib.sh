#!/bin/bash
# Core-lib 빌드 및 배포 스크립트

echo "=== 🧹 Core-lib Clean & Install 시작 ==="

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

if [ "$FOUND_MVN" = false ]; then
    echo "❌ 'mvn' 명령어를 찾을 수 없습니다."
    exit 1
fi

# Core-lib 디렉토리로 이동
cd Core-lib
echo "🚀 Core-lib 빌드 실행..."
"$MVN_CMD" clean install -DskipTests -Dmaven.javadoc.skip=true
if [ $? -ne 0 ]; then
    echo "❌ Core-lib 빌드 실패"
    exit 1
fi
echo "✅ Core-lib 빌드 성공!"
cd ..

# JAR 파일 배포
JAR_PATH="Core-lib/core-lib/target/core-lib-1.0.jar"

if [ ! -f "$JAR_PATH" ]; then
    echo "❌ 오류: 빌드 결과물($JAR_PATH)을 찾을 수 없습니다."
    exit 1
fi

echo "=== 📦 라이브러리 배포 ==="
# 각 프로젝트의 lib 폴더에 복사
PROJECTS=(
    "vims-management-system"
    "vims-login"
    "FMS"
)

for PROJ in "${PROJECTS[@]}"; do
    mkdir -p "$PROJ/src/lib"
    cp "$JAR_PATH" "$PROJ/src/lib/"
    echo "✅ $PROJ 에 복사 완료"
done

echo "🎉 Core-lib 패키징 및 배포 완료!"
