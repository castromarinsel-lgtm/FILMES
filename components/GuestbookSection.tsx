'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Trash2, Heart, Film, User } from 'lucide-react';
import { ProfileComment, UserProfile, Movie } from '@/types/cinema';

interface GuestbookSectionProps {
  profileUser: UserProfile;
  currentUser: UserProfile;
  onAddComment: (comment: Omit<ProfileComment, 'id' | 'createdAt'>) => void;
  onDeleteComment: (commentId: string) => void;
  initialSelectedMovieTitle?: string;
}

export default function GuestbookSection({
  profileUser,
  currentUser,
  onAddComment,
  onDeleteComment,
  initialSelectedMovieTitle,
}: GuestbookSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<string>(initialSelectedMovieTitle || '');
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  const isOwner = currentUser.id === profileUser.id;

  const quickStamps = [
    '🍿 Bom gosto refinadíssimo nesta lista!',
    '🏆 Uma seleção de verdadeiras obras-primas!',
    '✨ Adicionei vários desses à minha lista para ver hoje!',
    '🔥 Cinema no mais alto nível de excelência!',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatar,
      authorBadge: currentUser.isGuest ? 'Visitante Convidado' : 'Cinéfilo Membro',
      content: commentText.trim(),
      relatedMovieTitle: selectedMovie || undefined,
      likesCount: 1,
    });

    setCommentText('');
    setSelectedMovie('');
  };

  const handleApplyStamp = (stamp: string) => {
    setCommentText(stamp);
  };

  const toggleLike = (id: string) => {
    setLikedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="rounded-2xl bg-[#111827] border border-white/[0.08] overflow-hidden shadow-xl">
      {/* Section Header */}
      <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-[#171b26]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7]/20 to-[#f43f5e]/20 border border-[#a855f7]/40 flex items-center justify-center text-[#ddb7ff]">
            <MessageSquare className="w-5 h-5 text-[#ddb7ff]" />
          </div>
          <div>
            <h3 className="font-serif-cinema text-xl font-bold text-white flex items-center gap-2">
              <span>Mural de Recados & Visitas</span>
              <span className="text-xs font-mono-cinema font-normal px-2 py-0.5 rounded-full bg-[#1e293b] text-[#ddb7ff] border border-white/10">
                {profileUser.guestbook.length} {profileUser.guestbook.length === 1 ? 'recado' : 'recados'}
              </span>
            </h3>
            <p className="text-xs text-[#94a3b8]">
              {isOwner
                ? 'Espaço onde outros cinéfilos visitantes deixam impressões sobre seus filmes favoritos'
                : `Deixe uma palavra ou frase sobre os filmes favoritos de ${profileUser.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* Leave a Comment Form */}
      <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-[#0f131d]/50">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono-cinema text-[#cfc2d6] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
              Escreva para o cinéfilo:
            </span>
            <div className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-[#94a3b8]" />
              <select
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                className="text-xs bg-[#111827] text-[#dfe2f1] border border-white/10 rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#a855f7]"
              >
                <option value="">Sobre toda a lista</option>
                {profileUser.movies.map((m) => (
                  <option key={m.id} value={m.title}>
                    Sobre: {m.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                isOwner
                  ? 'Você também pode deixar uma anotação ou aviso no seu próprio mural...'
                  : `Deixe sua impressão sobre os filmes favoritos de @${profileUser.handle}...`
              }
              className="w-full px-4 py-3 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Quick Reaction Stamps */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-[#94a3b8] shrink-0 font-medium">Reações rápidas:</span>
            {quickStamps.map((stamp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyStamp(stamp)}
                className="px-2.5 py-1 text-xs whitespace-nowrap rounded-full bg-[#1e293b]/70 hover:bg-[#a855f7]/20 border border-white/[0.08] hover:border-[#a855f7]/40 text-[#cfc2d6] hover:text-white transition-all shrink-0"
              >
                {stamp}
              </button>
            ))}
          </div>

          {/* Submit Row */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-[#ddb7ff]/30"
              />
              <span>
                Comentando como <strong className="text-white">{currentUser.name}</strong>
              </span>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_15px_rgba(168,85,247,0.35)] hover:shadow-[0_0_22px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Recado</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="p-5 sm:p-6 space-y-4">
        {profileUser.guestbook.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-white/[0.1] rounded-2xl bg-[#0b0f19]/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1e293b] flex items-center justify-center text-[#94a3b8] mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">Nenhum recado deixado ainda</p>
            <p className="text-xs text-[#94a3b8] mt-1 max-w-sm mx-auto">
              Seja o primeiro cinéfilo visitante a deixar uma mensagem especial sobre os filmes cadastrados neste perfil!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {profileUser.guestbook.map((comm) => {
              const isLiked = likedComments[comm.id];
              return (
                <div
                  key={comm.id}
                  className="p-4 rounded-xl bg-[#0b0f19]/70 border border-white/[0.06] hover:border-white/[0.12] transition-all flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={comm.authorAvatar}
                      alt={comm.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-[#ddb7ff]/30 shrink-0 mt-0.5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {comm.authorName}
                        </span>
                        <span className="text-xs font-mono-cinema text-[#94a3b8]">
                          @{comm.authorHandle}
                        </span>
                        {comm.authorBadge && (
                          <span className="text-[10px] font-mono-cinema px-2 py-0.5 rounded-full bg-[#a855f7]/15 text-[#ddb7ff] border border-[#a855f7]/30">
                            {comm.authorBadge}
                          </span>
                        )}
                        <span className="text-xs text-[#64748b]">• {comm.createdAt}</span>
                      </div>

                      {comm.relatedMovieTitle && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f97316]/15 border border-[#f97316]/30 text-[#f97316] text-[11px] font-mono-cinema font-medium">
                          <Film className="w-3 h-3" />
                          <span>Sobre: {comm.relatedMovieTitle}</span>
                        </div>
                      )}

                      <p className="text-sm text-[#dfe2f1] leading-relaxed pt-1">
                        {comm.content}
                      </p>
                    </div>
                  </div>

                  {/* Likes and Delete Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleLike(comm.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all ${
                        isLiked
                          ? 'bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30'
                          : 'text-[#94a3b8] hover:text-[#f43f5e] hover:bg-white/[0.05]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{(comm.likesCount || 0) + (isLiked ? 1 : 0)}</span>
                    </button>

                    {/* Owner can delete comment */}
                    {(isOwner || currentUser.id === comm.authorId) && (
                      <button
                        onClick={() => onDeleteComment(comm.id)}
                        className="opacity-60 group-hover:opacity-100 p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f43f5e] hover:bg-white/[0.05] transition-all"
                        title="Excluir este recado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
