import { Movie } from "../types/movie";

export const mockMovie: Movie = {
    status: "now_showing",
    id: "m1",
    title: "Interstellar",
    description: "A team travels through a wormhole...",
    synopsis: "In the future, Earth is becoming uninhabitable...",
    rating: "PG-13",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    trailerUrl: "https://youtube.com/watch?v=zSWdZVtXT7E",
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
  
    trailer: 
      {
        imageUrl: "/trailers/interstellar-thumb.jpg",
        videoUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
        provider: "youtube"
      },
  
    showtimes: [
      { id: "s1", date: "2026-02-13", time: "19:30", hall: "Hall 1" }
    ]
};
