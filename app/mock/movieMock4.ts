import { Movie } from "@/types/movie";

export const mockMovie4: Movie = {
    status: "coming_soon",
    id: "m4",
    title: "Dune: Part Two",
    description: "Paul Atreides unites with the Fremen...",
    synopsis: "Paul Atreides joins forces with Chani and the Fremen while seeking revenge...",
    rating: "PG-13",
    posterUrl: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    trailerUrl: "https://www.youtube.com/embed/U2Qp5pL3ovA",
    duration: 165,
    genre: ["Sci-Fi", "Adventure", "Drama"],
    category: "Science Fiction",

    director: "Denis Villeneuve",
    producer: "Mary Parent",

    cast: [
        { name: "Timothée Chalamet", role: "Paul Atreides" },
        { name: "Zendaya", role: "Chani" },
        { name: "Rebecca Ferguson", role: "Lady Jessica" }
    ],

    reviews: [],

    showtimes: [
        { id: "s8", date: "2026-03-01", time: "6:30", hall: "Hall 1" },
        { id: "s9", date: "2026-03-01", time: "9:30", hall: "Hall 2" }
    ]
};