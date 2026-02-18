import { Movie } from "../../types/movie";

export const mockMovie2: Movie = {
    status: "now_showing",
    id: "m2",
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing tech...",
    synopsis: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction...",
    rating: "PG-13",
    posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    duration: 148,
    genre: ["Sci-Fi", "Action", "Thriller"],
    category: "Science Fiction",

    director: "Christopher Nolan",
    producer: "Emma Thomas",

    cast: [
        { name: "Leonardo DiCaprio", role: "Cobb" },
        { name: "Joseph Gordon-Levitt", role: "Arthur" },
        { name: "Elliot Page", role: "Ariadne" }
    ],

    reviews: [
        {
            id: "r2",
            author: "Cinema Today",
            rating: 5,
            comment: "Mind-bending and visually stunning.",
            date: "2026-02-11"
        }
    ],

    showtimes: [
        { id: "s4", date: "2026-02-14", time: "5:00", hall: "Hall 2" },
        { id: "s5", date: "2026-02-14", time: "8:00", hall: "Hall 1" }
    ]
};