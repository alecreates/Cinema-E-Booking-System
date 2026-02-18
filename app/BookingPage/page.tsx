"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";

const BookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const movie = searchParams.get("movie");
  const time = searchParams.get("time");
  const date = searchParams.get("date");

  const seats = Array.from({ length: 30 }, (_, i) => i + 1);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const toggleSeat = (seat: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  return (
    <Container fluid className="min-vh-100 bg-light py-4">

      {/* Back Header */}
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

              {/* spacer to balance layout */}
              <div style={{ width: "60px" }} />
            </Card.Header>
          </Card>
        </Col>
      </Row>

      {/* Movie Info */}
      <Row className="justify-content-center mb-3">
        <Col xs={11} md={10} lg={8}>
          <Card className="p-3 shadow-sm">
            <h5>{movie || "Movie Title"}</h5>
            <p className="text-muted mb-2">
              {date || "Date"} • {time || "Time"}
            </p>
            <Badge bg="secondary">Prototype</Badge>
          </Card>
        </Col>
      </Row>

      {/* Seat Selection */}
      <Row className="justify-content-center">
        <Col xs={11} md={10} lg={8}>
          <Card className="p-4 shadow-sm text-center">
            <h6 className="mb-3">Select Your Seats</h6>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: "10px",
                justifyItems: "center",
                marginBottom: "20px",
              }}
            >
              {seats.map((seat) => {
                const isSelected = selectedSeats.includes(seat);

                return (
                  <div
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "5px",
                      background: isSelected ? "#0d6efd" : "#6c757d",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    {seat}
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

            <Button variant="primary" disabled>
              Proceed to Payment
            </Button>

            <p className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>
              Not functional. Adding functionality in a later sprint.
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;