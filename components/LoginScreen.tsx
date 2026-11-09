'use client';

import React, { useState } from 'react';
import {
  Clapperboard,
  Sparkles,
  Film,
  UserPlus,
  LogIn,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  MessageSquare,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
} from 'lucide-react';
import { UserProfile } from '@/types/cinema';
import { isSupabaseConfigured } from '@/lib/supabase';
import { loginWithSupabase, registerWithSupabase } from '@/lib/supabase-service';

interface LoginScreenProps {
  allUsers: UserProfile[];
  onEnterAsGuest: (guestName: string) => void;
  onLoginUser: (user: UserProfile) => void;
  onRegisterUser: (newUser: UserProfile) => void;
  onOpenSupabaseConfig?: () => void;
}

export default function LoginScreen({
  allUsers,
  onEnterAsGuest,
  onLoginUser,
  onRegisterUser,
  onOpenSupabaseConfig,
}: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'visitor'>('login');

  // Visitor mode state
  const [guestName, setGuestName] = useState('Cinéfilo Visitante');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regHandle, setRegHandle] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regGenre, setRegGenre] = useState('Ficção Científica');
  const [regAvatar, setRegAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const supabaseConfigured = isSupabaseConfigured();

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  ];

  const handleVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnterAsGuest(guestName.trim() || 'Cinéfilo Visitante');
  };

  // Login via Supabase Email & Password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Por favor informe e-mail e senha.');
      return;
    }

    // Se o Supabase estiver configurado, executa autenticação real com o Supabase
    if (supabaseConfigured) {
      setIsLoadingLogin(true);
      try {
        const { user, error } = await loginWithSupabase(loginEmail.trim(), loginPassword.trim());
        setIsLoadingLogin(false);

        if (error || !user) {
          setLoginError(error || 'Falha ao autenticar no Supabase.');
          return;
        }

        onLoginUser(user);
        return;
      } catch (err: any) {
        setIsLoadingLogin(false);
        setLoginError(err.message || 'Erro inesperado ao conectar com o Supabase.');
        return;
      }
    }

    // Fallback: Login local com perfis cadastrados se o Supabase ainda não tiver as chaves
    const query = loginEmail.trim().toLowerCase().replace('@', '');
    const found = allUsers.find(
      (u) =>
        u.handle.toLowerCase() === query ||
        u.name.toLowerCase() === query ||
        (u.email && u.email.toLowerCase() === query)
    );

    if (found) {
      onLoginUser(found);
    } else {
      setLoginError(
        'Para login com senha em nuvem, configure suas chaves do Supabase ou selecione um dos perfis demo abaixo.'
      );
    }
  };

  // Cadastro via Supabase Email & Password
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Preencha nome, e-mail e senha para continuar.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    const cleanHandle = (regHandle || regName.toLowerCase().replace(/\s+/g, '_')).replace(/[^a-zA-Z0-9_]/g, '');

    // Se o Supabase estiver configurado, cria o usuário diretamente no Supabase Auth + Tabela Profiles
    if (supabaseConfigured) {
      setIsLoadingRegister(true);
      try {
        const { user, error } = await registerWithSupabase(
          regEmail.trim(),
          regPassword.trim(),
          {
            name: regName.trim(),
            handle: cleanHandle,
            bio: regBio.trim() || 'Amante da sétima arte.',
            favoriteGenres: [regGenre, 'Drama'],
            avatar: regAvatar,
          }
        );
        setIsLoadingRegister(false);

        if (error || !user) {
          setRegError(error || 'Falha ao cadastrar usuário no Supabase.');
          return;
        }

        setRegSuccess('Conta criada com sucesso no Supabase! Entrando...');
        setTimeout(() => {
          onRegisterUser(user);
        }, 800);
        return;
      } catch (err: any) {
        setIsLoadingRegister(false);
        setRegError(err.message || 'Erro ao conectar ao Supabase.');
        return;
      }
    }

    // Fallback: Cadastro local se o Supabase não estiver configurado
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      handle: cleanHandle,
      email: regEmail.trim(),
      avatar: regAvatar,
      bannerUrl:
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
      bio: regBio.trim() || 'Apaixonado por cinema clássico, sci-fi e narrativas que desafiam a imaginação.',
      favoriteGenres: [regGenre, 'Drama', 'Cinema Autoral'],
      location: 'Brasil',
      joinedDate: 'Hoje',
      followersCount: 0,
      followingCount: 2,
      movies: [],
      guestbook: [],
    };

    onRegisterUser(newUser);
  };

  return (
    <div className="min-h-screen relative bg-[#0b0f19] flex flex-col justify-between overflow-hidden">
      {/* Dynamic Theater Atmospheric Lighting Flares */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-[#a855f7]/20 via-[#f43f5e]/10 to-transparent pointer-events-none blur-3xl z-0" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#a855f7]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#f97316]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#f43f5e] p-[1.5px] shadow-[0_0_25px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full bg-[#0f131d] rounded-[10px] flex items-center justify-center">
              <Clapperboard className="w-5 h-5 text-[#ddb7ff]" />
            </div>
          </div>
          <div>
            <span className="font-serif-cinema text-2xl font-bold tracking-wider text-white">
              CINE<span className="text-[#f97316]">LUMINA</span>
            </span>
            <span className="ml-2 px-1.5 py-0.5 text-[10px] font-mono-cinema font-bold tracking-widest uppercase bg-[#1e293b] text-[#ddb7ff] rounded border border-[#a855f7]/30">
              Social Cinema
            </span>
          </div>
        </div>

        {/* Supabase Status Chip & Quick Trigger */}
        <div className="flex items-center gap-2.5">
          {onOpenSupabaseConfig && (
            <button
              onClick={onOpenSupabaseConfig}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono-cinema transition-all ${
                supabaseConfigured
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-[#1e293b] text-[#ddb7ff] border border-[#a855f7]/40 hover:bg-[#a855f7]/20 shadow-md'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="hidden sm:inline">
                {supabaseConfigured ? 'Supabase Conectado' : 'Conectar Supabase'}
              </span>
              <span className="sm:hidden">Supabase</span>
            </button>
          )}

          <button
            onClick={() => onEnterAsGuest('Visitante Convidado')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1e293b]/70 hover:bg-[#1e293b] text-xs font-medium text-[#ddb7ff] border border-[#a855f7]/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
            <span>Modo Visitante</span>
          </button>
        </div>
      </header>

      {/* Main Center Login & Onboarding Portal */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
        {/* Left Column: Brand Pitch & Highlights */}
        <div className="flex-1 space-y-6 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#a855f7]/40 text-[#ddb7ff] text-xs font-mono-cinema tracking-widest uppercase shadow-lg">
            <Film className="w-3.5 h-3.5 text-[#f97316]" />
            <span>Rede Social de Cinema com Supabase</span>
          </div>

          <h1 className="font-serif-cinema text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.15]">
            Onde cinéfilos compartilham suas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ddb7ff] via-[#ffb2b7] to-[#f97316]">obras-primas</span>.
          </h1>

          <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
            Cadastre-se com seu e-mail, monte sua estante de filmes prediletos, navegue pelas páginas pessoais de outros cinéfilos e deixe recados sobre as melhores obras.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-left">
            <div className="p-3.5 rounded-2xl bg-[#111827]/70 border border-white/[0.08] backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-[#a855f7]/20 flex items-center justify-center text-[#ddb7ff] mb-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-xs font-bold text-white">Cadastre Favoritos</p>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                Cartazes, notas, citações e formatos (IMAX, 4K HDR).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#111827]/70 border border-white/[0.08] backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-[#f43f5e]/20 flex items-center justify-center text-[#f43f5e] mb-2">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Visite Páginas Pessoais</p>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                Explore o gosto refinado de outros cinéfilos da comunidade.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#111827]/70 border border-white/[0.08] backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-[#f97316]/20 flex items-center justify-center text-[#f97316] mb-2">
                <MessageSquare className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Mural de Recados</p>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                Deixe frases, palavras ou debates sobre os filmes visitados.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login / Register Card */}
        <div className="w-full max-w-md">
          <div className="relative rounded-3xl bg-[#111827]/95 border border-[#a855f7]/35 shadow-[0_0_60px_rgba(168,85,247,0.25)] backdrop-blur-xl overflow-hidden">
            {/* Top Glowing Trim */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#10b981] via-[#ddb7ff] to-[#f97316]" />

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 p-2 bg-[#0b0f19]/70 border-b border-white/[0.08] text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`py-2.5 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-[#a855f7]/20 text-[#ddb7ff] border border-[#a855f7]/30 font-bold shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`py-2.5 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-[#a855f7]/20 text-[#ddb7ff] border border-[#a855f7]/30 font-bold shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Cadastrar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('visitor')}
                className={`py-2.5 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'visitor'
                    ? 'bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30 font-bold shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Visitante</span>
              </button>
            </div>

            {/* TAB 1: ENTRAR COM E-MAIL (SUPABASE AUTH) */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="p-6 sm:p-7 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif-cinema text-2xl font-bold text-white">
                      Login de Cinéfilo
                    </h2>
                    {supabaseConfigured && (
                      <span className="text-[10px] font-mono-cinema text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Supabase Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#94a3b8]">
                    Entre com seu e-mail cadastrado no Supabase ou use um perfil demo:
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-[#ffb4ab] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#ddb7ff]" />
                    E-mail ou @Handle *
                  </label>
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com ou lucasfilmico"
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#f43f5e]" />
                    Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoadingLogin}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoadingLogin ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Autenticando no Supabase...</span>
                    </>
                  ) : (
                    <span>Entrar na Minha Conta</span>
                  )}
                </button>

                {/* Quick 1-Click Demo Profiles */}
                <div className="pt-2 border-t border-white/[0.08]">
                  <p className="text-[11px] font-mono-cinema text-[#94a3b8] uppercase tracking-wider mb-2">
                    Acesso rápido com membros demonstrativos:
                  </p>
                  <div className="space-y-1.5">
                    {allUsers.slice(0, 3).map((user) => (
                      <div
                        key={user.id}
                        onClick={() => onLoginUser(user)}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#0b0f19]/70 hover:bg-[#1e293b] border border-white/[0.06] cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover border border-[#ddb7ff]/30"
                          />
                          <div>
                            <p className="text-xs font-semibold text-white group-hover:text-[#ddb7ff] transition-colors leading-none">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-[#94a3b8] font-mono-cinema">
                              @{user.handle} • {user.movies.length} filmes
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: CADASTRO COM E-MAIL (SUPABASE AUTH) */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-7 space-y-3.5">
                <div className="space-y-1">
                  <h2 className="font-serif-cinema text-2xl font-bold text-white">
                    Novo Cadastro de Usuário
                  </h2>
                  <p className="text-xs text-[#94a3b8]">
                    Crie sua conta com e-mail para salvar filmes e interagir no mural.
                  </p>
                </div>

                {regError && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-[#ffb4ab] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1">
                      Nome de Cinéfilo *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ex: Mariana Silva"
                      className="w-full px-3.5 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-xs focus:outline-none focus:border-[#a855f7] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1">
                      @Identificador (Handle)
                    </label>
                    <input
                      type="text"
                      value={regHandle}
                      onChange={(e) => setRegHandle(e.target.value)}
                      placeholder="mariana_cinema"
                      className="w-full px-3.5 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-xs focus:outline-none focus:border-[#a855f7] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#10b981]" />
                    E-mail para Cadastro *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-3.5 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-xs focus:outline-none focus:border-[#a855f7] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#f43f5e]" />
                      Senha (mín. 6) *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-xs focus:outline-none focus:border-[#a855f7] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1">
                      Gênero Favorito
                    </label>
                    <select
                      value={regGenre}
                      onChange={(e) => setRegGenre(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-xs focus:outline-none focus:border-[#a855f7] transition-all"
                    >
                      <option value="Ficção Científica">Ficção Científica</option>
                      <option value="Drama">Drama</option>
                      <option value="Suspense">Suspense</option>
                      <option value="Crime">Crime</option>
                      <option value="Cinema Nacional">Cinema Nacional</option>
                      <option value="Terror">Terror</option>
                      <option value="Animação">Animação</option>
                      <option value="Clássicos">Clássicos</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1">
                    Biografia Cinematográfica
                  </label>
                  <textarea
                    rows={2}
                    value={regBio}
                    onChange={(e) => setRegBio(e.target.value)}
                    placeholder="Conte sobre seus diretores preferidos ou estilo de cinema..."
                    className="w-full px-3.5 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-xs focus:outline-none focus:border-[#a855f7] transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1">
                    Escolha seu Avatar
                  </label>
                  <div className="flex items-center gap-2.5">
                    {avatarOptions.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRegAvatar(url)}
                        className={`relative rounded-full p-0.5 transition-all ${
                          regAvatar === url
                            ? 'ring-2 ring-[#a855f7] scale-105'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingRegister}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoadingRegister ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Cadastrando no Supabase...</span>
                    </>
                  ) : (
                    <span>Cadastrar Conta & Entrar</span>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: ACESSO DE VISITANTE */}
            {activeTab === 'visitor' && (
              <form onSubmit={handleVisitorSubmit} className="p-6 sm:p-7 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-cinema text-[#f97316] uppercase font-bold tracking-wider">
                      Acesso Imediato
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#f97316]/20 text-[#f97316] font-mono-cinema">
                      Sem Senha
                    </span>
                  </div>
                  <h2 className="font-serif-cinema text-2xl font-bold text-white">
                    Entrar como Visitante
                  </h2>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    Comece a explorar agora mesmo! Você poderá cadastrar seus filmes favoritos, navegar pelos perfis dos membros e deixar comentários nos murais de visita.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-2">
                    Como gostaria de ser chamado na rede?
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ex: Visitante Apaixonado por Cinema"
                    className="w-full px-4 py-3 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-all"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#0b0f19]/60 border border-white/[0.06] flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-[11px] text-[#cbd5e1] leading-tight">
                    Você pode experimentar todas as telas livremente antes de criar sua conta oficial com e-mail.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white text-sm font-semibold tracking-wide shadow-[0_0_25px_rgba(249,115,22,0.45)] hover:shadow-[0_0_35px_rgba(249,115,22,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-t border-white/25"
                >
                  <span>Entrar Imediatamente como Visitante</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-[#64748b]">
        CineLumina • O ponto de encontro dos apaixonados por cinema • Conexão com Supabase PostgreSQL
      </footer>
    </div>
  );
}
