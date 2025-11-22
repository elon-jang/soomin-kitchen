#!/bin/bash

# Vercel 환경 변수 업로드 스크립트
# Usage: ./upload-env-to-vercel.sh [environment]
# environment: production | preview | development (기본값: production)

ENV_FILE=".env"
ENVIRONMENT="${1:-production}"

# 색상 코드
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# .env 파일 존재 확인
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}Error: $ENV_FILE 파일을 찾을 수 없습니다.${NC}"
  exit 1
fi

# Vercel CLI 설치 확인
if ! command -v vercel &> /dev/null; then
  echo -e "${RED}Error: Vercel CLI가 설치되어 있지 않습니다.${NC}"
  echo "설치: npm install -g vercel"
  exit 1
fi

echo -e "${GREEN}=== Vercel 환경 변수 업로드 ===${NC}"
echo -e "파일: ${YELLOW}$ENV_FILE${NC}"
echo -e "환경: ${YELLOW}$ENVIRONMENT${NC}"
echo ""

# 카운터
SUCCESS_COUNT=0
SKIP_COUNT=0
ERROR_COUNT=0

# .env 파일 읽기
while IFS= read -r line || [ -n "$line" ]; do
  # 빈 줄과 주석 건너뛰기
  if [[ -z "$line" ]] || [[ "$line" =~ ^[[:space:]]*# ]]; then
    continue
  fi

  # KEY=VALUE 형식 파싱
  if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
    KEY="${BASH_REMATCH[1]}"
    VALUE="${BASH_REMATCH[2]}"

    # 따옴표 제거 (앞뒤)
    VALUE=$(echo "$VALUE" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")

    echo -e "📤 업로드 중: ${YELLOW}$KEY${NC}"

    # Vercel에 환경 변수 추가
    # printf를 사용하여 값을 stdin으로 전달 (newline 없이)
    OUTPUT=$(printf "%s" "$VALUE" | vercel env add "$KEY" "$ENVIRONMENT" 2>&1)
    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ]; then
      echo -e "   ${GREEN}✓ 성공${NC}"
      ((SUCCESS_COUNT++))
    else
      # 오류 메시지 확인
      if echo "$OUTPUT" | grep -q "already exists"; then
        echo -e "   ${YELLOW}⚠ 이미 존재합니다. --force 플래그로 덮어쓸 수 있습니다.${NC}"
        ((SKIP_COUNT++))
      else
        echo -e "   ${RED}✗ 실패: $OUTPUT${NC}"
        ((ERROR_COUNT++))
      fi
    fi
    echo ""
  fi
done < "$ENV_FILE"

# 결과 요약
echo -e "${GREEN}=== 완료 ===${NC}"
echo -e "성공: ${GREEN}$SUCCESS_COUNT${NC}"
echo -e "건너뜀: ${YELLOW}$SKIP_COUNT${NC}"
if [ $ERROR_COUNT -gt 0 ]; then
  echo -e "실패: ${RED}$ERROR_COUNT${NC}"
fi
echo ""
echo -e "${YELLOW}💡 Tip: Vercel 대시보드에서 확인하세요${NC}"
echo -e "   https://vercel.com/dashboard"
echo ""
echo -e "${YELLOW}💡 변경사항을 적용하려면 재배포가 필요합니다${NC}"
