-- ==============================================================================
-- SCHEMA DO CINELUMINA PARA O SUPABASE (PostgreSQL)
-- Copie e cole este script no menu: Supabase Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. Habilitar extensão de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Perfis de Usuários (Integrada com o Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  email TEXT,
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  banner_url TEXT DEFAULT 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
  bio TEXT DEFAULT 'Amante da sétima arte.',
  favorite_genres TEXT[] DEFAULT ARRAY['Ficção Científica', 'Drama'],
  location TEXT DEFAULT 'Brasil',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Filmes Favoritos Cadastrados
CREATE TABLE IF NOT EXISTS public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  director TEXT NOT NULL,
  year INTEGER NOT NULL,
  genre TEXT NOT NULL,
  rating NUMERIC(3, 1) NOT NULL DEFAULT 10.0,
  poster_url TEXT NOT NULL,
  backdrop_url TEXT,
  personal_review TEXT,
  format_badge TEXT DEFAULT '4K HDR',
  favorite_quote TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Mural de Recados & Visitas (Guestbook)
CREATE TABLE IF NOT EXISTS public.guestbook_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  author_badge TEXT DEFAULT 'Cinéfilo Membro',
  content TEXT NOT NULL,
  related_movie_title TEXT,
  likes_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- SEGURANÇA E POLÍTICAS DE ACESSO (Row Level Security - RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook_comments ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
CREATE POLICY "Perfis visíveis para todos" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para Filmes Favoritos
CREATE POLICY "Filmes visíveis para todos" 
  ON public.movies FOR SELECT USING (true);

CREATE POLICY "Usuários podem cadastrar filmes em sua estante" 
  ON public.movies FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios filmes" 
  ON public.movies FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover seus próprios filmes" 
  ON public.movies FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Mural de Recados
CREATE POLICY "Recados visíveis para todos" 
  ON public.guestbook_comments FOR SELECT USING (true);

CREATE POLICY "Qualquer visitante ou membro pode deixar um recado" 
  ON public.guestbook_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Autor ou Dono do Perfil podem excluir o recado" 
  ON public.guestbook_comments FOR DELETE 
  USING (auth.uid() = author_id OR auth.uid() = profile_user_id);

-- ==============================================================================
-- GATILHO AUTOMÁTICO: Cria o perfil automaticamente no cadastro de novo e-mail
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, handle, email, bio, favorite_genres, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'handle', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'bio', 'Novo cinéfilo no CineLumina.'),
    ARRAY['Ficção Científica', 'Drama'],
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
