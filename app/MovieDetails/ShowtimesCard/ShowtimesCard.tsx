import { Movie } from "@/app/types/movie";
import React from "react";
import { Card } from "react-bootstrap";

const ShowtimesCard = ({ movie }: { movie: Movie }) => {

    // ✅ Conditional guard
    if (!movie.showtimes || movie.showtimes.length === 0) {
        return (
            <Card className="m-3 shadow-sm">
                <Card.Header>Showtimes</Card.Header>
                <Card.Body>
                    <p className="text-muted mb-0">No showtimes available.</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="m-3 shadow-sm">
            <Card.Header>Showtimes</Card.Header>

            <Card.Body>
                <div className="d-flex flex-wrap gap-3">
                    {movie.showtimes.map((showtime) => (
                        <Card
                            key={showtime.id}
                            className="p-2 showtime-card"
                            style={{
                                width: "140px",
                                cursor: "pointer",
                                transition: "0.2s",
                            }}
                            onClick={() => {
                                console.log("Selected showtime:", showtime);
                                // later → navigate to booking page
                                // router.push(`/booking/${showtime.id}`)
                            }}
                        >
                            <Card.Body className="p-2 text-center">
                                <div className="fw-bold">{showtime.time}</div>
                                <div className="small text-muted">{showtime.date}</div>
                                <div className="small">{showtime.hall}</div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
};

export default ShowtimesCard;
