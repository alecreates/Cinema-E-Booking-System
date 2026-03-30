"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/types/movie";
import { Card } from "react-bootstrap";
import { useRouter, useParams } from "next/navigation";
import MovieHeader from "./MovieHeader/MovieHeader";
import MovieInfoCard from "./MovieInfoCard/MovieInfo";
import MovieSynopsis from "./MovieSynopsisCard/MovieSynopsis";
import TrailerCard from "./TrailerCard/page";
import ShowtimesCard from "./ShowtimesCard/ShowtimesCard";

const MovieDetails = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  //remove when showtimes are added to database
  const showtimes = ["2:00 PM", "5:00 PM", "8:00 PM"];

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);

        console.log("movie with id:", id)

        if (!res.ok) throw new Error("Failed to fetch movie");

        const json = await res.json();
        setMovie(json);
      } catch (err) {
        console.error("Error loading movie:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  if (loading) return <p className="text-center">Loading movie...</p>;
  if (!movie) return <p className="text-center">Movie not found</p>;

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex align-items-center justify-content-between">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => router.push("/HomePage")}
          >
            ← Back
          </button>

          <span className="mx-auto fw-bold">Movie Details</span>
          <div style={{ width: "60px" }} />
        </Card.Header>

        <div className="d-flex flex-wrap align-items-stretch">
          <div className="flex-shrink-0" style={{ minWidth: "200px" }}>
            <MovieHeader movie={movie} />
          </div>

          <div className="flex-grow-1">
            <MovieInfoCard movie={movie} />
          </div>

          <div className="flex-grow-1">
            <MovieSynopsis movie={movie} />
          </div>
        </div>

        <TrailerCard movie={movie} />
        <ShowtimesCard movie={movie} />
      </Card>
    </>
  );
};

export default MovieDetails;
