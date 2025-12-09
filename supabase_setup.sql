-- 1. Reviews Tablosunu Oluştur
create table public.reviews (
  id uuid not null default gen_random_uuid (),
  reviewer_id uuid not null references auth.users (id) on delete cascade, -- Puanı veren
  reviewee_id uuid not null references profiles (id) on delete cascade,   -- Puanı alan
  rating integer not null check (rating >= 1 and rating <= 5),            -- 1-5 arası puan
  comment text null,
  created_at timestamp with time zone not null default now(),
  
  -- Herkes bir kişiye sadece 1 kere puan verebilsin (Tekrar verirse güncellesin)
  constraint reviews_pkey primary key (id),
  constraint unique_review unique (reviewer_id, reviewee_id)
);

-- 2. Güvenlik Politikaları (RLS)
alter table public.reviews enable row level security;

-- Herkes yorumları okuyabilir
create policy "Reviews are viewable by everyone" 
on public.reviews for select 
using ( true );

-- Sadece giriş yapanlar puan verebilir
create policy "Authenticated users can insert reviews" 
on public.reviews for insert 
with check ( auth.uid() = reviewer_id );

-- Kişi sadece kendi verdiği puanı düzenleyebilir
create policy "Users can update their own reviews" 
on public.reviews for update 
using ( auth.uid() = reviewer_id );

-- 3. Profil Tablosuna Ortalama Puan Sütunu Ekleyelim (Performans İçin)
-- (Eğer yoksa ekler, varsa hata vermez)
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'avg_rating') then
    alter table public.profiles add column avg_rating numeric(3, 2) default 0;
  end if;
end $$;
