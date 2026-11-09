import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { UserProfile, Movie, ProfileComment } from '@/types/cinema';
import { INITIAL_USERS } from './initial-data';

export interface AuthResponse {
  user: UserProfile | null;
  error: string | null;
}

// 1. Cadastro via E-mail e Senha no Supabase Auth + Tabela Profiles
export async function registerWithSupabase(
  email: string,
  password: string,
  profileData: {
    name: string;
    handle: string;
    bio: string;
    favoriteGenres: string[];
    avatar: string;
  }
): Promise<AuthResponse> {
  const client = getSupabaseClient();

  if (!client || !isSupabaseConfigured()) {
    return {
      user: null,
      error: 'Supabase não está configurado com chaves válidas. Configure o NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    };
  }

  try {
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: profileData.name,
          handle: profileData.handle,
          bio: profileData.bio,
          avatar: profileData.avatar,
        },
      },
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'Não foi possível criar o usuário no Supabase.' };
    }

    const userId = authData.user.id;

    // Inserir ou atualizar na tabela public.profiles
    const { error: profileError } = await client.from('profiles').upsert({
      id: userId,
      name: profileData.name,
      handle: profileData.handle,
      email: email,
      bio: profileData.bio,
      favorite_genres: profileData.favoriteGenres,
      avatar: profileData.avatar,
      banner_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
      location: 'Brasil',
    });

    if (profileError) {
      console.warn('Erro ao atualizar tabela profiles no Supabase:', profileError);
    }

    const newUserProfile: UserProfile = {
      id: userId,
      name: profileData.name,
      handle: profileData.handle,
      email: email,
      avatar: profileData.avatar,
      bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
      bio: profileData.bio,
      favoriteGenres: profileData.favoriteGenres,
      location: 'Brasil',
      joinedDate: 'Hoje',
      movies: [],
      guestbook: [],
      followersCount: 0,
      followingCount: 1,
    };

    return { user: newUserProfile, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Erro inesperado ao cadastrar no Supabase.' };
  }
}

// 2. Login via E-mail e Senha no Supabase Auth
export async function loginWithSupabase(
  email: string,
  password: string
): Promise<AuthResponse> {
  const client = getSupabaseClient();

  if (!client || !isSupabaseConfigured()) {
    return {
      user: null,
      error: 'Supabase não configurado. Por favor insira suas chaves no .env.local ou no modal de conexão.',
    };
  }

  try {
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'Usuário não encontrado.' };
    }

    const userId = authData.user.id;

    // Buscar perfil completo com filmes e comentários
    const profile = await fetchProfileWithDetails(userId);
    if (profile) {
      return { user: profile, error: null };
    }

    // Perfil fallback baseado no metadata do Auth
    const metadata = authData.user.user_metadata || {};
    const fallbackProfile: UserProfile = {
      id: userId,
      name: metadata.name || authData.user.email?.split('@')[0] || 'Cinéfilo',
      handle: metadata.handle || authData.user.email?.split('@')[0] || 'cinefilo',
      email: authData.user.email,
      avatar: metadata.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
      bio: metadata.bio || 'Membro do CineLumina',
      favoriteGenres: ['Ficção Científica', 'Drama'],
      location: 'Brasil',
      joinedDate: 'Hoje',
      movies: [],
      guestbook: [],
      followersCount: 0,
      followingCount: 1,
    };

    return { user: fallbackProfile, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Erro de conexão com o Supabase.' };
  }
}

// 3. Logout
export async function logoutFromSupabase(): Promise<void> {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('Erro ao deslogar do Supabase:', e);
    }
  }
}

// 4. Buscar Perfil de Usuário com Filmes e Mural do Supabase
export async function fetchProfileWithDetails(userId: string): Promise<UserProfile | null> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return null;

  try {
    const { data: profileData, error: profileErr } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileErr || !profileData) return null;

    // Buscar filmes do usuário
    const { data: moviesData } = await client
      .from('movies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Buscar comentários no mural do usuário
    const { data: commentsData } = await client
      .from('guestbook_comments')
      .select('*')
      .eq('profile_user_id', userId)
      .order('created_at', { ascending: false });

    const movies: Movie[] = (moviesData || []).map((m: any) => ({
      id: m.id,
      title: m.title,
      director: m.director,
      year: m.year,
      genre: m.genre,
      rating: parseFloat(m.rating) || 10,
      posterUrl: m.poster_url,
      backdropUrl: m.backdrop_url,
      personalReview: m.personal_review,
      formatBadge: m.format_badge,
      favoriteQuote: m.favorite_quote,
      addedAt: m.created_at ? new Date(m.created_at).toISOString().split('T')[0] : 'Hoje',
    }));

    const guestbook: ProfileComment[] = (commentsData || []).map((c: any) => ({
      id: c.id,
      authorId: c.author_id,
      authorName: c.author_name,
      authorHandle: c.author_handle,
      authorAvatar: c.author_avatar,
      authorBadge: c.author_badge,
      content: c.content,
      relatedMovieTitle: c.related_movie_title,
      createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : 'Hoje',
      likesCount: c.likes_count || 1,
    }));

    return {
      id: profileData.id,
      name: profileData.name,
      handle: profileData.handle,
      email: profileData.email,
      avatar: profileData.avatar,
      bannerUrl: profileData.banner_url,
      bio: profileData.bio,
      favoriteGenres: profileData.favorite_genres || ['Ficção Científica', 'Drama'],
      location: profileData.location || 'Brasil',
      joinedDate: profileData.created_at
        ? new Date(profileData.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        : '2024',
      movies,
      guestbook,
      followersCount: 0,
      followingCount: 1,
    };
  } catch (err) {
    console.error('Falha ao carregar perfil do Supabase:', err);
    return null;
  }
}

// 5. Buscar Todos os Usuários e seus Filmes da Comunidade do Supabase
export async function fetchAllUsersFromSupabase(): Promise<UserProfile[] | null> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return null;

  try {
    const { data: profiles, error: pErr } = await client.from('profiles').select('*');
    if (pErr || !profiles || profiles.length === 0) return null;

    const { data: allMovies } = await client.from('movies').select('*');
    const { data: allComments } = await client.from('guestbook_comments').select('*');

    return profiles.map((p: any) => {
      const userMovies = (allMovies || [])
        .filter((m: any) => m.user_id === p.id)
        .map((m: any) => ({
          id: m.id,
          title: m.title,
          director: m.director,
          year: m.year,
          genre: m.genre,
          rating: parseFloat(m.rating) || 10,
          posterUrl: m.poster_url,
          backdropUrl: m.backdrop_url,
          personalReview: m.personal_review,
          formatBadge: m.format_badge,
          favoriteQuote: m.favorite_quote,
          addedAt: m.created_at ? new Date(m.created_at).toISOString().split('T')[0] : 'Hoje',
        }));

      const userComments = (allComments || [])
        .filter((c: any) => c.profile_user_id === p.id)
        .map((c: any) => ({
          id: c.id,
          authorId: c.author_id,
          authorName: c.author_name,
          authorHandle: c.author_handle,
          authorAvatar: c.author_avatar,
          authorBadge: c.author_badge,
          content: c.content,
          relatedMovieTitle: c.related_movie_title,
          createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : 'Hoje',
          likesCount: c.likes_count || 1,
        }));

      return {
        id: p.id,
        name: p.name,
        handle: p.handle,
        email: p.email,
        avatar: p.avatar,
        bannerUrl: p.banner_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
        bio: p.bio,
        favoriteGenres: p.favorite_genres || ['Ficção Científica', 'Drama'],
        location: p.location || 'Brasil',
        joinedDate: p.created_at
          ? new Date(p.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
          : '2024',
        movies: userMovies,
        guestbook: userComments,
        followersCount: 0,
        followingCount: 1,
      };
    });
  } catch (err) {
    console.error('Erro ao sincronizar usuários do Supabase:', err);
    return null;
  }
}

// 6. Cadastrar ou Atualizar Filme no Supabase
export async function persistMovieToSupabase(
  movie: Omit<Movie, 'id' | 'addedAt'>,
  userId: string,
  existingMovieId?: string
): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return null;

  try {
    const payload = {
      user_id: userId,
      title: movie.title,
      director: movie.director,
      year: movie.year,
      genre: movie.genre,
      rating: movie.rating,
      poster_url: movie.posterUrl,
      backdrop_url: movie.backdropUrl,
      personal_review: movie.personalReview,
      format_badge: movie.formatBadge,
      favorite_quote: movie.favoriteQuote,
    };

    if (existingMovieId) {
      const { data, error } = await client
        .from('movies')
        .update(payload)
        .eq('id', existingMovieId)
        .select()
        .single();
      if (error) throw error;
      return data?.id || existingMovieId;
    } else {
      const { data, error } = await client
        .from('movies')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data?.id || null;
    }
  } catch (err) {
    console.error('Erro ao persistir filme no Supabase:', err);
    return null;
  }
}

// 7. Remover Filme do Supabase
export async function deleteMovieFromSupabase(movieId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return false;

  try {
    const { error } = await client.from('movies').delete().eq('id', movieId);
    return !error;
  } catch (err) {
    console.error('Erro ao remover filme no Supabase:', err);
    return false;
  }
}

// 8. Inserir Recado no Mural (Supabase)
export async function persistGuestbookCommentToSupabase(
  comment: Omit<ProfileComment, 'id' | 'createdAt'>,
  profileUserId: string
): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return null;

  try {
    const { data, error } = await client
      .from('guestbook_comments')
      .insert({
        profile_user_id: profileUserId,
        author_id: comment.authorId.startsWith('user-') ? null : comment.authorId,
        author_name: comment.authorName,
        author_handle: comment.authorHandle,
        author_avatar: comment.authorAvatar,
        author_badge: comment.authorBadge,
        content: comment.content,
        related_movie_title: comment.relatedMovieTitle,
        likes_count: comment.likesCount || 1,
      })
      .select()
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (err) {
    console.error('Erro ao gravar recado no Supabase:', err);
    return null;
  }
}

// 9. Deletar Recado do Mural (Supabase)
export async function deleteGuestbookCommentFromSupabase(commentId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return false;

  try {
    const { error } = await client.from('guestbook_comments').delete().eq('id', commentId);
    return !error;
  } catch (err) {
    console.error('Erro ao remover recado no Supabase:', err);
    return false;
  }
}
