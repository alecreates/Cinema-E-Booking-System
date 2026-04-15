"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

type TicketType = "adult" | "child" | "senior";

const PRICE_MAP: Record<TicketType, number> = {
  adult: 12.99,
  child: 8.99,
  senior: 9.99,
};

const TICKET_LABELS: Record<TicketType, string> = {
  adult: "Adult",
  child: "Child",
  senior: "Senior",
};

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useUser();

  const movie = searchParams.get("movie") || "Movie Title";
  const movieID = searchParams.get("movieID") || "Movie ID";
  const date = searchParams.get("date") || "Date";
  const time = searchParams.get("time") || "Time";
  const hall = searchParams.get("hall") || "Main Hall";
  const seats = searchParams.get("seats")?.split(",").filter(Boolean) || [];
  const showId = searchParams.get("showId") || "showId";
  const seatId = searchParams.get("seatId")?.split(",").filter(Boolean) || [];


  const ticketCounts = useMemo(
    () => ({
      adult: Number(searchParams.get("adult") || 0),
      child: Number(searchParams.get("child") || 0),
      senior: Number(searchParams.get("senior") || 0),
    }),
    [searchParams]
  );

  const subtotal = useMemo(
    () =>
      ticketCounts.adult * PRICE_MAP.adult +
      ticketCounts.child * PRICE_MAP.child +
      ticketCounts.senior * PRICE_MAP.senior,
    [ticketCounts]
  );

  const [email, setEmail] = useState(currentUser?.email || "");
  const [error, setError] = useState("");

  const ticketSummary = (Object.keys(ticketCounts) as TicketType[])
    .filter((type) => ticketCounts[type] > 0)
    .map((type) => ({
      type,
      count: ticketCounts[type],
      unitPrice: PRICE_MAP[type],
      label: TICKET_LABELS[type],
    }));

  const handleProceedToPayment = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please confirm an email address before proceeding.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const params = new URLSearchParams({
      movieID,
      movie,
      date,
      time,
      hall,
      showId,
      seatId: seatId.join(","),
      seats: seats.join(","),
      adult: String(ticketCounts.adult),
      child: String(ticketCounts.child),
      senior: String(ticketCounts.senior),
      subtotal: subtotal.toFixed(2),
      email: email.trim(),
    });

    router.push(`/PaymentPage?${params.toString()}`);
  };

  return (
    <Container fluid className="min-vh-100 bg-light py-4">
      <Row className="justify-content-center">
        <Col xs={11} md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex align-items-center justify-content-between">
              <Button variant="outline-secondary" size="sm" onClick={() => router.back()}>
                Back
              </Button>
              <span className="fw-bold">Order Summary</span>
              <div style={{ width: 76 }} />
            </Card.Header>

            <Card.Body className="p-4">
              <Row className="g-4">
                <Col md={7}>
                  <h4 className="mb-3">{movie}</h4>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="px-0 d-flex justify-content-between">
                      <span>Showtime</span>
                      <strong>{date} at {time}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 d-flex justify-content-between">
                      <span>Auditorium</span>
                      <strong>{hall}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 d-flex justify-content-between">
                      <span>Selected seats</span>
                      <strong>{seats.join(", ")}</strong>
                    </ListGroup.Item>
                    {ticketSummary.map(({ type, label, count, unitPrice }) => (
                      <ListGroup.Item
                        key={type}
                        className="px-0 d-flex justify-content-between"
                      >
                        <span>{label} tickets</span>
                        <strong>
                          {count} x ${unitPrice.toFixed(2)}
                        </strong>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item className="px-0 d-flex justify-content-between">
                      <span>Total before tax</span>
                      <strong>${subtotal.toFixed(2)}</strong>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>

                <Col md={5}>
                  <Card className="bg-body-tertiary border-0">
                    <Card.Body>
                      <h5 className="mb-3">Email Confirmation</h5>
                      <p className="text-muted small">
                        We retrieved your saved email. You can keep it or enter a different one
                        before continuing to payment.
                      </p>

                      <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                        />
                      </Form.Group>

                      {error && (
                        <Alert variant="danger" className="py-2">
                          {error}
                        </Alert>
                      )}

                      <Button
                        className="w-100"
                        onClick={handleProceedToPayment}
                      >
                        Proceed to Payment
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
