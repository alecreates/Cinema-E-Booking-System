import { Movie } from "@/app/types/movie";
import React from "react";
import { Card } from "react-bootstrap";

const MovieSynopsis = ({ movie }: { movie: Movie }) => (
    <Card className="m-3 shadow-sm">
        <Card.Header>Synopsis</Card.Header>
        <Card.Body>
            <Card.Text>{movie.synopsis}</Card.Text>
        </Card.Body>
    </Card>
);

export default MovieSynopsis;
