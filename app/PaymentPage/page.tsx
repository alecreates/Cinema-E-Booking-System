"use client";

import { use, useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, ListGroup, Row, Spinner } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { paymentFacade, SavedCard, TicketType } from "@/lib/payment/PaymentFacade";
import { applyPromotions } from "@/lib/pricing/applyPromotions";
import { PiCardholder } from "react-icons/pi";

const TICKET_LABELS: Record<TicketType, string> = {
  adult: "Adult",
  child: "Child",
  senior: "Senior",
};
const EMPTY_NEW_CARD = {
  cardholderName: "",
  cardNumber: "",
  expirationDate: "",
  billingAddress: "",
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
  const movieID = searchParams.get("movieID") || searchParams.get("movieId");
  const date = searchParams.get("date") || "Date";
  const time = searchParams.get("time") || "Time";
  const hall = searchParams.get("hall") || "Main Hall";
  const email = searchParams.get("email") || "";

  const seats = searchParams.get("seats")?.split(",").filter(Boolean) || [];
  const subtotal = searchParams.get("subtotal") || "0.00";

  const showId = searchParams.get("showId");
  const seatId = searchParams.get("seatId")?.split(",").filter(Boolean) || [];

  const promoCode = searchParams.get("promoCode") || "";

  const lockExpiresAt = Number(searchParams.get("lockExpiresAt") || 0);

  const [displayTotal, setDisplayTotal] = useState(Number(subtotal));
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [loadingCards, setLoadingCards] = useState(true);
  const [cardsError, setCardsError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  const [promoInput, setPromoInput] = useState(promoCode);
  const [appliedPromo, setAppliedPromo] = useState(promoCode);
  const [discountedTotal, setDiscountedTotal] = useState(Number(subtotal));

  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCard, setNewCard] = useState(EMPTY_NEW_CARD);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [saveCardError, setSaveCardError] = useState("")

 
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
  const atCardLimit = cards.length >= 3;

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

  useEffect(() => {
    const runPromo = async () => {
      const result = await applyPromotions(Number(subtotal), appliedPromo);
      setDiscountedTotal(result);
    };

    runPromo();
  }, [subtotal, appliedPromo]);

  const handleApplyPromo = () => {
    setAppliedPromo(promoInput.trim());
  };

  const handleNewCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNewCard((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveNewCard = async () => {
    setSaveCardError("");

    const { cardholderName, cardNumber, expirationDate, billingAddress } = newCard;

    if (!cardholderName || !cardNumber || !expirationDate || !billingAddress) {
      setSaveCardError("Please fill in all card fields.");
      return;
    }

    if (!currentUser?.id) {
      setSaveCardError("You must be logged in to save a card.");
      return;
    }

    setIsSavingCard(true);

    try {
      const saved = await paymentFacade.saveNewCard({
        userId: currentUser.id,
        cardholderName,
        cardNumber,
        expirationDate,
        billingAddress,
      });

      setCards((prev) => [...prev, saved]);
      setSelectedCardId(saved._id);
      setNewCard(EMPTY_NEW_CARD);
      setShowNewCardForm(false);
    } catch (error) {
      setSaveCardError(
        error instanceof Error ? error.message : "Failed to save card. Please try again."
      );
    } finally {
      setIsSavingCard(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutError("");

    if (!currentUser?.id) {
      setCheckoutError("You must be logged in to complete checkout.");
      return;
    }

    if (!movieID) {
      setCheckoutError("Missing movie information. Please restart booking.");
      return;
    }

    if (!selectedCardId) {
      setCheckoutError("Please select a payment method.");
      return;
    }

    if (lockExpiresAt && lockTimeRemaining <= 0) {
      setCheckoutError("Your seat reservation has expired.");
      return;
    }

    if (isSubmitting) return;

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
        promoCode: appliedPromo,
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
                  <ListGroup.Item key={type} className="px-0 d-flex justify-content-between">
                    <span>{TICKET_LABELS[type]} tickets</span>
                    <strong>{count}</strong>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span>Email for confirmation</span>
                  <strong>{email || "Not provided"}</strong>
                </ListGroup.Item>

                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span>Promo Code</span>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <Form.Control
                      size="sm"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Enter promo"
                      style={{ width: "140px" }}
                    />
                    <Button size="sm" variant="secondary" onClick={handleApplyPromo}>
                      Apply
                    </Button>
                  </div>
                </ListGroup.Item>

                {appliedPromo && (
                  <ListGroup.Item className="px-0">
                    <Alert variant="success" className="mb-0">
                      Promo "{appliedPromo}" will be applied at checkout.
                    </Alert>
                  </ListGroup.Item>
                )}

                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span>Total before tax</span>
                  <strong>${subtotal}</strong>
                </ListGroup.Item>

                {appliedPromo && (
                  <ListGroup.Item className="px-0 d-flex justify-content-between">
                    <span>Total after promotions</span>
                    <strong>${discountedTotal.toFixed(2)}</strong>
                  </ListGroup.Item>
                )}

              </ListGroup>

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
                            onChange={() => {
                              setSelectedCardId(card._id);
                              setShowNewCardForm(false);
                              setSaveCardError("")
                            }}
                            label={`${card.cardNumberMasked} • Expires ${card.expirationDate} • ${card.billingAddress}`}
                          />
                        ))}
                      </Form>

                      {!atCardLimit ? (
                        <>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="mb-3"
                            onClick={() => {
                              setShowNewCardForm((prev) => !prev);
                              setSelectedCardId("");
                              setSaveCardError("");
                            }}
                        >
                          {showNewCardForm ? "Cancel" : "+ Add a new card"}
                        </Button>

                        {showNewCardForm && (
                          <Card className="mb-3 border">
                            <Card.Body>
                              <p className="fw-semibold mb-3">New Card Details</p>

                              <Form.Group className="mb-2">
                                <Form.Label>Cardholder Name</Form.Label>
                                <Form.Control
                                  name="cardholderName"
                                  value={newCard.cardholderName}
                                  onChange={handleNewCardChange}
                                  placeholder="Name on card"
                                />
                              </Form.Group>

                              <Form.Group className="mb-2">
                                <Form.Label>Card Number</Form.Label>
                                <Form.Control
                                  name="cardNumber"
                                  value={newCard.cardNumber}
                                  onChange={handleNewCardChange}
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                />
                              </Form.Group>

                              <Form.Group className="mb-2">
                                <Form.Label>Expiration Date</Form.Label>
                                <Form.Control
                                  name="expirationDate"
                                  value={newCard.expirationDate}
                                  onChange={handleNewCardChange}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                />
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label>Billing Address</Form.Label>
                                <Form.Control
                                  name="billingAddress"
                                  value={newCard.billingAddress}
                                  onChange={handleNewCardChange}
                                  placeholder="123 Main St, City, State"
                                />
                              </Form.Group>

                              {saveCardError && (
                                <Alert variant="danger" className="mb-2">
                                  {saveCardError}
                                </Alert>
                              )}

                              <Button
                                variant="primary"
                                onClick={handleSaveNewCard}
                                disabled={isSavingCard}
                                className="w-100"
                              >
                                {isSavingCard ? (
                                  <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Saving Card...
                                  </>
                                ) : (
                                  "Save Card"
                                )}
                              </Button>
                            </Card.Body>
                          </Card>
                        )}
                      </>
                    ) : (
                      <Alert variant="info" className="mb-3">
                        You have reached the 3-card limit. Remove an existing card to add a new one.
                      </Alert>
                    )}
                      {selectedCardId && (
                        <>
                      {checkoutError && (
                          <Alert variant="danger" className="mt-3 mb-0">
                            {checkoutError}
                          </Alert>
                        )}

                      <Button
                        className="mt-3 w-100"
                        onClick={handleCheckout}
                        disabled={isSubmitting || (lockExpiresAt > 0 && lockTimeRemaining <= 0)}
                      >
                        {isSubmitting ? "Processing Checkout..." : "Checkout"}
                      </Button>
                      </>
                      )}
                    </>
                  )}
                    {!loadingCards && !cardsError && cards.length === 0 && (
                        <>
                          <p className="text-muted mb-3">No saved payment methods found. Add a card to continue.</p>

                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="mb-3"
                            onClick={() => {
                              setShowNewCardForm((prev) => !prev);
                              setSaveCardError("");
                            }}
                          >
                            {showNewCardForm ? "Cancel" : "+ Add a new card"}
                          </Button>

                          {showNewCardForm && (
                            <Card className="mb-3 border">
                              <Card.Body>
                                <p className="fw-semibold mb-3">New Card Details</p>

                                <Form.Group className="mb-2">
                                  <Form.Label>Cardholder Name</Form.Label>
                                  <Form.Control
                                    name="cardholderName"
                                    value={newCard.cardholderName}
                                    onChange={handleNewCardChange}
                                    placeholder="Name on card"
                                  />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                  <Form.Label>Card Number</Form.Label>
                                  <Form.Control
                                    name="cardNumber"
                                    value={newCard.cardNumber}
                                    onChange={handleNewCardChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                  />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                  <Form.Label>Expiration Date</Form.Label>
                                  <Form.Control
                                    name="expirationDate"
                                    value={newCard.expirationDate}
                                    onChange={handleNewCardChange}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                  />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                  <Form.Label>Billing Address</Form.Label>
                                  <Form.Control
                                    name="billingAddress"
                                    value={newCard.billingAddress}
                                    onChange={handleNewCardChange}
                                    placeholder="123 Main St, City, State"
                                  />
                                </Form.Group>

                                {saveCardError && (
                                  <Alert variant="danger" className="mb-2">
                                    {saveCardError}
                                  </Alert>
                                )}

                                <Button
                                  variant="primary"
                                  onClick={handleSaveNewCard}
                                  disabled={isSavingCard}
                                  className="w-100"
                                >
                                  {isSavingCard ? (
                                    <>
                                      <Spinner animation="border" size="sm" className="me-2" />
                                      Saving Card...
                                    </>
                                  ) : (
                                    "Save Card"
                                  )}
                                </Button>
                              </Card.Body>
                            </Card>
                          )}
                        </>
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
