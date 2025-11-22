#!/bin/bash
# .env 파일의 각 변수를 Vercel에 업로드

while IFS='=' read -r key value; do
  # 빈 줄이나 주석 무시
  if [[ -z "$key" || "$key" =~ ^# ]]; then
    continue
  fi
  
  # 환경 변수 추가 (production, preview, development 모두)
  echo "Adding $key..."
  echo "$value" | vercel env add "$key" production preview development
done < .env

echo "✅ All environment variables uploaded to Vercel!"
