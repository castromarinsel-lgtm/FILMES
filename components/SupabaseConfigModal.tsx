'use client';

import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, Copy, ExternalLink, X, AlertCircle, Key, Link as LinkIcon, Code2 } from 'lucide-react';
import { getSupabaseCredentials, isSupabaseConfigured, saveCustomSupabaseCredentials } from '@/lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCredentialsUpdated: () => void;
}

export default function SupabaseConfigModal({
  isOpen,
  onClose,
  onCredentialsUpdated,
}: SupabaseConfigModalProps) {
  const [url, setUrl] = useState(() => getSupabaseCredentials().url);
  const [anonKey, setAnonKey] = useState(() => getSupabaseCredentials().anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomSupabaseCredentials(url, anonKey);
    setIsSaved(true);
    onCredentialsUpdated();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const sampleEnv = `NEXT_PUBLIC_SUPABASE_URL="${url || 'https://seu-projeto.supabase.co'}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${anonKey || 'sua-chave-anon-publica'}"`;

  const sampleSqlScript = `-- ==============================================================================
-- SCHEMA CINELUMINA PARA SUPABASE (Execute no Supabase: SQL Editor -> New Query)
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis visíveis para todos" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuários atualizam próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Usuários inserem próprio perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Filmes visíveis para todos" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Usuários inserem filmes" ON public.movies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários atualizam filmes" ON public.movies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários removem filmes" ON public.movies FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Recados visíveis para todos" ON public.guestbook_comments FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode deixar recado" ON public.guestbook_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Autor ou Dono remove recado" ON public.guestbook_comments FOR DELETE USING (auth.uid() = author_id OR auth.uid() = profile_user_id);`;

  const copySql = () => {
    navigator.clipboard.writeText(sampleSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const copyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-[#a855f7]/40 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden my-6">
        {/* Top Trim */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10b981] via-[#ddb7ff] to-[#f97316]" />

        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-cinema text-xl sm:text-2xl font-bold text-white">
                  Conexão com o Supabase
                </h2>
                {isConfigured ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-cinema bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Conectado
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-cinema bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Aguardando Chaves
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94a3b8]">
                Gerenciamento de Autenticação por E-mail e Banco de Dados PostgreSQL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick instructions banner */}
          <div className="p-4 rounded-xl bg-[#0b0f19] border border-white/[0.08] text-xs text-[#cbd5e1] space-y-2">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Key className="w-4 h-4 text-[#f97316]" />
              Onde encontrar suas variáveis no Supabase:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[#94a3b8]">
              <li>Acesse seu painel no <strong>Supabase (supabase.com)</strong>.</li>
              <li>Vá em <strong>Project Settings &gt; API</strong>.</li>
              <li>Copie a <strong>Project URL</strong> e a <strong>anon / public key</strong>.</li>
            </ol>
          </div>

          {/* Form to insert/update variables */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-[#10b981]" />
                1. NEXT_PUBLIC_SUPABASE_URL
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-xs font-mono-cinema focus:outline-none focus:border-[#10b981] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#f97316]" />
                2. NEXT_PUBLIC_SUPABASE_ANON_KEY
              </label>
              <textarea
                rows={2}
                required
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-xs font-mono-cinema focus:outline-none focus:border-[#10b981] transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={copyEnv}
                className="inline-flex items-center gap-1.5 text-xs text-[#ddb7ff] hover:text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedEnv ? 'Copiado para .env!' : 'Copiar formato para .env.local'}</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-xs font-semibold tracking-wide shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Salvo com Sucesso!</span>
                  </>
                ) : (
                  <span>Salvar Chaves no Aplicativo</span>
                )}
              </button>
            </div>
          </form>

          {/* SQL Setup Script Box */}
          <div className="pt-4 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-mono-cinema text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-[#ddb7ff]" />
                  Script SQL para Criar as Tabelas no Supabase
                </h4>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  Execute no menu <strong>SQL Editor</strong> do Supabase para criar as tabelas <code className="text-white">profiles</code>, <code className="text-white">movies</code> e <code className="text-white">guestbook_comments</code>.
                </p>
              </div>

              <button
                type="button"
                onClick={copySql}
                className="px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#a855f7]/20 text-[#ddb7ff] border border-white/10 hover:border-[#a855f7]/40 text-xs font-mono-cinema transition-all flex items-center gap-1.5 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSql ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>

            <div className="relative max-h-40 overflow-y-auto bg-[#0a0e18] p-3 rounded-xl border border-white/[0.08] text-[10px] font-mono-cinema text-[#94a3b8] leading-relaxed">
              <pre className="whitespace-pre-wrap">{sampleSqlScript}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
