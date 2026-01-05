#!/bin/bash
# Core-lib 빌드 및 배포 스크립트

echo "=== 1. Core-lib Maven 빌드 시작 ==="

# Core-lib 디렉토리로 이동하여 빌드 수행
cd Core-lib

if command -v mvn &> /dev/null; then
    mvn clean install -DskipTests
    if [ $? -ne 0 ]; then
        echo "❌ Maven 빌드에 실패했습니다."
        exit 1
    fi
    echo "✅ Maven 빌드 성공!"
else
    echo "⚠️ 'mvn' 명령어를 찾을 수 없습니다. 자동 빌드를 건너뜁니다."
    echo "ℹ️ IntelliJ 등 IDE에서 Core-lib을 수동으로 빌드(install)해주세요."
fi

# 다시 프로젝트 루트로 이동
cd ..
echo ""

echo "=== 2. JAR 파일 배포 시작 ==="

# JAR 파일 경로
JAR_PATH="Core-lib/core-lib/target/core-lib-1.0.jar"

# JAR 파일 존재 확인
if [ ! -f "$JAR_PATH" ]; then
    echo "❌ 오류: 빌드는 성공했으나 $JAR_PATH 파일이 생성되지 않았습니다."
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
