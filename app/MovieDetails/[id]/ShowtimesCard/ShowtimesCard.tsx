import { Movie } from "@/types/movie";
//import React from "react";
import React, {useEffect, useState} from "react"
import { Card } from "react-bootstrap";
import styles from "./ShowtimesCard.module.css";
import { useRouter } from "next/navigation";

const ShowtimesCard = ({ movie }: { movie: Movie }) => {
  const router = useRouter();

  //remove when adding actual showtimes to DB
  //const fallbackShowtimes = [
  //{ id: "temp-1", time: "2:00 PM", date: "Today", hall: "Hall 1" },
  //{ id: "temp-2", time: "5:00 PM", date: "Today", hall: "Hall 1" },
  //{ id: "temp-3", time: "8:00 PM", date: "Today", hall: "Hall 1" },
//];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [showtimes, setShowtimes] = useState<any[]>([]);

useEffect(()=> {
  if (movie?.id){
    fetch(`/api/shows/${movie.id}`)
      .then((res) => res.json())
      .then((data) => setShowtimes(data))
      .catch((err) => console.error("Failed to fetch showtimes", err))
  }
}, [movie.id]);

/*  
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
    */

  //remove this block when showtimes added to DB
  //const showtimesToDisplay =
  //movie.showtimes && movie.showtimes.length > 0
  //  ? movie.showtimes
  //  : fallbackShowtimes;

    //change {showtimesToDisplay.map((showtime) => ( back to movie.showtimes.map((showtime) => (
    //when showtimes added
  return (
    <Card className="m-3 shadow-sm">
      <Card.Header>Showtimes</Card.Header>

      <Card.Body>
        <div className="d-flex flex-wrap gap-3">
          {showtimes.map((showtime) => (
            <Card
              key={showtime._id}
              className={`p-2 ${styles.hoverableCard}`}
              style={{
                width: "140px",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onClick={() =>
                router.push(
                  `/BookingPage?movieID=${movie._id}&movie=${encodeURIComponent(
                    movie.title
                  )}&time=${encodeURIComponent(
                    showtime.timeSlot
                  )}&date=${encodeURIComponent(new Date(showtime.date).toLocaleDateString('en-US',{timeZone: 'UTC'}))}`
                  + `&hall=${encodeURIComponent(showtime.showRoomId?.name)}`
                  + `&rows=${encodeURIComponent(showtime.showRoomId?.rows)}`
                  + `&seatsPerRow=${encodeURIComponent(showtime.showRoomId?.seatsPerRow)}`
                  + `&showId=${encodeURIComponent(showtime._id)}`
                )
              }
            >
              <Card.Body className="p-2 text-center">
                <div className="fw-bold">{showtime.timeSlot}</div>
                <div className="small text-muted">{new Date(showtime.date).toLocaleDateString('en-US',{timeZone:'UTC'})}</div>
                <div className="small">{showtime.showRoomId?.name}</div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ShowtimesCard;
