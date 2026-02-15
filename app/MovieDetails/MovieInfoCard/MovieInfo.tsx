import { Movie } from "@/app/types/movie";
import React from "react";
import { Card, Badge } from "react-bootstrap";

const MovieInfoCard = ({ movie }: { movie: Movie }) => (
    <Card className="m-3 shadow-sm h-100">
        <Card.Header>Movie Info</Card.Header>
        <Card.Body>
            <p><strong>Duration:</strong> {movie.duration} min</p>
            <p>
                <strong>Genre:</strong>{" "}
                {movie.genre.map((g) => (
                    <Badge bg="info" className="me-1" key={g}>{g}</Badge>
                ))}
            </p>
            <p><strong>Category:</strong> {movie.category}</p>
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Producer:</strong> {movie.producer}</p>
        </Card.Body>
    </Card>
);

export default MovieInfoCard;
