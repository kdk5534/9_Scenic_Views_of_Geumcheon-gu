-- ============================================================
-- 금천 9경 가이드 · 초기 스키마
-- Supabase SQL Editor에서 실행하거나 supabase db push 사용
-- ============================================================

-- 프로필 (auth.users 확장)
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username   TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view profiles"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 트리거: 신규 가입 시 profiles 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 즐겨찾기 (클라우드 동기화)
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id    INT NOT NULL CHECK (spot_id BETWEEN 1 AND 9),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, spot_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON public.favorites USING (auth.uid() = user_id);

-- 도장 (클라우드 동기화)
CREATE TABLE IF NOT EXISTS public.stamps (
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id    INT NOT NULL CHECK (spot_id BETWEEN 1 AND 9),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, spot_id)
);
ALTER TABLE public.stamps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own stamps" ON public.stamps USING (auth.uid() = user_id);

-- 리뷰
CREATE TABLE IF NOT EXISTS public.reviews (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id    INT NOT NULL CHECK (spot_id BETWEEN 1 AND 9),
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT CHECK (char_length(comment) <= 300),
  approved   BOOLEAN DEFAULT FALSE,
  reported   BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone sees approved reviews" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Users insert own review"      ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own review"      ON public.reviews FOR DELETE USING (auth.uid() = user_id);
-- 관리자 정책 (service role key 사용 시 자동 우회)

-- 신고
CREATE TABLE IF NOT EXISTS public.reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id   UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (review_id, reporter_id)
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own report" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- 명소별 평균 별점 뷰
CREATE OR REPLACE VIEW public.spot_ratings AS
SELECT spot_id,
       ROUND(AVG(rating)::NUMERIC, 1) AS avg_rating,
       COUNT(*) AS review_count
FROM public.reviews
WHERE approved = true
GROUP BY spot_id;
