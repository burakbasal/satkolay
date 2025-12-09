-- 2. GÜVENLİ ADMIN KONTROLÜ (Döngüyü Kıran Fonksiyon)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Security Definer sayesinde RLS'ye takılmadan kontrol eder
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. YENİ VE TEMİZ KURALLAR
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Okuma: Herkes görebilir (Vitrin bozulmasın diye)
CREATE POLICY "Allow Public Read" ON profiles
FOR SELECT USING (true);

-- Ekleme: Kullanıcı sadece kendine ekleyebilir
CREATE POLICY "Allow Self Insert" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Güncelleme: Kişi kendisi VEYA Admin
CREATE POLICY "Allow Update Own or Admin" ON profiles
FOR UPDATE USING (auth.uid() = id OR is_admin());

-- Silme: Sadece Admin
CREATE POLICY "Allow Delete Admin" ON profiles
FOR DELETE USING (is_admin());

-- 2. İLAN TABLOSU KİLİDİNİ AÇ
ALTER TABLE items DISABLE ROW LEVEL SECURITY;

-- 3. MESAJ TABLOSU KİLİDİNİ AÇ
ALTER TABLE direct_messages DISABLE ROW LEVEL SECURITY;

-- 2. SENİ ADMIN YAP (Garanti)
UPDATE profiles SET is_admin = true WHERE email = 'dev.burakbsl@gmail.com';

-- 3. EKSİK PROFİLLERİ DOLDUR (Eğer tablo boşsa diye)
INSERT INTO public.profiles (id, email, username, full_name, avatar_url)
SELECT id, email, split_part(email, '@', 1), 'Kullanıcı', ''
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT DO NOTHING;
