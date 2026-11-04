'use client';

import React, { useState } from 'react';
import { Users, Search, Film, Star, MessageSquare, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { UserProfile } from '@/types/cinema';

interface CommunityViewProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onSelectProfile: (user: UserProfile) => void;
  onOpenAddMovie: () => void;
}

export default function CommunityView({
  users,
  currentUser,
  onSelectProfile,
  onOpenAddMovie,
}: CommunityViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesName = u.name.toLowerCase().includes(term);
    const matchesHandle = u.handle.toLowerCase().includes(term);
    const matchesBio = u.bio.toLowerCase().includes(term);
    const matchesGenres = u.favoriteGenres.some((g) => g.toLowerCase().includes(term));
    const matchesMovies = u.movies.some((m) => m.title.toLowerCase().includes(term));
    return matchesName || matchesHandle || matchesBio || matchesGenres || matchesMovies;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#171b26] via-[#1c1f2a] to-[#111827] border border-white/[0.08] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a855f7]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#f43f5e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-[#a855f7]/40 text-[#ddb7ff] text-xs font-mono-cinema uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-[#f97316]" />
            <span>Comunidade CineLumina</span>
          </div>
          <h1 className="font-serif-cinema text-3xl sm:text-5xl font-bold text-white tracking-wide leading-tight">
            Descubra as Páginas Pessoais de Outros Cinéfilos
          </h1>
          <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
            Navegue pelos perfis dos membros da comunidade, explore o acervo de filmes favoritos de cada um e deixe uma palavra carinhosa ou debate em suas caixas de comentários!
          </p>

          {/* Search bar */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cinéfilos, diretores ou filmes favoritos..."
                className="w-full pl-10 pr-4 py-3 bg-[#0b0f19] border border-white/[0.12] rounded-2xl text-white text-sm focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const isMe = user.id === currentUser.id;
          return (
            <div
              key={user.id}
              className="group rounded-2xl bg-[#111827] border border-white/[0.08] hover:border-[#a855f7]/50 overflow-hidden shadow-xl transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(168,85,247,0.25)] flex flex-col justify-between"
            >
              <div>
                {/* User Card Top / Banner */}
                <div className="relative h-24 w-full bg-[#0a0e18] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.bannerUrl}
                    alt={user.name}
                    className="w-full h-full object-cover filter brightness-50 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                  {isMe && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-mono-cinema font-bold bg-[#f97316] text-white shadow-md">
                      Você
                    </span>
                  )}
                </div>

                {/* Avatar and Identity */}
                <div className="px-5 pb-4 -mt-10 relative z-10 space-y-3">
                  <div className="flex items-end justify-between">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#ddb7ff] bg-black ring-2 ring-[#111827] shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono-cinema text-[#ddb7ff] font-semibold flex items-center gap-1 justify-end">
                        <Film className="w-3.5 h-3.5 text-[#f97316]" />
                        {user.movies.length} {user.movies.length === 1 ? 'filme' : 'filmes'}
                      </span>
                      <span className="text-[11px] text-[#94a3b8] flex items-center gap-1 justify-end">
                        <MessageSquare className="w-3 h-3 text-[#f43f5e]" />
                        {user.guestbook.length} recados
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif-cinema text-lg font-bold text-white group-hover:text-[#ddb7ff] transition-colors leading-tight">
                      {user.name}
                    </h3>
                    <p className="text-xs font-mono-cinema text-[#94a3b8]">
                      @{user.handle}
                    </p>
                  </div>

                  <p className="text-xs text-[#cbd5e1] line-clamp-2 leading-relaxed">
                    {user.bio}
                  </p>

                  {/* Favorite Movie Thumbnails Preview */}
                  {user.movies.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[11px] font-mono-cinema text-[#94a3b8] uppercase tracking-wider mb-1.5">
                        Destaques da Estante:
                      </p>
                      <div className="flex items-center gap-2">
                        {user.movies.slice(0, 3).map((m) => (
                          <div
                            key={m.id}
                            className="relative w-12 aspect-[2/3] rounded-md overflow-hidden border border-white/10 shrink-0 bg-black group/poster"
                            title={`${m.title} (${m.year}) - Nota ${m.rating}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={m.posterUrl}
                              alt={m.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover/poster:bg-transparent" />
                          </div>
                        ))}
                        {user.movies.length > 3 && (
                          <span className="text-[11px] font-mono-cinema text-[#94a3b8] pl-1">
                            +{user.movies.length - 3} mais
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-4 pt-2 border-t border-white/[0.06] bg-[#0f131d]/40">
                <button
                  onClick={() => onSelectProfile(user)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1e293b] hover:bg-gradient-to-r hover:from-[#a855f7] hover:to-[#f43f5e] text-white text-xs font-semibold tracking-wide border border-white/10 hover:border-transparent transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  <span>{isMe ? 'Ver Meu Perfil' : 'Visitar Página Pessoal'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
