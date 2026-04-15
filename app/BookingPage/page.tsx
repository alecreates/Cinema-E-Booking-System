"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Alert, Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";

const PRICES = {
  adult: 12.99,
  child: 8.99,
  senior: 9.99,
};

const BookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieID = searchParams.get("movieID");
  const movie = searchParams.get("movie");
  const time = searchParams.get("time");
  const date = searchParams.get("date");
  const hall = searchParams.get("hall");
  const rows = searchParams.get("rows");
  const seatsPerRow = searchParams.get("seatsPerRow");
  const showId = searchParams.get("showId");
  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });
const [seats, setSeats] = useState<any[]>([]);
const [bookedSeatIds, setBookedSeatIds] = useState<string[]>([]);

useEffect(() => {
    if (showId) {
        fetch(`/api/seats/${showId}`)
            .then((res) => res.json())
            .then((data) => {
                setSeats(data.seats);
                const ids = data.tickets.map((t: any) => t.seatId.toString());
                console.log("bookedSeatIds:", ids);
                console.log("seat ids:", data.seats.map((s: any) => s._id.toString()));
                setBookedSeatIds(data.tickets.map((t: any) => t.seatId.toString()));
            })
            .catch((err) => console.error("Failed to fetch seats", err));
    }
}, [showId]);
  //const seats: string[] = [];
  //for(let i = 0; i < Number(rows); i ++){
    //for(let j = 0; j < Number(seatsPerRow); j ++){
      //const letter = `${String.fromCharCode(65 + i)}${j+1}`;
      //seats.push(letter)

    //}
  //}
  

    
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const updateTicket = (type: keyof typeof tickets, value: number) => {
    setTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  const total = useMemo(() => {
    return (
      tickets.adult * PRICES.adult +
      tickets.child * PRICES.child +
      tickets.senior * PRICES.senior
    );
  }, [tickets]);

  const ticketCount = useMemo(() => {
    return tickets.adult + tickets.child + tickets.senior;
  }, [tickets]);

  const seatSelectionError =
    ticketCount === 0
      ? "Select at least one ticket to continue."
      : selectedSeats.length !== ticketCount
        ? `Please select ${ticketCount} seat${ticketCount === 1 ? "" : "s"} for your order.`
        : "";

  const handleProceedToCheckout = () => {
    if (seatSelectionError) {
      return;
    }

    const params = new URLSearchParams({
      movieID: movieID || "Movie ID",
      movie: movie || "Movie Title",
      time: time || "Time",
      date: date || "Date",
      hall: hall || "Main Hall",
      rows: rows || "rows",
      seatsPerRow: seatsPerRow || "seatsPerRow",
      showId: showId || "showId",
      seats: selectedSeats.join(","),
      adult: String(tickets.adult),
      child: String(tickets.child),
      senior: String(tickets.senior),
    });

    router.push(`/Checkout?${params.toString()}`);
  };

  return (
    <Container fluid className="min-vh-100 bg-light py-4">
      <Row className="justify-content-center mb-3">
        <Col xs={11} md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex align-items-center justify-content-between">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => router.back()}
              >
                ← Back
              </button>

              <span className="mx-auto fw-bold">Booking</span>

              <div style={{ width: "60px" }} />
            </Card.Header>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-3">
        <Col xs={11} md={10} lg={8}>
          <Card className="p-3 shadow-sm">
            <h5>{movie || "Movie Title"}</h5>
            <p className="text-muted mb-2">
              {date || "Date"} • {time || "Time"}
            </p>
            <p className="text-muted mb-2">{hall || "Main Hall"}</p>
            <Badge bg="secondary">Prototype</Badge>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-3">
        <Col xs={11} md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <h6 className="mb-3">Select Tickets</h6>

            <Row className="g-3">
              <Col md={4}>
                <Form.Label>
                  Adult (${PRICES.adult.toFixed(2)})
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={tickets.adult}
                  onChange={(e) =>
                    updateTicket("adult", Number(e.target.value))
                  }
                />
              </Col>

              <Col md={4}>
                <Form.Label>
                  Child (${PRICES.child.toFixed(2)})
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={tickets.child}
                  onChange={(e) =>
                    updateTicket("child", Number(e.target.value))
                  }
                />
              </Col>

              <Col md={4}>
                <Form.Label>
                  Senior (${PRICES.senior.toFixed(2)})
                </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={tickets.senior}
                  onChange={(e) =>
                    updateTicket("senior", Number(e.target.value))
                  }
                />
              </Col>
            </Row>

            <hr />

            <p className="text-muted mb-2">
              Tickets selected: <strong>{ticketCount}</strong>
            </p>
            <h6>Total: ${total.toFixed(2)}</h6>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={11} md={10} lg={8}>
          <Card className="p-4 shadow-sm text-center">
            <h6 className="mb-3">Select Your Seats</h6>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)`,
                gap: "10px",
                justifyItems: "center",
                marginBottom: "20px",
              }}
            >
              {seats.map((seat) => {
                const isSelected = selectedSeats.includes(`${seat.row}${seat.number}`);

                return (
                  <div
                    key={seat._id}
                    onClick={() => {
                      if (!bookedSeatIds.includes(seat._id.toString())) {
                        toggleSeat(`${seat.row}${seat.number}`);
                      }
                    }}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "5px",
                      background: isSelected ? "#0d6efd" : bookedSeatIds.includes(seat._id.toString()) ? "#dc3545" : "#6c757d",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      cursor: bookedSeatIds.includes(seat._id.toString()) ? "not-allowed" : "pointer",
                    }}
                  >
                    {seat.row}{seat.number}
                  </div>
                );
              })}
            </div>

            <p className="mb-2">
              Selected Seats:{" "}
              {selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "None"}
            </p>

            {seatSelectionError && (
              <Alert variant="warning" className="py-2 text-start">
                {seatSelectionError}
              </Alert>
            )}

            <Button variant="primary" onClick={handleProceedToCheckout} disabled={!!seatSelectionError}>
              Proceed to Checkout
            </Button>

            <p className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>
              Continue to review your order summary and confirm the email address for this booking.
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;
