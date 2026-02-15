export type MovieStatus = "now_showing" | "coming_soon";

export type Showtime = {
    id: string;
    date: string;      // "2026-02-13"
    time: string;      // "19:30"
    hall: string;
};

export type Review = {
    id: string;
    author: string;
    rating: number;    // 1–5 or 1–10
    comment: string;
    date: string;
};

export type CastMember = {
    name: string;
    role: string;      // character name
};

export type Trailer = {
    imageUrl: string;  // trailer thumbnail
    videoUrl: string;  // embed or video URL
    provider?: "youtube" | "vimeo" | "local";
  };

export type Movie = {
    status: MovieStatus;
    id: string;
    title: string;
    description: string;
    synopsis: string;
    rating: string;
    posterUrl: string;
    trailerUrl: string;
    duration: number;
    genre: string[];
    showtimes: Showtime[];

    category: string;      

    cast: CastMember[];    
    director: string;
    producer: string

    reviews: Review[];

    trailer: Trailer;
};