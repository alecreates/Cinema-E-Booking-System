import { Movie } from "@/types/movie";
import React from "react";
import { Card } from "react-bootstrap";
import styles from "./ShowtimesCard.module.css";
import { useRouter } from "next/navigation";

const ShowtimesCard = ({ movie }: { movie: Movie }) => {
  const router = useRouter();

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
              className={`p-2 ${styles.hoverableCard}`}
              style={{
                width: "140px",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onClick={() =>
                router.push(
                  `/BookingPage?movie=${encodeURIComponent(
                    movie.title
                  )}&time=${encodeURIComponent(
                    showtime.time
                  )}&date=${encodeURIComponent(showtime.date)}`
                )
              }
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
