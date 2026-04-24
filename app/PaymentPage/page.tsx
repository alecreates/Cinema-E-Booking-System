"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, ListGroup, Row, Spinner } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { paymentFacade, SavedCard, TicketType } from "@/lib/payment/PaymentFacade";

const TICKET_LABELS: Record<TicketType, string> = {
  adult: "Adult",
  child: "Child",
  senior: "Senior",
};

const getCurrentTimestamp = () => new Date().getTime();

const formatLockTime = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useUser();

  const movie = searchParams.get("movie") || "Movie Title";
  const movieID = searchParams.get("movieID");
  const date = searchParams.get("date") || "Date";
  const time = searchParams.get("time") || "Time";
  const hall = searchParams.get("hall") || "Main Hall";
  const email = searchParams.get("email") || "";
  const seats = searchParams.get("seats")?.split(",").filter(Boolean) || [];
  const subtotal = searchParams.get("subtotal") || "0.00";
  const showId = searchParams.get("showId");
  const seatId = searchParams.get("seatId")?.split(",").filter(Boolean) || [];
  const lockExpiresAt = Number(searchParams.get("lockExpiresAt") || 0);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [loadingCards, setLoadingCards] = useState(true);
  const [cardsError, setCardsError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  const tickets = (["adult", "child", "senior"] as TicketType[])
    .map((type) => ({
      type,
      count: Number(searchParams.get(type) || 0),
    }))
    .filter(({ count }) => count > 0);

  const selectedCard = useMemo(
    () => cards.find((card) => card._id === selectedCardId) || null,
    [cards, selectedCardId]
  );

  useEffect(() => {
    const fetchCards = async () => {
      if (!currentUser?.id) {
        setLoadingCards(false);
        setCardsError("Sign in to view saved payment methods.");
        return;
      }

      try {
        setLoadingCards(true);
        setCardsError("");

        const data = await paymentFacade.getSavedPaymentMethods(currentUser.id);
        setCards(data);
        if (data.length > 0) {
          setSelectedCardId(data[0]._id);
        }
      } catch (error) {
        console.error("Failed to load cards:", error);
        setCardsError("Unable to load saved payment methods right now.");
      } finally {
        setLoadingCards(false);
      }
    };

    fetchCards();
  }, [currentUser]);

  useEffect(() => {
    if (!lockExpiresAt) return;

    const updateTimer = () => {
      setLockTimeRemaining(lockExpiresAt - getCurrentTimestamp());
    };

    updateTimer();
    const intervalId = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(intervalId);
  }, [lockExpiresAt]);

  const handleCheckout = async () => {
    setCheckoutError("");

    setIsSubmitting(true);

    try {
      await paymentFacade.processCheckout({
        currentUser,
        movieId: movieID,
        movieTitle: movie,
        showDate: date,
        showTime: time,
        hall,
        email,
        subtotal,
        showId,
        seatIds: seatId,
        selectedSeats: seats,
        selectedCardId,
        selectedCard,
        lockExpiresAt,
        tickets,
      });
      setEmailSent(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "We couldn't complete checkout. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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
              <span className="fw-bold">Payment Processing</span>
              <div style={{ width: 76 }} />
            </Card.Header>
            <Card.Body className="p-4">
              {emailSent && (
                <Alert variant="success">
                  A confirmation email has been sent to <strong>{email}</strong>.
                </Alert>
              )}

              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div>
                  <h4 className="mb-1">Secure Payment</h4>
                  <p className="text-muted mb-0">
                    Review your order details below before completing payment for this booking.
                  </p>
                </div>
                <Badge bg="warning" text="dark">
                  Payment Step
                </Badge>
              </div>

              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span>Movie</span>
                  <strong>{movie}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span>Showtime</span>
                  <strong>{date} at {time}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span>Auditorium</span>
                  <strong>{hall}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span>Seats</span>
                  <strong>{seats.join(", ")}</strong>
                </ListGroup.Item>
                {tickets.map(({ type, count }) => (
                  <ListGroup.Item
                    key={type}
                    className="px-0 d-flex justify-content-between"
                  >
                    <span>{TICKET_LABELS[type]} tickets</span>
                    <strong>{count}</strong>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span>Email for confirmation</span>
                  <strong>{email || "Not provided"}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span>Total before tax</span>
                  <strong>${subtotal}</strong>
                </ListGroup.Item>
              </ListGroup>

              {lockExpiresAt > 0 && lockTimeRemaining > 0 && !emailSent && (
                <Alert variant="info" className="mt-3 mb-0">
                  Seats are reserved for this session for {formatLockTime(lockTimeRemaining)}.
                </Alert>
              )}

              {lockExpiresAt > 0 && lockTimeRemaining <= 0 && !emailSent && (
                <Alert variant="warning" className="mt-3 mb-0">
                  Your seat reservation expired. Go back to select seats again.
                </Alert>
              )}

              <Card className="mt-4 border-0 bg-body-tertiary">
                <Card.Body>
                  <p className="mb-2 fw-semibold">Payment Details</p>
                  <p className="text-muted">
                    Choose one of your saved payment methods to complete checkout.
                  </p>

                  {loadingCards && (
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <Spinner animation="border" size="sm" />
                      <span>Loading saved payment methods...</span>
                    </div>
                  )}

                  {!loadingCards && cardsError && (
                    <Alert variant="warning" className="mb-0">
                      {cardsError}
                    </Alert>
                  )}

                  {!loadingCards && !cardsError && cards.length > 0 && (
                    <>
                      <Form>
                        {cards.map((card) => (
                          <Form.Check
                            key={card._id}
                            type="radio"
                            name="saved-payment-method"
                            id={card._id}
                            className="mb-3"
                            checked={selectedCardId === card._id}
                            onChange={() => setSelectedCardId(card._id)}
                            label={
                              `${card.cardNumberMasked} • Expires ${card.expirationDate} • ${card.billingAddress}`
                            }
                          />
                        ))}
                      </Form>

                      {checkoutError && (
                        <Alert variant="danger" className="mt-3 mb-0">
                          {checkoutError}
                        </Alert>
                      )}

                      <Button
                        className="mt-3 w-100"
                        onClick={handleCheckout}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing Checkout..." : "Checkout"}
                      </Button>
                    </>
                  )}

                  {!loadingCards && !cardsError && cards.length === 0 && (
                    <Alert variant="warning" className="mb-0">
                      No saved payment methods were found on your account.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
