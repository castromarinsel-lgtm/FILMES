'use client';

import React, { useState } from 'react';
import { X, Clapperboard, Sparkles, User, UserPlus, LogIn, CheckCircle2, Film } from 'lucide-react';
import { UserProfile } from '@/types/cinema';
import { GUEST_USER } from '@/lib/initial-data';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onRegisterUser: (newUser: UserProfile) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSelectUser,
  onRegisterUser,
}: AuthModalProps) {
  const [tab, setTab] = useState<'guest' | 'register' | 'switch' | 'login'>('guest');

  // Form states for register
  const [regName, setRegName] = useState('');
  const [regHandle, setRegHandle] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regGenre, setRegGenre] = useState('Ficção Científica');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');

  // Form states for guest quick customizer
  const [guestName, setGuestName] = useState(currentUser.isGuest ? currentUser.name : 'Visitante Convidado');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const cleanHandle = (regHandle || regName.toLowerCase().replace(/\s+/g, '_')).replace(/[^a-zA-Z0-9_]/g, '');
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      handle: cleanHandle,
      avatar: regAvatar,
      bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
      bio: regBio.trim() || 'Amante da sétima arte explorando novos mundos através do cinema.',
      favoriteGenres: [regGenre, 'Drama', 'Cinema Autoral'],
      location: 'Brasil',
      joinedDate: 'Hoje',
      followersCount: 0,
      followingCount: 1,
      movies: [],
      guestbook: [],
    };

    onRegisterUser(newUser);
    onClose();
  };

  const handleGuestQuickEnter = () => {
    const guest: UserProfile = {
      ...GUEST_USER,
      name: guestName.trim() || 'Cinéfilo Visitante',
    };
    onSelectUser(guest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111827] border border-[#a855f7]/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden">
        {/* Neon Light flare on top edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ddb7ff] to-transparent opacity-80" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e293b] border border-[#a855f7]/40 flex items-center justify-center text-[#ddb7ff]">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-cinema text-xl font-bold text-white tracking-wide">
                Identificação no CineLumina
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Entre como visitante ou cadastre sua conta de cinéfilo
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

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 p-2 bg-[#0b0f19]/70 border-b border-white/[0.06] text-xs font-medium">
          <button
            onClick={() => setTab('guest')}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'guest'
                ? 'bg-[#a855f7]/20 text-[#ddb7ff] border border-[#a855f7]/30 font-semibold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visitante</span>
          </button>
          <button
            onClick={() => setTab('register')}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-[#a855f7]/20 text-[#ddb7ff] border border-[#a855f7]/30 font-semibold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Criar Cadastro</span>
          </button>
          <button
            onClick={() => setTab('switch')}
            className={`py-2 px-1 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'switch'
                ? 'bg-[#a855f7]/20 text-[#ddb7ff] border border-[#a855f7]/30 font-semibold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Alternar Conta</span>
          </button>
        </div>

        {/* Tab 1: Visitante Rápido */}
        {tab === 'guest' && (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#1e293b]/90 to-[#171b26]/90 border border-white/[0.08] relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#f97316]/15 border border-[#f97316]/30 text-[#f97316]">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    Modo Visitante Ativo
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                    Você pode navegar livremente pelo site, cadastrar e gerenciar seus filmes favoritos, visitar as páginas pessoais de outros cinéfilos e deixar comentários no mural de recados de qualquer um!
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-2">
                Como deseja ser chamado nesta visita?
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ex: Visitante Apaixonado por Cinema"
                className="w-full px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#94a3b8]">
                Usuário atual: <span className="text-white font-medium">{currentUser.name}</span>
              </span>
              <button
                type="button"
                onClick={handleGuestQuickEnter}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_28px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Continuar como Visitante
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Cadastrar Nova Conta */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
                Nome de Cinéfilo *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ex: Mariana Silva"
                className="w-full px-4 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
                  @Identificador (Handle)
                </label>
                <input
                  type="text"
                  value={regHandle}
                  onChange={(e) => setRegHandle(e.target.value)}
                  placeholder="mariana_cinema"
                  className="w-full px-4 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
                  Gênero Favorito
                </label>
                <select
                  value={regGenre}
                  onChange={(e) => setRegGenre(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all"
                >
                  <option value="Ficção Científica">Ficção Científica</option>
                  <option value="Drama">Drama</option>
                  <option value="Suspense">Suspense</option>
                  <option value="Crime">Crime</option>
                  <option value="Terror">Terror</option>
                  <option value="Cinema Nacional">Cinema Nacional</option>
                  <option value="Animação">Animação</option>
                  <option value="Romance">Romance</option>
                  <option value="Clássicos">Clássicos</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
                Mini Biografia Cinematográfica
              </label>
              <textarea
                rows={2}
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
                placeholder="Conte para a comunidade sobre seu estilo de cinema favorito..."
                className="w-full px-4 py-2 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
                Escolha seu Avatar
              </label>
              <div className="flex items-center gap-3">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
                  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
                ].map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRegAvatar(url)}
                    className={`relative rounded-full p-0.5 transition-all ${
                      regAvatar === url
                        ? 'ring-2 ring-[#a855f7] scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#94a3b8] hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all"
              >
                Concluir Cadastro
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Alternar entre Perfis Cadastrados */}
        {tab === 'switch' && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Alterne facilmente entre os perfis da comunidade para testar a experiência de visitar páginas de outros usuários e deixar comentários recíprocos:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {allUsers.map((user) => {
                const isSelected = user.id === currentUser.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#a855f7]/15 border-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                        : 'bg-[#1e293b]/50 border-white/[0.08] hover:bg-[#1e293b] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#ddb7ff]/30"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">
                            {user.name}
                          </p>
                          {user.isGuest && (
                            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#ddb7ff]">
                              Visitante
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#94a3b8]">
                          @{user.handle} • {user.movies.length} filme(s) favorito(s)
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#ddb7ff]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
