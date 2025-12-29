#!/bin/bash
# Core-lib JAR 배포 스크립트

echo "=== Core-lib JAR 배포 시작 ==="

# JAR 파일 존재 확인
if [ ! -f "Core-lib/core-lib/target/core-lib-1.0.jar" ]; then
    echo "❌ 오류: core-lib-1.0.jar 파일이 없습니다."
    echo "먼저 IntelliJ Maven에서 'install'을 실행하세요."
    exit 1
fi

# lib 디렉토리 생성
mkdir -p vims-management-system/src/lib
mkdir -p vims-login/src/lib

# JAR 파일 복사
echo "📦 vims-management-system에 배포 중..."
cp Core-lib/core-lib/target/core-lib-1.0.jar vims-management-system/src/lib/

echo "📦 vims-login에 배포 중..."
cp Core-lib/core-lib/target/core-lib-1.0.jar vims-login/src/lib/

# 결과 확인
echo ""
echo "=== 배포 완료! ==="
echo ""
echo "배포된 파일:"
ls -lh vims-management-system/src/lib/core-lib-1.0.jar
ls -lh vims-login/src/lib/core-lib-1.0.jar

echo ""
echo "✅ 이제 각 애플리케이션을 재시작하세요!"
