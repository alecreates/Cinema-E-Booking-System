import React from "react";
import { Row, Col, Button, Badge } from "react-bootstrap";
import { Movie } from "../types/movie";

const MovieHeader = ({ movie }: { movie: Movie }) => {
    return (
        <Row className="mb-4">
            <Col md={4}>
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="img-fluid rounded shadow"
                />
            </Col>

            <Col md={8}>
                <h2>{movie.title}</h2>
                <Badge bg="warning" text="dark">{movie.rating}</Badge>

                <p className="mt-3">{movie.description}</p>

                <Button variant="danger">
                    ▶ Watch Trailer
                </Button>
            </Col>
        </Row>
    );
};

export default MovieHeader;
