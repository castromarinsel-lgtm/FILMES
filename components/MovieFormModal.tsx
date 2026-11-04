'use client';

import React, { useState, useEffect } from 'react';
import { X, Film, Star, Sparkles, Image as ImageIcon, Quote } from 'lucide-react';
import { Movie } from '@/types/cinema';
import { POPULAR_PRESET_MOVIES } from '@/lib/initial-data';

interface MovieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieToEdit?: Movie | null;
  onSaveMovie: (movieData: Omit<Movie, 'id' | 'addedAt'>, editId?: string) => void;
}

export default function MovieFormModal({
  isOpen,
  onClose,
  movieToEdit,
  onSaveMovie,
}: MovieFormModalProps) {
  const [title, setTitle] = useState(movieToEdit?.title || '');
  const [director, setDirector] = useState(movieToEdit?.director || '');
  const [year, setYear] = useState<number>(movieToEdit?.year || new Date().getFullYear());
  const [genre, setGenre] = useState(movieToEdit?.genre || 'Ficção Científica');
  const [rating, setRating] = useState<number>(movieToEdit?.rating || 9.5);
  const [posterUrl, setPosterUrl] = useState(
    movieToEdit?.posterUrl ||
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  );
  const [personalReview, setPersonalReview] = useState(movieToEdit?.personalReview || '');
  const [favoriteQuote, setFavoriteQuote] = useState(movieToEdit?.favoriteQuote || '');
  const [formatBadge, setFormatBadge] = useState<Movie['formatBadge']>(
    movieToEdit?.formatBadge || '4K HDR'
  );

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof POPULAR_PRESET_MOVIES[0]) => {
    setTitle(preset.title);
    setDirector(preset.director);
    setYear(preset.year);
    setGenre(preset.genre);
    setRating(preset.rating);
    setPosterUrl(preset.posterUrl);
    setPersonalReview(preset.personalReview || '');
    setFavoriteQuote(preset.favoriteQuote || '');
    setFormatBadge(preset.formatBadge || '4K HDR');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !director.trim()) return;

    onSaveMovie(
      {
        title: title.trim(),
        director: director.trim(),
        year: Number(year) || 2024,
        genre: genre.trim(),
        rating: Number(rating) || 10,
        posterUrl: posterUrl.trim() || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
        personalReview: personalReview.trim(),
        favoriteQuote: favoriteQuote.trim(),
        formatBadge,
      },
      movieToEdit ? movieToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-[#a855f7]/35 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.25)] overflow-hidden my-6">
        {/* Neon Light Top Border */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#f43f5e] via-[#ddb7ff] to-[#f97316]" />

        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e293b] border border-[#a855f7]/40 flex items-center justify-center text-[#f97316]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-cinema text-xl sm:text-2xl font-bold text-white tracking-wide">
                {movieToEdit ? 'Editar Filme Favorito' : 'Cadastrar Filme Favorito'}
              </h2>
              <p className="text-xs text-[#94a3b8]">
                {movieToEdit
                  ? 'Atualize sua avaliação e impressões sobre esta obra'
                  : 'Adicione uma obra-prima à sua galeria de cinema pessoal'}
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

        {/* Quick Presets (Only when adding) */}
        {!movieToEdit && (
          <div className="px-5 sm:px-6 pt-4 pb-2 border-b border-white/[0.06] bg-[#0b0f19]/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono-cinema text-[#ddb7ff] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
                Preenchimento Rápido com Clássicos Sugeridos:
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {POPULAR_PRESET_MOVIES.slice(0, 6).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 text-xs whitespace-nowrap rounded-full bg-[#1e293b]/70 hover:bg-[#a855f7]/20 border border-white/[0.08] hover:border-[#a855f7]/40 text-[#dfe2f1] hover:text-white transition-all shrink-0"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title & Director */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
                Título do Filme *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: O Poderoso Chefão"
                className="w-full px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
                Direção / Cineasta *
              </label>
              <input
                type="text"
                required
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="Ex: Francis Ford Coppola"
                className="w-full px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all"
              />
            </div>
          </div>

          {/* Year, Genre, Format */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
                Ano de Lançamento
              </label>
              <input
                type="number"
                min={1895}
                max={2030}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all font-mono-cinema"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
                Gênero Principal
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Ex: Drama / Suspense"
                className="w-full px-3 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
                Selo de Formato
              </label>
              <select
                value={formatBadge}
                onChange={(e) => setFormatBadge(e.target.value as Movie['formatBadge'])}
                className="w-full px-3 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all font-mono-cinema"
              >
                <option value="4K HDR">4K HDR</option>
                <option value="IMAX">IMAX</option>
                <option value="35mm">Película 35mm</option>
                <option value="Dolby Atmos">Dolby Atmos</option>
                <option value="Criterion">Criterion Collection</option>
              </select>
            </div>
          </div>

          {/* Rating Slider & Badge */}
          <div className="p-4 rounded-xl bg-[#0b0f19]/80 border border-white/[0.08]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                Sua Nota Pessoal (1 a 10):
              </label>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono-cinema font-bold text-sm border border-amber-500/30">
                {rating.toFixed(1)} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={0.1}
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full accent-[#f97316] cursor-pointer"
            />
          </div>

          {/* Poster Image URL & Preview */}
          <div>
            <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#ddb7ff]" />
              URL do Pôster / Imagem do Filme
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all font-mono-cinema text-xs"
              />
              {posterUrl && (
                <div className="w-10 h-14 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={posterUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Personal Review */}
          <div>
            <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5">
              Por que este filme é especial para você? (Sua Resenha)
            </label>
            <textarea
              rows={3}
              value={personalReview}
              onChange={(e) => setPersonalReview(e.target.value)}
              placeholder="Escreva suas impressões, memórias ao assistir ou por que ele merece estar entre seus favoritos..."
              className="w-full px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all leading-relaxed"
            />
          </div>

          {/* Memorable Quote */}
          <div>
            <label className="block text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-[#f43f5e]" />
              Frase ou Citação Marcante (Opcional)
            </label>
            <input
              type="text"
              value={favoriteQuote}
              onChange={(e) => setFavoriteQuote(e.target.value)}
              placeholder="Ex: 'Não vá dócil nessa noite escura...'"
              className="w-full px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all italic"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-[#94a3b8] hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_28px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {movieToEdit ? 'Salvar Alterações' : 'Cadastrar no Meu Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
