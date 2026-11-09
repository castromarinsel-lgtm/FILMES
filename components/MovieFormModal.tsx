'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Film,
  Star,
  Sparkles,
  Image as ImageIcon,
  Quote,
  Upload,
  Link as LinkIcon,
  Trash2,
  Check,
  Camera,
  FolderOpen,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
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

  // Poster registration options
  const [posterTab, setPosterTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process selected image file with canvas optimization
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione um arquivo de imagem válido (JPG, PNG ou WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('O arquivo é muito grande. Escolha uma imagem de até 15MB.');
      return;
    }

    setUploadError('');
    setIsProcessingImage(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        // Redimensionar para tamanho otimizado (aspecto padrão cartaz ~800x1200)
        const maxDimension = 900;
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setPosterUrl(optimizedDataUrl);
        } else {
          setPosterUrl(dataUrl);
        }
        setIsProcessingImage(false);
      };

      img.onerror = () => {
        setPosterUrl(dataUrl);
        setIsProcessingImage(false);
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      setUploadError('Falha ao ler o arquivo de imagem.');
      setIsProcessingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

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
        posterUrl:
          posterUrl.trim() ||
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
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
                  ? 'Atualize seu pôster, nota e impressões cinematográficas'
                  : 'Cadastre o pôster oficial, diretor, ano e sua resenha pessoal'}
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
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

          {/* ============================================================== */}
          {/* SEÇÃO PRINCIPAL: OPÇÕES DE CADASTRO DO PÔSTER DO FILME         */}
          {/* ============================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1320] border border-[#a855f7]/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-xs font-mono-cinema text-white uppercase font-bold tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#f97316]" />
                  Cartaz / Pôster do Filme *
                </span>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  Envie uma imagem do seu dispositivo, cole uma URL ou selecione um clássico:
                </p>
              </div>

              {/* Tabs de Seleção do Pôster */}
              <div className="inline-flex p-1 bg-[#111827] rounded-xl border border-white/[0.08] text-xs">
                <button
                  type="button"
                  onClick={() => setPosterTab('upload')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    posterTab === 'upload'
                      ? 'bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white font-semibold shadow-sm'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPosterTab('url')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    posterTab === 'url'
                      ? 'bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white font-semibold shadow-sm'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Link / URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPosterTab('presets')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    posterTab === 'presets'
                      ? 'bg-gradient-to-r from-[#a855f7] to-[#f43f5e] text-white font-semibold shadow-sm'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Galeria</span>
                </button>
              </div>
            </div>

            {/* Error Message for Poster */}
            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-[#ffb4ab] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Container com Duas Colunas: Inputs à esquerda e Preview à direita */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Coluna 1 e 2: Controles da Aba Ativa */}
              <div className="md:col-span-2 space-y-3">
                {/* ABA 1: UPLOAD DE ARQUIVO DO COMPUTADOR OU CELULAR */}
                {posterTab === 'upload' && (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                    />

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center gap-2.5 ${
                        isDragging
                          ? 'border-[#f97316] bg-[#f97316]/10 shadow-[0_0_20px_rgba(249,115,22,0.25)]'
                          : 'border-white/[0.15] hover:border-[#ddb7ff] bg-[#0b0f19]/70 hover:bg-[#111827]'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#1e293b] border border-white/10 flex items-center justify-center text-[#ddb7ff] shadow-md group-hover:scale-110 transition-transform">
                        {isProcessingImage ? (
                          <RefreshCw className="w-6 h-6 animate-spin text-[#f97316]" />
                        ) : (
                          <FolderOpen className="w-6 h-6" />
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-white">
                          {isProcessingImage
                            ? 'Processando imagem...'
                            : 'Clique para escolher ou arraste a imagem do pôster'}
                        </p>
                        <p className="text-[11px] text-[#94a3b8] mt-1">
                          Suporta arquivos PNG, JPG, JPEG ou WebP (do seu computador ou galeria do celular)
                        </p>
                      </div>

                      <button
                        type="button"
                        className="mt-1 px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#a855f7]/25 text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#f97316]" />
                        <span>Selecionar Imagem do Dispositivo</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ABA 2: URL DA WEB */}
                {posterTab === 'url' && (
                  <div className="space-y-2">
                    <label className="block text-xs text-[#cfc2d6]">
                      Cole o link direto da imagem (URL da internet):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={posterUrl.startsWith('data:') ? '' : posterUrl}
                        onChange={(e) => setPosterUrl(e.target.value)}
                        placeholder="https://exemplo.com/poster-do-filme.jpg"
                        className="flex-1 px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-xs font-mono-cinema focus:outline-none focus:border-[#a855f7] transition-all"
                      />
                      {posterUrl && (
                        <button
                          type="button"
                          onClick={() => setPosterUrl('')}
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 text-[#94a3b8] hover:text-white rounded-xl text-xs transition-colors"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Você pode usar imagens do IMDb, TMDB, Letterboxd ou qualquer repositório de imagens.
                    </p>
                  </div>
                )}

                {/* ABA 3: GALERIA DE CLÁSSICOS */}
                {posterTab === 'presets' && (
                  <div className="space-y-2">
                    <p className="text-xs text-[#cfc2d6]">
                      Ou escolha um pôster icônico pré-selecionado em alta resolução:
                    </p>
                    <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
                      {POPULAR_PRESET_MOVIES.map((preset, idx) => {
                        const isSelected = posterUrl === preset.posterUrl;
                        return (
                          <div
                            key={idx}
                            onClick={() => setPosterUrl(preset.posterUrl)}
                            className={`group relative aspect-[2/3] rounded-lg overflow-hidden border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#f97316] ring-2 ring-[#f97316] scale-105'
                                : 'border-white/10 hover:border-white/40 opacity-70 hover:opacity-100'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preset.posterUrl}
                              alt={preset.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#f97316] text-white flex items-center justify-center">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black to-transparent text-[9px] text-white font-medium truncate">
                              {preset.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Coluna 3: Preview do Pôster em Aspecto Cinematográfico 2:3 */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-28 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden border-2 border-[#ddb7ff]/40 bg-[#0a0e18] shadow-xl group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      posterUrl ||
                      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
                    }
                    alt="Pôster Selecionado"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-1.5 inset-x-1.5 text-center">
                    <span className="text-[9px] font-mono-cinema font-bold text-[#ddb7ff] uppercase tracking-wider bg-black/70 px-1.5 py-0.5 rounded border border-white/15 block truncate">
                      {title || 'Prévia do Pôster'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[10px] font-mono-cinema text-emerald-400 flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" />
                    Pôster Ativo
                  </span>
                </div>
              </div>
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
              className="w-full px-4 py-2.5 bg-[#0b0f19] border border-white/[0.12] rounded-xl text-white text-sm focus:outline-none focus:border-[#a855f7] transition-all leading-relaxed resize-none"
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
              {movieToEdit ? 'Salvar Alterações do Filme' : 'Cadastrar no Meu Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
