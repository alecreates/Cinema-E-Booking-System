import { Movie } from "@/types/movie";

// CONNECT WITH DB IN THIS FILE

// implement for deliverable 1
export async function getAllMovies() {
    // DB call later
    return [];
}

// implement for deliverable 1
export async function getMovieById(id: string): Promise<Movie | null> {
    return null;
}



export async function createMovie(data: Movie) {
    // DB insert later
    return data;
}
