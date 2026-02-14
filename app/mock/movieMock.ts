import { Movie } from "../types/movie";

export const mockMovie: Movie = {
  id: "1",
  title: "Interstellar",
  description: "A team of explorers travel through a wormhole in space...",
  rating: "PG-13",
  posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
  duration: 169,
  genre: ["Sci-Fi", "Drama", "Adventure"],
  showtimes: [
    { id: "s1", date: "2026-02-13", time: "18:00", hall: "1" },
    { id: "s2", date: "2026-02-13", time: "21:30", hall: "2" },
    { id: "s3", date: "2026-02-14", time: "17:00", hall: "1" },
  ],
};
