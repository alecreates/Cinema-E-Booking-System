import { Movie } from "@/types/movie";
import { mockMovie } from "@/app/mock/movieMock";
import { mockMovie2 } from "@/app/mock/movieMock2";
import { mockMovie3 } from "@/app/mock/movieMock3";
import { mockMovie4 } from "@/app/mock/movieMock4";

// CONNECT WITH DB IN THIS FILE

// implement for deliverable 1
export async function getAllMovies() {

    // DB call later, for now adding mock movies

    const movies: Movie[] = [
        mockMovie,
        mockMovie2,
        mockMovie3,
        mockMovie4,
    ];

    return movies;
}

// implement for deliverable 1
export async function getMovieById(id: string): Promise<Movie | null> {

    // DB call later, for now using mock movies array

    const movies: Movie[] = [
        mockMovie,
        mockMovie2,
        mockMovie3,
        mockMovie4,
    ];

    const movie = movies.find((m) => m.id === id);
    return movie || null;
}


export async function createMovie(data: Movie) {
    // DB insert later
    return data;
}
