'use client';

import React from 'react';
import { Film, Star, MessageSquare, ArrowRight, Sparkles, Clapperboard, Flame, Plus, Users, Heart } from 'lucide-react';
import { UserProfile, Movie } from '@/types/cinema';

interface FeedViewProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onSelectProfile: (user: UserProfile) => void;
  onOpenAddMovie: () => void;
  onExploreCommunity: () => void;
}

export default function FeedView({
  users,
  currentUser,
  onSelectProfile,
  onOpenAddMovie,
  onExploreCommunity,
}: FeedViewProps) {
  // Aggregate all movies from all users with owner attribution
  const allCommunityEntries = users.flatMap((user) =>
    user.movies.map((movie) => ({
      movie,
      user,
    }))
  );

  // Aggregate all guestbook comments from all users
  const allRecentComments = users.flatMap((user) =>
    user.guestbook.map((comm) => ({
      comment: comm,
      targetUser: user,
    }))
  );

  const totalMovies = allCommunityEntries.length;
  const totalComments = allRecentComments.length;

  // Spotlight movie (Sempre ao Seu Lado as premier community highlight)
  const spotlightEntry =
    allCommunityEntries.find((e) => e.movie.title === 'Sempre ao Seu Lado') ||
    allCommunityEntries.find((e) => e.movie.title === 'Interestelar' || e.movie.rating === 10) ||
    allCommunityEntries[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Cinematic Spotlight Hero */}
      {spotlightEntry && (
        <div className="relative rounded-3xl bg-[#111827] border border-[#a855f7]/30 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.18)]">
          {/* Spotlight background */}
          <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={spotlightEntry.movie.backdropUrl || spotlightEntry.movie.posterUrl}
              alt={spotlightEntry.movie.title}
              className="w-full h-full object-cover filter brightness-45 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-transparent to-transparent hidden md:block" />
            <div className="absolute inset-0 cinema-spotlight" />

            {/* Marquee Header Chip */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono-cinema font-bold uppercase tracking-widest bg-black/75 backdrop-blur-md text-[#ddb7ff] border border-[#a855f7]/40 shadow-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#f97316] fill-[#f97316]" />
                Destaque da Comunidade CineLumina
              </span>
            </div>
          </div>

          {/* Hero Content Overlay */}
          <div className="p-6 sm:p-10 -mt-36 sm:-mt-44 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-cinema font-semibold bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30">
                  {spotlightEntry.movie.genre}
                </span>
                {spotlightEntry.movie.formatBadge && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-cinema font-semibold bg-[#1e293b] text-[#ddb7ff] border border-white/10">
                    {spotlightEntry.movie.formatBadge}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs font-mono-cinema text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {spotlightEntry.movie.rating.toFixed(1)}/10
                </span>
              </div>

              <h1 className="font-serif-cinema text-3xl sm:text-5xl font-bold text-white tracking-wide">
                {spotlightEntry.movie.title}
              </h1>

              <p className="text-xs sm:text-sm text-[#94a3b8]">
                Direção: <span className="text-white font-medium">{spotlightEntry.movie.director}</span> ({spotlightEntry.movie.year})
              </p>

              {spotlightEntry.movie.personalReview && (
                <p className="text-sm text-[#dfe2f1] italic bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/10 leading-relaxed">
                  &ldquo;{spotlightEntry.movie.personalReview}&rdquo;
                </p>
              )}

              {/* Curator Info */}
              <div
                onClick={() => onSelectProfile(spotlightEntry.user)}
                className="inline-flex items-center gap-2.5 pt-1 cursor-pointer group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={spotlightEntry.user.avatar}
                  alt={spotlightEntry.user.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#ddb7ff]"
                />
                <span className="text-xs text-[#94a3b8]">
                  Favorito na estante de{' '}
                  <strong className="text-white group-hover:text-[#ddb7ff] underline transition-colors">
                    {spotlightEntry.user.name}
                  </strong>
                </span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectProfile(spotlightEntry.user)}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Visitar Estante de {spotlightEntry.user.name.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAddMovie}
                className="px-5 py-3 rounded-xl bg-[#1e293b] hover:bg-white/[0.08] text-white text-xs sm:text-sm font-semibold border border-white/10 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#f97316]" />
                <span>Cadastrar Meu Filme</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.08] text-center">
          <p className="text-xs font-mono-cinema text-[#94a3b8] uppercase">Filmes Cadastrados</p>
          <p className="text-2xl font-bold font-mono-cinema text-white mt-1">{totalMovies}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.08] text-center">
          <p className="text-xs font-mono-cinema text-[#94a3b8] uppercase">Cinéfilos Ativos</p>
          <p className="text-2xl font-bold font-mono-cinema text-[#ddb7ff] mt-1">{users.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.08] text-center">
          <p className="text-xs font-mono-cinema text-[#94a3b8] uppercase">Recados Trocados</p>
          <p className="text-2xl font-bold font-mono-cinema text-[#f43f5e] mt-1">{totalComments}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#111827] border border-white/[0.08] text-center">
          <p className="text-xs font-mono-cinema text-[#94a3b8] uppercase">Acesso Livre</p>
          <p className="text-2xl font-bold font-mono-cinema text-emerald-400 mt-1">Visitantes</p>
        </div>
      </div>

      {/* Two Column Layout: Feed of Recent Favorites & Live Guestbook Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Movies Added by Cinephiles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-cinema text-2xl font-bold text-white flex items-center gap-2.5">
                <Film className="w-5 h-5 text-[#ddb7ff]" />
                <span>Últimos Favoritos Cadastrados</span>
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Obras recém-catalogadas pelos membros da rede social
              </p>
            </div>
            <button
              onClick={onExploreCommunity}
              className="text-xs text-[#ddb7ff] hover:text-white font-mono-cinema flex items-center gap-1 transition-colors"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {allCommunityEntries.map(({ movie, user }, idx) => (
              <div
                key={`${movie.id}-${idx}`}
                className="p-4 rounded-2xl bg-[#111827] border border-white/[0.08] hover:border-[#a855f7]/40 transition-all flex flex-col sm:flex-row gap-4 group"
              >
                {/* Poster */}
                <div
                  onClick={() => onSelectProfile(user)}
                  className="w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden bg-black shrink-0 cursor-pointer shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    {/* User bar */}
                    <div
                      onClick={() => onSelectProfile(user)}
                      className="flex items-center gap-2 cursor-pointer w-fit group/user"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#ddb7ff]/30"
                      />
                      <span className="text-xs text-[#94a3b8]">
                        Adicionado por <strong className="text-white group-hover/user:text-[#ddb7ff] transition-colors">{user.name}</strong>
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <h3
                        onClick={() => onSelectProfile(user)}
                        className="font-serif-cinema text-lg font-bold text-white group-hover:text-[#ddb7ff] transition-colors cursor-pointer"
                      >
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-mono-cinema text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{movie.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#94a3b8]">
                      Direção: <span className="text-white">{movie.director}</span> • {movie.year} • <span className="text-[#f97316] font-mono-cinema">{movie.genre}</span>
                    </p>

                    {movie.personalReview && (
                      <p className="text-xs text-[#cbd5e1] italic line-clamp-2 pt-1 leading-relaxed">
                        &ldquo;{movie.personalReview}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs mt-2">
                    <button
                      onClick={() => onSelectProfile(user)}
                      className="text-[#ddb7ff] hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#f43f5e]" />
                      <span>Ver página e deixar recado</span>
                    </button>
                    {movie.formatBadge && (
                      <span className="text-[10px] font-mono-cinema text-[#94a3b8] uppercase">
                        {movie.formatBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Guestbook Activity & Cinephiles Suggestion */}
        <div className="space-y-6">
          {/* Recent Guestbook notes */}
          <div className="p-6 rounded-3xl bg-[#111827] border border-white/[0.08] shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f43f5e]/15 border border-[#f43f5e]/30 flex items-center justify-center text-[#f43f5e]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-cinema text-lg font-bold text-white">
                  Mural da Comunidade
                </h3>
                <p className="text-[11px] text-[#94a3b8]">
                  Recados trocados entre os cinéfilos
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {allRecentComments.slice(0, 4).map(({ comment, targetUser }, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectProfile(targetUser)}
                  className="p-3.5 rounded-xl bg-[#0b0f19] border border-white/[0.06] hover:border-white/[0.15] transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-white font-medium group-hover:text-[#ddb7ff] transition-colors">
                        {comment.authorName}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#64748b]">{comment.createdAt}</span>
                  </div>

                  <p className="text-xs text-[#cbd5e1] leading-relaxed line-clamp-2">
                    &ldquo;{comment.content}&rdquo;
                  </p>

                  <div className="text-[11px] text-[#94a3b8] flex items-center justify-between pt-1 border-t border-white/[0.04]">
                    <span>
                      no perfil de <strong className="text-white">@{targetUser.handle}</strong>
                    </span>
                    {comment.relatedMovieTitle && (
                      <span className="text-[#f97316] font-mono-cinema text-[10px]">
                        ★ {comment.relatedMovieTitle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Discover Cinéfilos card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c1f2a] to-[#111827] border border-[#a855f7]/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#ddb7ff]" />
              <h3 className="font-serif-cinema text-lg font-bold text-white">
                Páginas Recomendadas
              </h3>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Explore o perfil pessoal dos outros amantes de cinema e descubra clássicos que você ainda não assistiu:
            </p>

            <div className="space-y-2.5">
              {users.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  onClick={() => onSelectProfile(user)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0b0f19]/70 hover:bg-[#1e293b] border border-white/[0.06] cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#ddb7ff]/30"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#ddb7ff] transition-colors leading-tight">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-[#94a3b8] font-mono-cinema">
                        @{user.handle} • {user.movies.length} filmes
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94a3b8] group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>

            <button
              onClick={onExploreCommunity}
              className="w-full py-2.5 rounded-xl bg-[#a855f7]/20 hover:bg-[#a855f7]/30 text-[#ddb7ff] text-xs font-semibold border border-[#a855f7]/40 transition-all text-center block"
            >
              Explorar Todos os Membros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
