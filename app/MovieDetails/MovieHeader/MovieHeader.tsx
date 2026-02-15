import React from "react";
import { Card, Image, Badge, Button } from "react-bootstrap";
import { Movie } from "../../types/movie";

const MovieHeader = ({ movie }: { movie: Movie }) => {
    return (
        <Card className="m-3 shadow-sm h-100">
            <div className="d-flex align-items-center">

                {/* Poster */}
                <div style={{ width: "180px", flexShrink: 0 }}>
                    <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="img-fluid rounded-start m-3"
                        style={{
                            objectFit: "cover",
                            width: "100%",
                        }}
                    />
                </div>

                {/* Text Content */}
                <div className="flex-grow-1 px-3 py-2 m-3">

                    <div className="d-flex align-items-center justify-content-between">
                        <h5 className="mb-1">{movie.title}</h5>
                    </div>

                    {movie.rating && (
                        <Badge pill bg="warning" text="dark" className="mb-1">
                            {movie.rating}
                        </Badge>
                    )}

                    <p className="text-muted small mb-2">
                        {movie.description}
                    </p>

                    <Button variant="danger" size="sm">
                        ▶ Watch Trailer
                    </Button>

                </div>
            </div>
        </Card>
    );
};

export default MovieHeader;
