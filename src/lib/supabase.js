import { createClient } from '@supabase/supabase-js'

// Supabase 프로젝트 URL과 anon key를 환경 변수로 설정해야 합니다
// .env 파일에 다음 변수들을 추가하세요:
// VITE_SUPABASE_URL=your-project-url
// VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
