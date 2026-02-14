export type Showtime = {
    id: string;
    date: string;      // "2026-02-13"
    time: string;      // "19:30"
    hall: string;
  };

export type Movie = {
    id: string;
    title: string;
    description: string;
    rating: string;
    posterUrl: string;
    trailerUrl: string;
    duration: number;
    genre: string[];
    showtimes: Showtime[];
  };