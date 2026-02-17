import { Movie } from "../../types/movie";

export const mockMovie: Movie = {
    status: "now_showing",
    id: "m1",
    title: "Interstellar",
    description: "A team travels through a wormhole...",
    synopsis: "In the future, Earth is becoming uninhabitable...",
    rating: "PG-13",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E?si=mRK4qhN6rnr8ABrW",
    duration: 169,
    genre: ["Sci-Fi", "Drama"],
    category: "Science Fiction",
  
    director: "Christopher Nolan",
    producer: "Emma Thomas",
  
    cast: [
      { name: "Matthew McConaughey", role: "Cooper" },
      { name: "Anne Hathaway", role: "Brand" }
    ],
  
    reviews: [
      {
        id: "r1",
        author: "Film Critic Weekly",
        rating: 5,
        comment: "A masterpiece of modern sci-fi.",
        date: "2026-02-10"
      }
    ],
  
    showtimes: [
      { id: "s1", date: "2026-02-13", time: "5:30", hall: "Hall 1" },
      { id: "s3", date: "2026-02-13", time: "7:30", hall: "Hall 1" },
      { id: "s2", date: "2026-02-13", time: "6:30", hall: "Hall 2" }
    ]
};
