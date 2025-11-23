# 🛍️ Korean Shopping Mall

React 19와 Vite를 사용한 한국 식품 및 건강식품 전문 쇼핑몰 애플리케이션입니다.

## ✨ 주요 기능

### 🌐 다국어 지원 (Multilingual)
- 한국어/영어 실시간 전환
- LanguageContext를 통한 전역 언어 상태 관리
- 모든 UI 텍스트, 상품 정보, 카테고리 다국어 지원
- localStorage에 언어 설정 저장

### 🔐 사용자 인증
- 이메일 기반 회원가입 및 로그인
- Supabase Authentication 연동
- 보호된 라우트 (체크아웃 페이지)
- 사용자별 맞춤 경험
- 세션 자동 유지

### 🛒 장바구니 관리
- 실시간 장바구니 동기화
- 로그인 사용자: Supabase 데이터베이스 연동
- 비로그인 사용자: localStorage 사용
- 다중 디바이스 간 장바구니 동기화
- 수량 조절 및 상품 삭제
- 장바구니 담기 성공 모달

### 📦 상품 관리
- **하이브리드 데이터 전략**: Supabase 데이터베이스 우선 연동, 실패 시 로컬 데이터(`products.js`) 폴백
- 카테고리별 상품 분류
- 상품 상세 정보 페이지
- 신상품 표시
- 반응형 그리드 레이아웃

### 💳 결제 시스템
- 토스페이먼츠 결제위젯 연동
- 다양한 결제 수단 지원 (카드, 간편결제 등)
- 실시간 결제 상태 추적
- 주문 내역 데이터베이스 저장
- 결제 성공/실패 페이지 분리 처리

## 🚀 기술 스택

### Frontend
- **React 19.2.0** - 최신 React 기능 활용
- **Vite 7.2.4** - 빠른 개발 서버 및 빌드
- **React Router DOM 7.9.6** - 클라이언트 사이드 라우팅
- **Tailwind CSS 4.1.17** - 유틸리티 기반 스타일링
- **Framer Motion 12.23.24** - 부드러운 애니메이션
- **Lucide React** - 아이콘 라이브러리

### Backend & Services
- **Supabase** - 인증, 데이터베이스, 스토리지
  - PostgreSQL 데이터베이스
  - Row Level Security (RLS)
  - Authentication
- **토스페이먼츠** - 결제 처리

## 📋 시작하기

### 1. 저장소 클론

```bash
git clone <repository-url>
cd shopping
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 입력하세요:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Tosspayments Configuration
VITE_TOSS_CLIENT_KEY=your-toss-client-key
VITE_TOSS_SECRET_KEY=your-toss-secret-key
```

자세한 설정 방법은 [SETUP_GUIDE.md](./SETUP_GUIDE.md)를 참고하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 을 열어 확인하세요.

## 🏗️ 프로젝트 구조

```
soomin-kitchen/
├── public/                    # 정적 파일
│   ├── products/              # 상품 이미지 (빌드 시 복사됨)
│   │   ├── kimchi.png
│   │   ├── bulgogi-marinade.png
│   │   └── ...
│   └── vite.svg
├── src/
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── Button.jsx
│   │   ├── CartSuccessModal.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/               # React Context
│   │   ├── AuthContext.jsx    # 인증 상태 관리
│   │   ├── CartContext.jsx    # 장바구니 상태 관리
│   │   └── LanguageContext.jsx # 다국어 지원
│   ├── data/                  # 정적 데이터 (Fallback)
│   │   └── products.js
│   ├── hooks/                 # Custom React Hooks
│   │   └── useProducts.js
│   ├── lib/                   # 라이브러리 설정
│   │   └── supabase.js
│   ├── pages/                 # 페이지 컴포넌트
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── PaymentFail.jsx
│   │   ├── PaymentSuccess.jsx
│   │   ├── ProductDetail.jsx
│   │   └── Signup.jsx
│   ├── translations/          # 다국어 번역 파일
│   │   ├── en.js
│   │   ├── index.js
│   │   └── ko.js
│   ├── utils/                 # 유틸리티 함수
│   │   └── cn.js
│   ├── App.jsx                # 메인 앱 컴포넌트
│   ├── index.css              # 글로벌 스타일
│   └── main.jsx               # 진입점
├── .env                       # 환경 변수 (git에 포함되지 않음)
├── .env.example               # 환경 변수 예시
├── CLAUDE.md                  # Claude Code 가이드
├── README.md                  # 프로젝트 문서
├── SETUP_GUIDE.md             # 배포 설정 가이드
├── upload-env-to-vercel.sh    # Vercel 환경 변수 업로드 스크립트
└── package.json
```

## 📱 주요 화면

### 홈 페이지
- 상품 그리드 레이아웃
- 카테고리별 필터링
- 신상품 뱃지 표시

### 상품 상세
- 큰 이미지 표시
- 상품 정보 및 가격
- 장바구니 추가 기능

### 장바구니
- 장바구니 아이템 목록
- 수량 조절 (증가/감소)
- 아이템 삭제
- 총 금액 계산
- 체크아웃으로 이동

### 체크아웃 (로그인 필요)
- 배송 정보 입력
- 토스페이먼츠 결제위젯
- 결제 수단 선택
- 주문 요약

### 결제 결과
- 성공: 결제 정보 및 주문 번호 표시
- 실패: 오류 메시지 및 재시도 옵션

## 🔒 보안 고려사항

### 현재 구현 상태
- ✅ Supabase RLS (Row Level Security) 활성화
- ✅ 사용자별 데이터 접근 제어
- ✅ 인증된 사용자만 체크아웃 가능
- ⚠️ **결제 승인 API가 클라이언트에서 호출됨 (보안 위험)**

### 배포 전 필수 작업
**결제 승인 API를 서버로 이동해야 합니다!**

현재 `PaymentSuccess.jsx`에서 클라이언트가 직접 시크릿 키를 사용하여 결제 승인 API를 호출하고 있습니다. 이는 **매우 위험한 보안 문제**입니다.

**해결 방법**:
1. **Supabase Edge Functions** 사용 (추천)
2. 별도 **백엔드 서버** 구축 (Node.js + Express)

자세한 내용은 [SETUP_GUIDE.md의 5번 섹션](./SETUP_GUIDE.md#5-결제-승인-서버-구축)을 참고하세요.

## 🛠️ 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# ESLint 실행
npm run lint
```

## 📊 데이터베이스 스키마

### cart_items
사용자별 장바구니 아이템 저장

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | 사용자 ID (FK) |
| product_id | INTEGER | 상품 ID |
| product_name | TEXT | 상품명 |
| product_price | NUMERIC | 상품 가격 |
| product_image | TEXT | 상품 이미지 URL |
| quantity | INTEGER | 수량 |
| created_at | TIMESTAMPTZ | 생성일시 |
| updated_at | TIMESTAMPTZ | 수정일시 |

### orders
주문 정보 저장

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | 사용자 ID (FK) |
| order_id | TEXT | 주문 번호 (UNIQUE) |
| payment_key | TEXT | 결제 키 |
| amount | NUMERIC | 결제 금액 |
| order_name | TEXT | 주문명 |
| customer_email | TEXT | 고객 이메일 |
| customer_name | TEXT | 고객 이름 |
| customer_mobile_phone | TEXT | 고객 전화번호 |
| status | TEXT | 주문 상태 (PENDING/PAID) |
| payment_method | TEXT | 결제 수단 |
| paid_at | TIMESTAMPTZ | 결제 완료 시각 |
| created_at | TIMESTAMPTZ | 생성일시 |
| updated_at | TIMESTAMPTZ | 수정일시 |

### products
상품 정보 저장

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT | Primary Key (Identity) |
| name_ko | TEXT | 상품명 (한글) |
| name_en | TEXT | 상품명 (영문) |
| price | INTEGER | 가격 |
| category_ko | TEXT | 카테고리 (한글) |
| category_en | TEXT | 카테고리 (영문) |
| image | TEXT | 이미지 경로/URL |
| description_ko | TEXT | 설명 (한글) |
| description_en | TEXT | 설명 (영문) |
| is_new | BOOLEAN | 신상품 여부 |
| created_at | TIMESTAMPTZ | 생성일시 |

### order_items
주문 상품 상세 정보

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| order_id | UUID | 주문 ID (FK) |
| product_id | INTEGER | 상품 ID |
| product_name | TEXT | 상품명 |
| quantity | INTEGER | 수량 |
| unit_price | NUMERIC | 단가 |
| created_at | TIMESTAMPTZ | 생성일시 |

## 🎨 스타일링

### Tailwind CSS v4
- PostCSS 플러그인 방식 사용
- 유틸리티 우선 접근 방식
- 커스텀 유틸리티: `cn()` 함수로 클래스 병합

### 반응형 디자인
- 모바일 우선 (Mobile-first)
- 브레이크포인트:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## 📦 배포

### Vercel (추천)

```bash
# Vercel CLI로 배포
npm install -g vercel
vercel --prod
```

또는 GitHub 연동으로 자동 배포

### Netlify

```bash
# Netlify CLI로 배포
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

자세한 배포 가이드는 [SETUP_GUIDE.md](./SETUP_GUIDE.md)를 참고하세요.

## 🐛 알려진 이슈 및 해결 예정

- [ ] 결제 승인 API를 서버로 이동 (보안 강화)
- [ ] 주문 내역 조회 페이지 추가
- [ ] 상품 검색 기능
- [ ] 관리자 페이지 (상품 관리)
- [ ] 이메일 알림 (주문 확인, 배송 안내)

## 📚 참고 문서

- [React 공식 문서](https://react.dev/)
- [Vite 문서](https://vitejs.dev/)
- [Supabase 문서](https://supabase.com/docs)
- [토스페이먼츠 문서](https://docs.tosspayments.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License.

## 👨‍💻 개발자

프로젝트 관련 문의: [GitHub Issues](https://github.com/your-username/shopping/issues)

---

## 🆕 최근 업데이트

- ✅ 다국어 지원 (한국어/영어)
- ✅ 상품 이미지 최적화 (public 폴더로 이동)
- ✅ Vercel 환경 변수 업로드 스크립트 추가
- ✅ 장바구니 추가 성공 모달
- ✅ 보호된 라우트 구현
- ✅ 브랜드명 오타 수정 (SOOMIN's KITCHEN)

**Last Updated**: 2025-01-22
