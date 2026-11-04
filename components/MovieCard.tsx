'use client';

import React, { useState } from 'react';
import { Star, Edit3, Trash2, MessageSquare, Quote, Sparkles, Film, Maximize2 } from 'lucide-react';
import { Movie } from '@/types/cinema';

interface MovieCardProps {
  movie: Movie;
  isOwner: boolean;
  onEdit?: (movie: Movie) => void;
  onDelete?: (movie: Movie) => void;
  onCommentAboutMovie?: (movieTitle: string) => void;
}

export default function MovieCard({
  movie,
  isOwner,
  onEdit,
  onDelete,
  onCommentAboutMovie,
}: MovieCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <>
      <div className="group relative rounded-xl bg-[#111827] border border-white/[0.08] hover:border-[#a855f7]/50 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(168,85,247,0.25)] flex flex-col">
        {/* Poster Media Frame (2:3 aspect ratio) */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0a0e18] cursor-pointer" onClick={() => setShowDetailsModal(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Top Format Badges & Rating */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
            {movie.formatBadge ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-cinema font-bold tracking-wider uppercase bg-[#111827]/90 text-[#ddb7ff] border border-white/15 backdrop-blur-md shadow-md">
                {movie.formatBadge}
              </span>
            ) : <span />}

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-300 font-mono-cinema text-xs font-bold shadow-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Hover Action quick triggers */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <span className="text-[11px] font-mono-cinema text-[#f97316] uppercase tracking-wider font-semibold">
              {movie.genre}
            </span>
            <h3 className="font-serif-cinema text-base sm:text-lg font-bold text-white line-clamp-1 group-hover:text-[#ddb7ff] transition-colors">
              {movie.title}
            </h3>
            <p className="text-xs text-[#94a3b8] flex items-center gap-1.5 mt-0.5 font-medium">
              <span>{movie.director}</span>
              <span>•</span>
              <span className="font-mono-cinema">{movie.year}</span>
            </p>
          </div>
        </div>

        {/* Card Body & Actions */}
        <div className="p-3 bg-[#111827] flex-1 flex flex-col justify-between border-t border-white/[0.06]">
          {/* Personal Review Snippet */}
          {movie.personalReview ? (
            <p className="text-xs text-[#cbd5e1] line-clamp-2 italic leading-relaxed mb-3">
              &ldquo;{movie.personalReview}&rdquo;
            </p>
          ) : (
            <p className="text-xs text-[#64748b] italic mb-3">Sem resenha cadastrada.</p>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
            {isOwner ? (
              <div className="flex items-center gap-1.5 w-full justify-end">
                <button
                  onClick={() => onEdit?.(movie)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#a855f7]/20 text-[#ddb7ff] border border-white/[0.08] hover:border-[#a855f7]/40 transition-all"
                  title="Editar dados do filme"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onDelete?.(movie)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#f43f5e]/20 text-[#f43f5e] border border-white/[0.08] hover:border-[#f43f5e]/40 transition-all"
                  title="Remover filme dos favoritos"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remover</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => onCommentAboutMovie?.(movie.title)}
                  className="flex items-center gap-1.5 text-xs text-[#ddb7ff] hover:text-white transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#f43f5e]" />
                  <span>Comentar sobre este filme</span>
                </button>
                <button
                  onClick={() => setShowDetailsModal(true)}
                  className="p-1 rounded text-[#94a3b8] hover:text-white transition-colors"
                  title="Ver detalhes completos"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Movie Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#111827] border border-[#a855f7]/40 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden">
            <div className="relative h-48 w-full bg-[#0a0e18] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover filter brightness-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/50 to-transparent" />
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-mono-cinema text-[#f97316] uppercase font-bold tracking-wider">
                    {movie.genre}
                  </span>
                  <h2 className="font-serif-cinema text-2xl font-bold text-white leading-tight">
                    {movie.title}
                  </h2>
                  <p className="text-xs text-[#94a3b8] font-medium">
                    Direção: <span className="text-white">{movie.director}</span> ({movie.year})
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono-cinema font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{movie.rating.toFixed(1)}/10</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {movie.personalReview && (
                <div>
                  <h4 className="text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ddb7ff]" />
                    Resenha do Cinéfilo
                  </h4>
                  <p className="text-sm text-[#dfe2f1] leading-relaxed bg-[#0b0f19] p-3.5 rounded-xl border border-white/[0.06]">
                    &ldquo;{movie.personalReview}&rdquo;
                  </p>
                </div>
              )}

              {movie.favoriteQuote && (
                <div>
                  <h4 className="text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-[#f43f5e]" />
                    Citação Inesquecível
                  </h4>
                  <p className="text-xs text-[#ffb2b7] italic bg-[#f43f5e]/10 p-3 rounded-xl border border-[#f43f5e]/20">
                    &ldquo;{movie.favoriteQuote}&rdquo;
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
                {movie.formatBadge && (
                  <span className="text-xs font-mono-cinema text-[#94a3b8]">
                    Formato Cadastrado: <strong className="text-[#ddb7ff]">{movie.formatBadge}</strong>
                  </span>
                )}
                {!isOwner && onCommentAboutMovie && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      onCommentAboutMovie(movie.title);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white text-xs font-semibold tracking-wide shadow-md hover:scale-105 transition-all"
                  >
                    Deixar Comentário sobre este Filme
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
