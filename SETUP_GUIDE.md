# 배포 설정 가이드

이 문서는 쇼핑몰 애플리케이션을 배포하기 위한 상세한 설정 가이드입니다.

## 목차
- [1. 사전 준비사항](#1-사전-준비사항)
- [2. Supabase 설정](#2-supabase-설정)
- [3. 토스페이먼츠 설정](#3-토스페이먼츠-설정)
- [4. 환경 변수 설정](#4-환경-변수-설정)
- [5. 결제 승인 서버 구축](#5-결제-승인-서버-구축)
- [6. 배포](#6-배포)
- [7. 보안 체크리스트](#7-보안-체크리스트)

---

## 1. 사전 준비사항

### 필요한 계정
- [ ] Supabase 계정 (https://supabase.com/)
- [ ] 토스페이먼츠 개발자 계정 (https://developers.tosspayments.com/)
- [ ] Vercel/Netlify 계정 (배포용, 선택사항)

### 로컬 개발 환경
- Node.js 20.19+ 또는 22.12+
- npm 또는 yarn
- Git

---

## 2. Supabase 설정

### 2.1. 프로젝트 생성

1. https://supabase.com/ 접속 후 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: shopping-app (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 생성 및 저장
   - **Region**: Northeast Asia (Seoul) 선택
4. "Create new project" 클릭하고 완료될 때까지 대기 (약 2-3분)

> **참고**: Supabase를 설정하지 않아도 애플리케이션은 `src/data/products.js`의 로컬 데이터를 사용하여 실행됩니다. 하지만 인증, 장바구니 동기화, 결제 기능은 제한될 수 있습니다.

### 2.2. API 키 확인

1. 프로젝트 대시보드에서 "Settings" → "API" 메뉴 선택
2. 다음 정보를 복사해 두세요:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (매우 긴 문자열)

### 2.3. 데이터베이스 마이그레이션

#### 방법 1: SQL Editor 사용 (추천)

1. Supabase 대시보드에서 "SQL Editor" 메뉴 선택
2. "New Query" 클릭
3. 아래 SQL을 순서대로 실행:

```sql
-- 1. 장바구니 테이블
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    product_price NUMERIC(10, 2) NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items" ON public.cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON public.cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON public.cart_items
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON public.cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- 2. 주문 테이블
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_id TEXT UNIQUE NOT NULL,
    payment_key TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    order_name TEXT NOT NULL,
    customer_email TEXT,
    customer_name TEXT,
    customer_mobile_phone TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    payment_method TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_order_id ON public.orders(order_id);
CREATE INDEX idx_orders_status ON public.orders(status);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- 3. 주문 상품 테이블
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
        )
    );

CREATE POLICY "Users can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
        )
    );

-- 4. 트리거 함수
CREATE OR REPLACE FUNCTION update_cart_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cart_items_updated_at_trigger
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_cart_items_updated_at();

CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at_trigger
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

-- 5. 상품 테이블
create table if not exists products (
  id bigint primary key generated always as identity,
  name_ko text not null,
  name_en text not null,
  price integer not null,
  category_ko text not null,
  category_en text not null,
  image text not null,
  description_ko text not null,
  description_en text not null,
  is_new boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;

create policy "Allow public read access"
  on products
  for select
  to public
  using (true);
```

4. "Run" 버튼 클릭하여 실행
5. `supabase_migration.sql` 파일의 `insert into products ...` 부분을 복사하여 실행 (초기 데이터 입력)

#### 방법 2: Supabase CLI 사용

```bash
# Supabase CLI 설치 (처음만)
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

### 2.4. 이메일 인증 설정 (선택사항)

1. "Authentication" → "Providers" → "Email" 선택
2. "Confirm email" 토글 활성화 (회원가입 시 이메일 인증 필요)
3. "Email Templates"에서 이메일 템플릿 커스터마이징 가능

---

## 3. 토스페이먼츠 설정

### 3.1. 개발자센터 가입

1. https://developers.tosspayments.com/ 접속
2. "회원가입" 클릭하여 계정 생성
3. 이메일 인증 완료

### 3.2. 테스트 API 키 발급

1. 개발자센터 로그인
2. 좌측 메뉴에서 **"API 키"** 선택
3. **"결제위젯 연동 키"** 탭 클릭
4. 다음 키들을 복사해 두세요:
   - **클라이언트 키**: `test_gck_...`로 시작
   - **시크릿 키**: `test_gsk_...`로 시작

⚠️ **중요**:
- 시크릿 키는 절대 클라이언트 코드에 노출되면 안 됩니다
- 반드시 서버에서만 사용해야 합니다

### 3.3. 실제 결제 사용 시 (프로덕션)

1. 토스페이먼츠 고객센터(1544-7772)로 전자결제 계약 문의
2. 계약 완료 후 라이브 API 키 발급
3. 라이브 키는 `live_gck_...`, `live_gsk_...`로 시작

---

## 4. 환경 변수 설정

### 4.1. .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 입력하세요:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Tosspayments Configuration (테스트 환경)
VITE_TOSS_CLIENT_KEY=test_gck_your_client_key_here
VITE_TOSS_SECRET_KEY=test_gsk_your_secret_key_here
```

### 4.2. 프로덕션 환경 변수

배포 플랫폼(Vercel, Netlify 등)에서 환경 변수를 설정하세요:

**Vercel 예시:**
1. 프로젝트 설정 → "Environment Variables" 메뉴
2. 위의 4개 변수를 추가
3. "Production", "Preview", "Development" 환경 선택

**Netlify 예시:**
1. Site settings → "Build & deploy" → "Environment"
2. "Add variable" 클릭하여 변수 추가

---

## 5. 결제 승인 서버 구축

### 🔴 중요: 보안 문제

현재 코드는 **클라이언트에서 시크릿 키를 직접 사용**하고 있어 **매우 위험**합니다.

### 5.1. Supabase Edge Function 사용 (추천)

#### Step 1: Supabase CLI 설치 및 로그인

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
```

#### Step 2: Edge Function 생성

```bash
supabase functions new confirm-payment
```

#### Step 3: 함수 코드 작성

`supabase/functions/confirm-payment/index.ts` 파일을 다음과 같이 작성:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { paymentKey, orderId, amount } = await req.json()

    // 토스페이먼츠 결제 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(Deno.env.get('TOSS_SECRET_KEY') + ':')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentKey, orderId, amount })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '결제 승인에 실패했습니다.')
    }

    const paymentData = await response.json()

    // Supabase 클라이언트 생성
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 주문 상태 업데이트
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        payment_key: paymentKey,
        status: 'PAID',
        payment_method: paymentData.method,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify(paymentData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
```

#### Step 4: Secrets 설정

```bash
supabase secrets set TOSS_SECRET_KEY=test_gsk_your_secret_key_here
```

#### Step 5: 함수 배포

```bash
supabase functions deploy confirm-payment
```

#### Step 6: 클라이언트 코드 수정

`src/pages/PaymentSuccess.jsx` 파일에서 API 호출 부분을 수정:

```javascript
// 기존 코드 (보안 위험)
const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
        'Authorization': `Basic ${btoa(import.meta.env.VITE_TOSS_SECRET_KEY + ':')}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ paymentKey, orderId, amount: parseInt(amount) })
});

// 새 코드 (안전)
const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confirm-payment`,
    {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount)
        })
    }
);
```

### 5.2. 대안: 별도 백엔드 서버 (Node.js + Express)

Edge Function을 사용하지 않는다면 별도 서버가 필요합니다.

```bash
# 서버 프로젝트 생성
mkdir payment-server
cd payment-server
npm init -y
npm install express cors dotenv @supabase/supabase-js

# server.js 생성
```

---

## 6. 배포

### 6.1. Vercel 배포 (추천)

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

또는 GitHub 연동:
1. GitHub에 코드 푸시
2. https://vercel.com 에서 "Import Project"
3. 자동 배포 설정

### 6.2. Netlify 배포

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 빌드
npm run build

# 배포
netlify deploy --prod --dir=dist
```

### 6.3. 빌드 확인

배포 전에 로컬에서 빌드가 정상적으로 되는지 확인:

```bash
npm run build
npm run preview
```

---

## 7. 보안 체크리스트

배포 전 반드시 확인:

- [ ] **.env 파일이 .gitignore에 포함되어 있는지 확인**
- [ ] **시크릿 키가 클라이언트 코드에 노출되지 않는지 확인**
- [ ] **Supabase RLS (Row Level Security) 정책이 활성화되어 있는지 확인**
- [ ] **결제 승인 API가 서버에서만 호출되는지 확인**
- [ ] **프로덕션 환경에서는 라이브 API 키를 사용하는지 확인**
- [ ] **CORS 설정이 올바른지 확인** (Edge Function 사용 시)
- [ ] **모든 환경 변수가 배포 플랫폼에 설정되어 있는지 확인**

---

## 8. 트러블슈팅

### 문제 1: CORS 오류
**증상**: 브라우저 콘솔에 CORS 관련 에러 메시지

**해결**:
- Edge Function에서 CORS 헤더가 제대로 설정되어 있는지 확인
- OPTIONS 메서드 처리가 되어 있는지 확인

### 문제 2: 결제 승인 실패
**증상**: "결제 승인에 실패했습니다" 메시지

**해결**:
1. 토스페이먼츠 시크릿 키가 올바른지 확인
2. Base64 인코딩이 제대로 되었는지 확인 (`:` 포함)
3. 결제 요청과 승인의 금액이 일치하는지 확인

### 문제 3: Supabase 연결 오류
**증상**: 데이터베이스 연결 실패

**해결**:
1. VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY 확인
2. Supabase 프로젝트가 활성화되어 있는지 확인
3. RLS 정책이 너무 제한적이지 않은지 확인

### 문제 4: 장바구니가 동기화되지 않음
**증상**: 로그인 후 장바구니가 비어있음

**해결**:
1. cart_items 테이블이 생성되었는지 확인
2. RLS 정책이 활성화되어 있는지 확인
3. user_id가 올바르게 저장되는지 확인

---

## 9. 성능 최적화 (선택사항)

### 이미지 최적화
- Unsplash 이미지 URL에 `?auto=format&fit=crop&w=800&q=80` 파라미터 사용
- 프로덕션에서는 CDN 사용 고려

### 빌드 최적화
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          tosspayments: ['@tosspayments/tosspayments-sdk']
        }
      }
    }
  }
}
```

---

## 지원

문제가 발생하거나 질문이 있으시면:
- Supabase: https://supabase.com/docs
- 토스페이먼츠: https://docs.tosspayments.com/
- 프로젝트 이슈: [GitHub Issues]

---

**마지막 업데이트**: 2025-11-22
