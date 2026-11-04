export interface Movie {
  id: string;
  title: string;
  director: string;
  year: number;
  genre: string;
  rating: number; // 1 to 10
  posterUrl: string;
  backdropUrl?: string;
  personalReview?: string;
  formatBadge?: '4K HDR' | 'IMAX' | '35mm' | 'Dolby Atmos' | 'Criterion';
  favoriteQuote?: string;
  addedAt: string;
}

export interface ProfileComment {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  relatedMovieTitle?: string;
  createdAt: string;
  likesCount?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email?: string;
  avatar: string;
  bannerUrl: string;
  bio: string;
  favoriteGenres: string[];
  location: string;
  joinedDate: string;
  isGuest?: boolean;
  movies: Movie[];
  guestbook: ProfileComment[];
  followersCount: number;
  followingCount: number;
}

export type ActiveView = 'feed' | 'profile' | 'community' | 'login' | 'register';
