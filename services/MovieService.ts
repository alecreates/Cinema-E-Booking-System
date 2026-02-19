import pool from "./db";

//frotnedn mapping 
function mapRow(row: any) {
  return {
    ...row,
    genre: row.genre ? row.genre.split(",").map((g: string) => g.trim()) : [],
    posterUrl: row.poster_url,
    trailerUrl: row.trailer_url,
  };
}

export async function getAllMovies() {
  const [rows] = await pool.query("SELECT * FROM movies");
  // @ts-ignore
  return rows.map(mapRow);
}
//
export async function getMovieById(id: string) {
  const [rows] = await pool.query("SELECT * FROM movies WHERE id = ?", [id]);
  // @ts-ignore
  if (!rows.length) return null;
  // @ts-ignore
  return mapRow(rows[0]);
}

// frontend -> DB insert
export async function createMovie(movie: any) {
  const genreString = Array.isArray(movie.genre)
    ? movie.genre.join(",")
    : (movie.genre ?? "");

  const poster_url = movie.poster_url ?? movie.posterUrl ?? "";
  const trailer_url = movie.trailer_url ?? movie.trailerUrl ?? "";
  const show_date = movie.show_date ?? movie.showDate ?? null;

  await pool.query(
    `INSERT INTO movies
      (id, title, description, synopsis, rating, poster_url, trailer_url, duration, genre, status, show_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      movie.id,
      movie.title,
      movie.description ?? "",
      movie.synopsis ?? "",
      movie.rating ?? "",
      poster_url,
      trailer_url,
      movie.duration ?? 0,
      genreString,
      movie.status,
      show_date,
    ]
  );

  // return in frontend format
  return await getMovieById(movie.id);
}
