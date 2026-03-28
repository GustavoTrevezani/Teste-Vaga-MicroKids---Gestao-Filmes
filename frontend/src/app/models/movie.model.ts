// Movie model from Prisma
export interface Movie {
  id: string;
  title: string;
  year: string;
  type: string;
  poster?: string;
  plot?: string;
}

// UserMovie relation (Favorite/Watched)
export interface UserMovie {
  id: string;
  userId: string;
  movieId: string;
  movie: Movie;
}

// Ranking item for admin endpoints
export interface RankingItem {
  movie: Movie;
  count: number;
}

// User with their movies (for admin user search)
export interface UserWithMovies {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  favorites: UserMovie[];
  watched: UserMovie[];
}
