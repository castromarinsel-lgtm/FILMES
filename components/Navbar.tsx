'use client';

import React from 'react';
import { Film, Clapperboard, Plus, User, Users, Compass, LogIn, LogOut, Sparkles } from 'lucide-react';
import { UserProfile, ActiveView } from '@/types/cinema';

interface NavbarProps {
  currentUser: UserProfile;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenAddMovie: () => void;
  onOpenAuth: () => void;
  onViewMyProfile: () => void;
  onReturnToLogin?: () => void;
}

export default function Navbar({
  currentUser,
  activeView,
  setActiveView,
  onOpenAddMovie,
  onOpenAuth,
  onViewMyProfile,
  onReturnToLogin,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0f19]/85 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('feed')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#f43f5e] p-[1.5px] shadow-[0_0_20px_rgba(168,85,247,0.35)] group-hover:shadow-[0_0_28px_rgba(244,63,94,0.5)] transition-all duration-300">
            <div className="w-full h-full bg-[#0f131d] rounded-[10px] flex items-center justify-center">
              <Clapperboard className="w-5 h-5 text-[#ddb7ff] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-cinema text-2xl font-bold tracking-wider text-white group-hover:text-[#ddb7ff] transition-colors">
                CINE<span className="text-[#f97316]">LUMINA</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono-cinema font-semibold tracking-widest uppercase bg-[#1e293b] text-[#ddb7ff] rounded border border-[#a855f7]/30">
                Social
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] tracking-wide hidden sm:block">
              Rede Social para Amantes de Cinema
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#111827]/80 p-1.5 rounded-full border border-white/[0.08] shadow-inner">
          <button
            onClick={() => setActiveView('feed')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeView === 'feed'
                ? 'bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Feed Social</span>
          </button>

          <button
            onClick={() => setActiveView('community')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeView === 'community'
                ? 'bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Explorar Cinéfilos</span>
          </button>

          <button
            onClick={onViewMyProfile}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeView === 'profile'
                ? 'bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Meu Perfil</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cadastrar Filme Button */}
          <button
            onClick={onOpenAddMovie}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:shadow-[0_0_28px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-t border-white/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Cadastrar Filme</span>
            <span className="sm:hidden">Filme</span>
          </button>

          {/* User profile pill & Auth trigger */}
          <div className="flex items-center gap-1.5 pl-1 sm:pl-2">
            <button
              onClick={onOpenAuth}
              title="Alternar usuário ou perfil"
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#111827] hover:bg-[#1e293b] border border-white/[0.1] hover:border-[#a855f7]/40 transition-all text-left group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#ddb7ff]/40 ring-2 ring-black"
              />
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-white group-hover:text-[#ddb7ff] transition-colors leading-tight line-clamp-1">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-[#94a3b8] font-mono-cinema">
                  @{currentUser.handle} {currentUser.isGuest ? '• Visitante' : ''}
                </p>
              </div>
              <LogIn className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-[#ddb7ff] transition-colors ml-0.5 sm:ml-1" />
            </button>

            {onReturnToLogin && (
              <button
                onClick={onReturnToLogin}
                title="Sair / Tela Inicial de Login"
                className="p-2 rounded-full text-[#94a3b8] hover:text-[#f43f5e] hover:bg-white/[0.06] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile subnavigation bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-3 border-t border-white/[0.06] bg-[#0f131d]/90 text-xs">
        <button
          onClick={() => setActiveView('feed')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-full ${
            activeView === 'feed'
              ? 'text-[#ddb7ff] font-semibold bg-[#a855f7]/15'
              : 'text-[#94a3b8]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Feed</span>
        </button>
        <button
          onClick={() => setActiveView('community')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-full ${
            activeView === 'community'
              ? 'text-[#ddb7ff] font-semibold bg-[#a855f7]/15'
              : 'text-[#94a3b8]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Cinéfilos</span>
        </button>
        <button
          onClick={onViewMyProfile}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-full ${
            activeView === 'profile'
              ? 'text-[#ddb7ff] font-semibold bg-[#a855f7]/15'
              : 'text-[#94a3b8]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Meu Perfil</span>
        </button>
      </div>
    </header>
  );
}
