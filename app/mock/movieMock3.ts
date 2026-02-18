import { Movie } from "@/types/movie";

export const mockMovie3: Movie = {
    status: "now_showing",
    id: "m3",
    title: "The Dark Knight",
    description: "Batman faces the Joker, a criminal mastermind...",
    synopsis: "With the help of Lt. Jim Gordon and Harvey Dent, Batman sets out to dismantle...",
    rating: "PG-13",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
    duration: 152,
    genre: ["Action", "Crime", "Drama"],
    category: "Action",

    director: "Christopher Nolan",
    producer: "Emma Thomas",

    cast: [
        { name: "Christian Bale", role: "Bruce Wayne / Batman" },
        { name: "Heath Ledger", role: "Joker" },
        { name: "Aaron Eckhart", role: "Harvey Dent" }
    ],

    reviews: [
        {
            id: "r3",
            author: "Gotham Reviews",
            rating: 5,
            comment: "One of the greatest superhero films ever made.",
            date: "2026-02-12"
        }
    ],

    showtimes: [
        { id: "s6", date: "2026-02-15", time: "6:00", hall: "Hall 1" },
        { id: "s7", date: "2026-02-15", time: "9:00", hall: "Hall 2" }
    ]
};
