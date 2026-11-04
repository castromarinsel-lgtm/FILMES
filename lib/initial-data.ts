import { UserProfile, Movie } from '@/types/cinema';

export const POPULAR_PRESET_MOVIES: Omit<Movie, 'id' | 'addedAt'>[] = [
  {
    title: 'Interestelar',
    director: 'Christopher Nolan',
    year: 2014,
    genre: 'Ficção Científica',
    rating: 10,
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    personalReview: 'Uma jornada transcendental sobre amor, gravidade e tempo. A trilha sonora de Hans Zimmer ecoa para sempre.',
    formatBadge: 'IMAX',
    favoriteQuote: 'O amor é a única coisa que somos capazes de perceber que transcende as dimensões do tempo e do espaço.',
  },
  {
    title: 'Blade Runner 2049',
    director: 'Denis Villeneuve',
    year: 2017,
    genre: 'Cyberpunk / Sci-Fi',
    rating: 9.8,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
    personalReview: 'Fotografia magistral de Roger Deakins com neon vibrante e melancolia profunda. Cinema sensorial no ápice.',
    formatBadge: '4K HDR',
    favoriteQuote: 'Todas as melhores memórias são dela.',
  },
  {
    title: 'Cidade de Deus',
    director: 'Fernando Meirelles & Kátia Lund',
    year: 2002,
    genre: 'Drama / Crime',
    rating: 10,
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80',
    personalReview: 'O maior marco do cinema nacional moderno. Ritmo frenético, montagem revolucionária e atuações inesquecíveis.',
    formatBadge: '35mm',
    favoriteQuote: 'Se correr o bicho pega, se ficar o bicho come.',
  },
  {
    title: 'Parasita',
    director: 'Bong Joon-ho',
    year: 2019,
    genre: 'Suspense / Drama',
    rating: 9.9,
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    personalReview: 'Um roteiro arquitetado como um relógio suíço. Humor ácido e tensão que escala até o clímax estarrecedor.',
    formatBadge: '4K HDR',
    favoriteQuote: 'Você sabe que tipo de plano nunca falha? Nenhum plano.',
  },
  {
    title: 'O Fabuloso Destino de Amélie Poulain',
    director: 'Jean-Pierre Jeunet',
    year: 2001,
    genre: 'Comédia / Romance',
    rating: 9.5,
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
    personalReview: 'Uma ode à imaginação e aos pequenos prazeres da vida parisiense. Paleta de cores quente e inesquecível.',
    formatBadge: '35mm',
    favoriteQuote: 'São tempos difíceis para os sonhadores.',
  },
  {
    title: 'A Viagem de Chihiro',
    director: 'Hayao Miyazaki',
    year: 2001,
    genre: 'Animação / Fantasia',
    rating: 10,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1600&q=80',
    personalReview: 'Puro lirismo do Studio Ghibli. Uma metáfora deslumbrante sobre amadurecimento e identidade.',
    formatBadge: 'Criterion',
    favoriteQuote: 'Nada do que acontece é esquecido, mesmo que você não consiga lembrar.',
  },
  {
    title: 'Pulp Fiction: Tempo de Violência',
    director: 'Quentin Tarantino',
    year: 1994,
    genre: 'Crime / Humor Negro',
    rating: 9.7,
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80',
    personalReview: 'Diálogos cortantes, cronologia não linear e trilha sonora que virou patrimônio da cultura pop.',
    formatBadge: '35mm',
    favoriteQuote: 'Diga "o quê" mais uma vez! Eu te desafio!',
  },
  {
    title: 'Whiplash: Em Busca da Perfeição',
    director: 'Damien Chazelle',
    year: 2014,
    genre: 'Drama / Música',
    rating: 9.6,
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
    personalReview: 'A obsessão pela grandeza levada ao extremo psicológico. O solo final de bateria é de tirar o fôlego.',
    formatBadge: 'Dolby Atmos',
    favoriteQuote: 'Não há duas palavras mais prejudiciais na língua inglesa do que "bom trabalho".',
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-lucas',
    name: 'Lucas Ferreira',
    handle: 'lucasfilmico',
    email: 'lucas@cinelumina.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    bio: 'Cinéfilo convicto, aficionado por ficção científica, distopias neon e grandes diretores contemporâneos. Sempre pronto para debater sobre Nolan e Villeneuve.',
    favoriteGenres: ['Ficção Científica', 'Suspense', 'Cyberpunk', 'IMAX'],
    location: 'São Paulo, Brasil',
    joinedDate: 'Fevereiro de 2024',
    followersCount: 142,
    followingCount: 89,
    movies: [
      {
        id: 'mov-1',
        title: 'Interestelar',
        director: 'Christopher Nolan',
        year: 2014,
        genre: 'Ficção Científica',
        rating: 10,
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        personalReview: 'Meu filme favorito de todos os tempos. Assisti 4 vezes em IMAX e a cena da onda gigante ainda me faz prender a respiração.',
        formatBadge: 'IMAX',
        favoriteQuote: 'O amor transcende dimensões de tempo e espaço.',
        addedAt: '2024-03-12',
      },
      {
        id: 'mov-2',
        title: 'Blade Runner 2049',
        director: 'Denis Villeneuve',
        year: 2017,
        genre: 'Cyberpunk / Sci-Fi',
        rating: 9.9,
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        personalReview: 'A estética visual desse filme é incomparável. Roger Deakins entregou a melhor fotografia da década.',
        formatBadge: '4K HDR',
        favoriteQuote: 'Você nunca viu um milagre.',
        addedAt: '2024-03-20',
      },
      {
        id: 'mov-3',
        title: 'Whiplash: Em Busca da Perfeição',
        director: 'Damien Chazelle',
        year: 2014,
        genre: 'Drama / Música',
        rating: 9.5,
        posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        personalReview: 'Tensão do primeiro ao último minuto. O duelo entre Andrew e Fletcher é cinema em estado puro.',
        formatBadge: 'Dolby Atmos',
        favoriteQuote: 'Were you rushing or were you dragging?',
        addedAt: '2024-04-05',
      },
    ],
    guestbook: [
      {
        id: 'comm-1',
        authorId: 'user-beatriz',
        authorName: 'Beatriz Vasconcelos',
        authorHandle: 'bia.cinefilia',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        authorBadge: 'Crítica Verificada',
        content: 'Sensacional sua seleção de Sci-Fi! Interestelar em IMAX foi uma das maiores experiências da minha vida.',
        relatedMovieTitle: 'Interestelar',
        createdAt: 'Ontem às 18:30',
        likesCount: 14,
      },
      {
        id: 'comm-2',
        authorId: 'user-gabriel',
        authorName: 'Gabriel Sampaio',
        authorHandle: 'sampa_movies',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        authorBadge: 'Diretor Indie',
        content: 'Blade Runner 2049 é uma pintura em movimento. Muito bom gosto na sua página!',
        relatedMovieTitle: 'Blade Runner 2049',
        createdAt: 'Há 3 dias',
        likesCount: 8,
      },
    ],
  },
  {
    id: 'user-beatriz',
    name: 'Beatriz Vasconcelos',
    handle: 'bia.cinefilia',
    email: 'beatriz@cinelumina.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    bio: 'Pesquisadora de cinema, apaixonada por narrativas asiáticas, cinema autoral e suspense coreano. Escrevo ensaios sobre montagem e mise-en-scène.',
    favoriteGenres: ['Suspense', 'Drama Asiático', 'Cinema Autoral', 'Animação'],
    location: 'Belo Horizonte, Brasil',
    joinedDate: 'Janeiro de 2024',
    followersCount: 318,
    followingCount: 110,
    movies: [
      {
        id: 'mov-4',
        title: 'Parasita',
        director: 'Bong Joon-ho',
        year: 2019,
        genre: 'Suspense / Drama',
        rating: 10,
        posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
        personalReview: 'Perfeição de roteiro. Como a arquitetura da casa reflete as desigualdades sociais é aula de cinema.',
        formatBadge: '4K HDR',
        favoriteQuote: 'Dinheiro é como um ferro de passar, remove todos os vincos da vida.',
        addedAt: '2024-01-15',
      },
      {
        id: 'mov-5',
        title: 'A Viagem de Chihiro',
        director: 'Hayao Miyazaki',
        year: 2001,
        genre: 'Animação / Fantasia',
        rating: 10,
        posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        personalReview: 'Miyazaki construiu o conto de fadas definitivo do século XXI. Toda vez que revejo descubro uma nova metáfora.',
        formatBadge: 'Criterion',
        favoriteQuote: 'O rio sempre encontra seu caminho para o mar.',
        addedAt: '2024-02-10',
      },
      {
        id: 'mov-6',
        title: 'O Fabuloso Destino de Amélie Poulain',
        director: 'Jean-Pierre Jeunet',
        year: 2001,
        genre: 'Comédia / Romance',
        rating: 9.8,
        posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        personalReview: 'Coração quentinho e montagem poética. O filme que me fez querer estudar cinema na faculdade.',
        formatBadge: '35mm',
        favoriteQuote: 'A vida não é senão o ensaio interminável de uma peça que nunca se estreará.',
        addedAt: '2024-02-28',
      },
    ],
    guestbook: [
      {
        id: 'comm-3',
        authorId: 'user-lucas',
        authorName: 'Lucas Ferreira',
        authorHandle: 'lucasfilmico',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        authorBadge: 'Membro Fundador',
        content: 'Bia, sua lista é uma obra-prima de sensibilidade! A resenha de Chihiro resumiu com perfeição o sentimento.',
        relatedMovieTitle: 'A Viagem de Chihiro',
        createdAt: 'Ontem às 14:12',
        likesCount: 9,
      },
    ],
  },
  {
    id: 'user-gabriel',
    name: 'Gabriel Sampaio',
    handle: 'sampa_movies',
    email: 'gabriel@cinelumina.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80',
    bio: 'Diretor de curtas e produtor audiovisual. Defensor ferrenho de películas 35mm e da preservação histórica do cinema brasileiro.',
    favoriteGenres: ['Cinema Nacional', 'Crime', 'Clássicos', 'Neo-Noir'],
    location: 'Rio de Janeiro, Brasil',
    joinedDate: 'Março de 2024',
    followersCount: 205,
    followingCount: 140,
    movies: [
      {
        id: 'mov-7',
        title: 'Cidade de Deus',
        director: 'Fernando Meirelles & Kátia Lund',
        year: 2002,
        genre: 'Drama / Crime',
        rating: 10,
        posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        personalReview: 'A energia rítmica desse filme influenciou o cinema mundial dos anos 2000. Essencial para qualquer cineasta.',
        formatBadge: '35mm',
        favoriteQuote: 'Meu nome agora é Zé Pequeno, porra!',
        addedAt: '2024-03-01',
      },
      {
        id: 'mov-8',
        title: 'Pulp Fiction: Tempo de Violência',
        director: 'Quentin Tarantino',
        year: 1994,
        genre: 'Crime / Humor Negro',
        rating: 9.8,
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
        personalReview: 'Construção de diálogo impecável. O estilo pulp elevado a patamar cult lendário.',
        formatBadge: '35mm',
        favoriteQuote: 'Any time of the day is a good time for pie.',
        addedAt: '2024-03-18',
      },
    ],
    guestbook: [
      {
        id: 'comm-4',
        authorId: 'user-beatriz',
        authorName: 'Beatriz Vasconcelos',
        authorHandle: 'bia.cinefilia',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        authorBadge: 'Crítica Verificada',
        content: 'Cidade de Deus nunca perde o fôlego. Sempre bom ver cinéfilos valorizando nosso cinema com tanta paixão!',
        relatedMovieTitle: 'Cidade de Deus',
        createdAt: 'Hoje às 10:20',
        likesCount: 12,
      },
    ],
  },
];

export const GUEST_USER: UserProfile = {
  id: 'user-guest',
  name: 'Cinéfilo Visitante',
  handle: 'visitante',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
  bio: 'Novo membro visitante no CineLumina explorando o acervo da comunidade e catalogando meus filmes do coração.',
  favoriteGenres: ['Cinema Geral', 'Descobertas', 'Favoritos'],
  location: 'Brasil',
  joinedDate: 'Hoje',
  isGuest: true,
  followersCount: 1,
  followingCount: 3,
  movies: [
    {
      id: 'mov-guest-1',
      title: 'Interestelar',
      director: 'Christopher Nolan',
      year: 2014,
      genre: 'Ficção Científica',
      rating: 10,
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      personalReview: 'Meu primeiro filme cadastrado no CineLumina! Uma obra-prima emocionante.',
      formatBadge: 'IMAX',
      favoriteQuote: 'Não vá dócil nessa noite escura.',
      addedAt: '2024-04-10',
    },
  ],
  guestbook: [
    {
      id: 'comm-guest-welcome',
      authorId: 'user-lucas',
      authorName: 'Lucas Ferreira',
      authorHandle: 'lucasfilmico',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      authorBadge: 'Boas-vindas!',
      content: 'Bem-vindo ao CineLumina! Fique à vontade para explorar os perfis e comentar os filmes da galera!',
      createdAt: 'Agora mesmo',
      likesCount: 2,
    },
  ],
};

const STORAGE_KEY_USERS = 'cinelumina_users_v1';
const STORAGE_KEY_CURRENT_USER = 'cinelumina_current_user_v1';

export function getStoredUsers(): UserProfile[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse stored users:', err);
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: UserProfile[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save stored users:', err);
  }
}

export function getStoredCurrentUser(users: UserProfile[]): UserProfile {
  if (typeof window === 'undefined') return GUEST_USER;
  try {
    const currentId = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (currentId) {
      const found = users.find((u) => u.id === currentId);
      if (found) return found;
      if (currentId === GUEST_USER.id) return GUEST_USER;
    }
  } catch (err) {
    console.error('Failed to get current user:', err);
  }
  return GUEST_USER;
}

export function saveStoredCurrentUser(userId: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, userId);
  } catch (err) {
    console.error('Failed to save current user ID:', err);
  }
}
