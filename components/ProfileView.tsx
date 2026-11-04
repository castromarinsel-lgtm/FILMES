'use client';

import React, { useState } from 'react';
import {
  Film,
  Star,
  MessageSquare,
  Users,
  Plus,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  Filter,
  UserCheck,
  UserPlus,
  Flame,
  ArrowLeft,
} from 'lucide-react';
import { UserProfile, Movie, ProfileComment } from '@/types/cinema';
import MovieCard from './MovieCard';
import GuestbookSection from './GuestbookSection';

interface ProfileViewProps {
  profileUser: UserProfile;
  currentUser: UserProfile;
  onOpenAddMovie: () => void;
  onEditMovie: (movie: Movie) => void;
  onDeleteMovie: (movie: Movie) => void;
  onAddComment: (comment: Omit<ProfileComment, 'id' | 'createdAt'>) => void;
  onDeleteComment: (commentId: string) => void;
  onBackToFeed?: () => void;
  onSwitchToAnotherProfile?: (user: UserProfile) => void;
}

export default function ProfileView({
  profileUser,
  currentUser,
  onOpenAddMovie,
  onEditMovie,
  onDeleteMovie,
  onAddComment,
  onDeleteComment,
  onBackToFeed,
}: ProfileViewProps) {
  const isOwner = currentUser.id === profileUser.id;
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'recent'>('rating');
  const [commentTargetMovie, setCommentTargetMovie] = useState<string>('');

  // Extract all unique genres from this user's movies
  const genres = Array.from(new Set(profileUser.movies.map((m) => m.genre)));

  // Filter & Sort movies
  const filteredMovies = profileUser.movies
    .filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || m.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      return 0;
    });

  const avgRating =
    profileUser.movies.length > 0
      ? (
          profileUser.movies.reduce((acc, m) => acc + m.rating, 0) /
          profileUser.movies.length
        ).toFixed(1)
      : '0.0';

  const handleCommentAboutMovie = (movieTitle: string) => {
    setCommentTargetMovie(movieTitle);
    // Smooth scroll to guestbook section
    const elem = document.getElementById('guestbook-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Navigation Breadcrumb / Back button */}
      {onBackToFeed && (
        <button
          onClick={onBackToFeed}
          className="inline-flex items-center gap-2 text-xs font-mono-cinema text-[#94a3b8] hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao Feed da Comunidade</span>
        </button>
      )}

      {/* Theatrical Profile Header Card */}
      <div className="relative rounded-3xl bg-[#111827] border border-white/[0.08] overflow-hidden shadow-2xl">
        {/* Cinema Backdrop Banner with gradient light sweep */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-[#0a0e18]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profileUser.bannerUrl}
            alt={profileUser.name}
            className="w-full h-full object-cover filter brightness-50 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent" />
          <div className="absolute inset-0 cinema-spotlight" />

          {/* Marquee Badge */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono-cinema font-bold uppercase tracking-widest bg-black/70 backdrop-blur-md text-[#ddb7ff] border border-[#a855f7]/40 shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
              {isOwner ? 'Seu Perfil de Cinéfilo' : 'Página Pessoal de Cinéfilo'}
            </span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-10 pb-8 -mt-20 sm:-mt-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#ddb7ff] shadow-[0_0_35px_rgba(168,85,247,0.4)] bg-black ring-4 ring-[#111827]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileUser.avatar}
                    alt={profileUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                </div>
                {profileUser.isGuest && (
                  <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-[10px] font-mono-cinema bg-[#f97316] text-white font-bold shadow-md">
                    Visitante
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif-cinema text-2xl sm:text-4xl font-bold text-white tracking-wide">
                    {profileUser.name}
                  </h1>
                  <span className="text-sm font-mono-cinema text-[#94a3b8]">
                    @{profileUser.handle}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#94a3b8]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#f43f5e]" />
                    {profileUser.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#ddb7ff]" />
                    Membro desde {profileUser.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-3">
              {isOwner ? (
                <button
                  onClick={onOpenAddMovie}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_28px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Cadastrar Novo Filme</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isFollowing
                        ? 'bg-[#1e293b] text-[#ddb7ff] border border-[#a855f7]/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:scale-105'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Seguindo</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Seguir Cinéfilo</span>
                      </>
                    )}
                  </button>

                  <a
                    href="#guestbook-section"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e293b] hover:bg-white/[0.08] text-white text-xs sm:text-sm font-medium border border-white/10 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-[#f43f5e]" />
                    <span>Deixar Recado</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Bio & Genres Pills */}
          <div className="mt-6 pt-6 border-t border-white/[0.08] grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <p className="text-sm text-[#cbd5e1] leading-relaxed">
                {profileUser.bio}
              </p>

              {/* Genre Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-mono-cinema text-[#94a3b8] uppercase tracking-wider">
                  Gêneros Favoritos:
                </span>
                {profileUser.favoriteGenres.map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1e293b] text-[#ddb7ff] border border-[#a855f7]/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 bg-[#0b0f19]/70 p-3.5 rounded-2xl border border-white/[0.06] text-center">
              <div>
                <p className="text-xs text-[#94a3b8] font-mono-cinema uppercase">Filmes</p>
                <p className="text-xl sm:text-2xl font-bold font-mono-cinema text-white mt-0.5">
                  {profileUser.movies.length}
                </p>
              </div>
              <div className="border-x border-white/[0.08]">
                <p className="text-xs text-[#94a3b8] font-mono-cinema uppercase">Média</p>
                <p className="text-xl sm:text-2xl font-bold font-mono-cinema text-amber-300 mt-0.5 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {avgRating}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8] font-mono-cinema uppercase">Recados</p>
                <p className="text-xl sm:text-2xl font-bold font-mono-cinema text-[#f43f5e] mt-0.5">
                  {profileUser.guestbook.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Galeria de Filmes Favoritos */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif-cinema text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <span>Filmes Favoritos</span>
              <span className="text-xs font-mono-cinema px-2.5 py-0.5 rounded-full bg-[#1e293b] text-[#ddb7ff] border border-white/10 font-normal">
                {profileUser.movies.length} obras cadastradas
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
              {isOwner
                ? 'Seus filmes prediletos. Você pode adicionar, editar ou remover qualquer título a qualquer momento.'
                : `Galeria curada com os filmes favoritos de ${profileUser.name}.`}
            </p>
          </div>

          {/* Search & Genre Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título ou diretor..."
                className="pl-8 pr-3 py-1.5 bg-[#111827] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#a855f7] w-48 sm:w-56"
              />
            </div>

            {genres.length > 0 && (
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-3 py-1.5 bg-[#111827] border border-white/10 rounded-xl text-xs text-[#dfe2f1] focus:outline-none focus:border-[#a855f7]"
              >
                <option value="all">Todos os Gêneros</option>
                {genres.map((g, idx) => (
                  <option key={idx} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-[#111827] border border-white/10 rounded-xl text-xs text-[#dfe2f1] focus:outline-none focus:border-[#a855f7]"
            >
              <option value="rating">Maior Nota</option>
              <option value="year">Ano de Lançamento</option>
            </select>
          </div>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#111827]/60 border border-dashed border-white/10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1e293b] flex items-center justify-center text-[#94a3b8]">
              <Film className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif-cinema text-xl font-bold text-white">
                {profileUser.movies.length === 0
                  ? 'Nenhum filme cadastrado ainda'
                  : 'Nenhum filme encontrado com os filtros atuais'}
              </h3>
              <p className="text-xs text-[#94a3b8] mt-1 max-w-md mx-auto">
                {isOwner
                  ? 'Comece agora cadastrando seu primeiro filme favorito para construir sua identidade no CineLumina!'
                  : 'Este cinéfilo ainda está organizando sua estante de favoritos.'}
              </p>
            </div>
            {isOwner && (
              <button
                onClick={onOpenAddMovie}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-lg hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Primeiro Filme</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isOwner={isOwner}
                onEdit={onEditMovie}
                onDelete={onDeleteMovie}
                onCommentAboutMovie={handleCommentAboutMovie}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Mural de Recados & Visitas (Guestbook Box) */}
      <section id="guestbook-section" className="pt-6">
        <GuestbookSection
          profileUser={profileUser}
          currentUser={currentUser}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          initialSelectedMovieTitle={commentTargetMovie}
        />
      </section>
    </div>
  );
}
