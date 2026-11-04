'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Movie } from '@/types/cinema';

interface DeleteMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
  onConfirmDelete: (movieId: string) => void;
}

export default function DeleteMovieModal({
  isOpen,
  onClose,
  movie,
  onConfirmDelete,
}: DeleteMovieModalProps) {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#111827] border border-[#f43f5e]/40 rounded-2xl shadow-[0_0_40px_rgba(244,63,94,0.25)] overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f43f5e]/15 border border-[#f43f5e]/30 flex items-center justify-center text-[#f43f5e]">
            <Trash2 className="w-7 h-7" />
          </div>

          <div>
            <h3 className="font-serif-cinema text-xl font-bold text-white">
              Remover dos Favoritos?
            </h3>
            <p className="text-xs text-[#94a3b8] mt-2 leading-relaxed">
              Tem certeza que deseja remover <strong className="text-white">&ldquo;{movie.title}&rdquo;</strong> da sua lista pessoal de filmes favoritos?
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-[#94a3b8] hover:text-white bg-white/[0.05] hover:bg-white/[0.1] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirmDelete(movie.id);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f43f5e] to-[#e11d48] text-white text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:shadow-[0_0_22px_rgba(244,63,94,0.6)] transition-all"
            >
              Sim, Remover Filme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
