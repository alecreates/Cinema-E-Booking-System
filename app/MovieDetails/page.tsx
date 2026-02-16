"use client";
import { useEffect, useState } from "react";
import { Movie } from "../types/movie";
import MovieHeader from "./MovieHeader/MovieHeader";
import { mockMovie } from "../mock/movieMock";
import { Card } from "react-bootstrap";
import MovieSynopsis from "./MovieSynopsisCard/MovieSynopsis";
import MovieInfoCard from "./MovieInfoCard/MovieInfo";
import Cast from "./CastCard/Cast";
import TrailerCard from "./TrailerCard/page";
import ShowtimesCard from "./ShowtimesCard/ShowtimesCard";
import { useRouter } from "next/navigation";


const MovieDetails = () => {
  const router = useRouter();

  useEffect(() => {
    // fetch actual movies here when API is working
  }, []);

  return (
    <>

      <Card className="shadow-sm ">

        <Card.Header className="d-flex align-items-center justify-content-between">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => router.push("/HomePage")}
          >
            ← Back
          </button>

          <span className="mx-auto fw-bold">Movie Details</span>

          {/* spacer to balance layout */}
          <div style={{ width: "60px" }} />
        </Card.Header>

        <div className="d-flex flex-wrap align-items-stretch">
          {/* Movie Header */}
          <div className="flex-shrink-0" style={{ minWidth: "200px" }}>
            <MovieHeader movie={mockMovie} />
          </div>

          {/* Movie Info */}
          <div className="flex-grow-1">
            <MovieInfoCard movie={mockMovie} />
          </div>

          <div className="flex-grow-1">
            <MovieSynopsis movie={mockMovie} />
          </div>
        </div>

        <TrailerCard movie={mockMovie}></TrailerCard>
        <ShowtimesCard movie={mockMovie}></ShowtimesCard>

      </Card>


      {/* other components */}
    </>
  );
};


export default MovieDetails;