"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Alert, Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

const PRICES = {
  adult: 12.99,
  child: 8.99,
  senior: 9.99,
};

const SEAT_LOCK_DURATION_MS = 5 * 60 * 1000;

type SeatLock = {
  seatId: string;
  seatLabel: string;
  sessionId: string;
  expiresAt: number;
};

type Seat = {
  _id: string;
  row: string;
  number: number;
};

type TicketSeat = string | { toString: () => string };

type TicketRecord = {
  seatId: TicketSeat | TicketSeat[];
};

const getCurrentTimestamp = () => new Date().getTime();

const getSeatLockKey = (showId: string) => `seatLocks:${showId}`;

const getSeatLockSessionId = () => {
  if (typeof window === "undefined") return "";

  const existingSessionId = sessionStorage.getItem("seatLockSessionId");
  if (existingSessionId) return existingSessionId;

  const newSessionId = crypto.randomUUID();
  sessionStorage.setItem("seatLockSessionId", newSessionId);
  return newSessionId;
};

const readSeatLocks = (key: string) => {
  if (!key) return [];

  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as SeatLock[];
  } catch {
    return [];
  }
};

const writeSeatLocks = (key: string, locks: SeatLock[]) => {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(locks));
};

const normalizeTicketSeatIds = (tickets: TicketRecord[]) =>
  tickets.flatMap((ticket) => {
    const seatIds = Array.isArray(ticket.seatId) ? ticket.seatId : [ticket.seatId];
    return seatIds.map((seatId) => seatId.toString());
  });

const formatLockTime = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
  const { currentUser } = useUser();
  const [seatLockSessionId, setSeatLockSessionId] = useState("");
  const seatLockKey = showId ? getSeatLockKey(showId) : "";
  //const seatId = searchParams.get("seatId")?.split(",").filter(Boolean) || [];
  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });
  const [seats, setSeats] = useState<Seat[]>([]);
  const [bookedSeatIds, setBookedSeatIds] = useState<string[]>([]);
  const [lockedSeatIds, setLockedSeatIds] = useState<string[]>([]);
  const [seatLockMessage, setSeatLockMessage] = useState("");
  const [selectedLockExpiresAt, setSelectedLockExpiresAt] = useState<number | null>(null);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  useEffect(() => {
    if (showId) {
      fetch(`/api/seats/${showId}`)
        .then((res) => res.json())
        .then((data) => {
          setSeats(data.seats);
          const ids = normalizeTicketSeatIds(data.tickets);
          console.log("bookedSeatIds:", ids);
          console.log("seat ids:", data.seats.map((s: Seat) => s._id.toString()));
          setBookedSeatIds(ids);
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


  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSeatLockSessionId(getSeatLockSessionId());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!seatLockKey || !seatLockSessionId) return;

    const refreshLocks = () => {
      const now = getCurrentTimestamp();
      const activeLocks = readSeatLocks(seatLockKey).filter(
        (lock) => lock.expiresAt > now
      );

      writeSeatLocks(seatLockKey, activeLocks);
      setLockedSeatIds(
        activeLocks
          .filter((lock) => lock.sessionId !== seatLockSessionId)
          .map((lock) => lock.seatId)
      );

      const currentSessionLocks = activeLocks.filter(
        (lock) =>
          lock.sessionId === seatLockSessionId &&
          selectedSeatIds.includes(lock.seatId)
      );

      const nextExpiresAt =
        currentSessionLocks.length > 0
          ? Math.min(...currentSessionLocks.map((lock) => lock.expiresAt))
          : null;

      setSelectedLockExpiresAt(nextExpiresAt);
      setLockTimeRemaining(nextExpiresAt ? nextExpiresAt - now : 0);
    };

    refreshLocks();
    const intervalId = window.setInterval(refreshLocks, 1000);

    return () => window.clearInterval(intervalId);
  }, [seatLockKey, seatLockSessionId, selectedSeatIds]);

  const reserveSeatForSession = (seatLabel: string, seatId: string) => {
    if (!seatLockKey) return getCurrentTimestamp() + SEAT_LOCK_DURATION_MS;

    const now = getCurrentTimestamp();
    const expiresAt = now + SEAT_LOCK_DURATION_MS;
    const activeLocks = readSeatLocks(seatLockKey).filter(
      (lock) => lock.expiresAt > now && lock.seatId !== seatId
    );

    writeSeatLocks(seatLockKey, [
      ...activeLocks,
      {
        seatId,
        seatLabel,
        sessionId: seatLockSessionId,
        expiresAt,
      },
    ]);

    return expiresAt;
  };

  const releaseSeatLock = (seatId: string) => {
    if (!seatLockKey) return;

    const now = getCurrentTimestamp();
    const activeLocks = readSeatLocks(seatLockKey).filter(
      (lock) =>
        lock.expiresAt > now &&
        !(lock.seatId === seatId && lock.sessionId === seatLockSessionId)
    );

    writeSeatLocks(seatLockKey, activeLocks);
  };

  const toggleSeat = (seat: string, seatId: string) => {
    setSeatLockMessage("");

    if (bookedSeatIds.includes(seatId)) {
      setSeatLockMessage("That seat is already booked.");
      return;
    }

    if (lockedSeatIds.includes(seatId)) {
      setSeatLockMessage("That seat is temporarily reserved by another session.");
      return;
    }

    const isSelected = selectedSeatIds.includes(seatId);

    if (!isSelected && ticketCount === 0) {
      setSeatLockMessage("Select tickets before choosing seats.");
      return;
    }

    if (!isSelected && selectedSeatIds.length >= ticketCount) {
      setSeatLockMessage(`You can only select ${ticketCount} seat${ticketCount === 1 ? "" : "s"} for this order.`);
      return;
    }

    if (isSelected) {
      releaseSeatLock(seatId);
      setSelectedSeats((prev) => prev.filter((s) => s !== seat));
      setSelectedSeatIds((prev) => prev.filter((s) => s !== seatId));
      return;
    }

    const expiresAt = reserveSeatForSession(seat, seatId);
    setSelectedLockExpiresAt((current) => current ? Math.min(current, expiresAt) : expiresAt);
    setSelectedSeats((prev) => [...prev, seat]);
    setSelectedSeatIds((prev) => [...prev, seatId]);
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

  const ticketCount = tickets.adult + tickets.child + tickets.senior;

  const seatSelectionError =
    ticketCount === 0
      ? "Select at least one ticket to continue."
      : selectedSeats.length !== ticketCount
        ? `Please select ${ticketCount} seat${ticketCount === 1 ? "" : "s"} for your order.`
        : "";

  const handleProceedToCheckout = () => {
    if (seatSelectionError) return;

    const lockExpiresAt = getCurrentTimestamp() + SEAT_LOCK_DURATION_MS;
    if (seatLockKey) {
      const now = getCurrentTimestamp();
      const selectedSeatSet = new Set(selectedSeatIds);
      const activeLocks = readSeatLocks(seatLockKey).filter(
        (lock) =>
          lock.expiresAt > now &&
          !(lock.sessionId === seatLockSessionId && selectedSeatSet.has(lock.seatId))
      );

      const refreshedLocks = selectedSeatIds.map((seatId, index) => ({
        seatId,
        seatLabel: selectedSeats[index] || seatId,
        sessionId: seatLockSessionId,
        expiresAt: lockExpiresAt,
      }));

      writeSeatLocks(seatLockKey, [...activeLocks, ...refreshedLocks]);
      setSelectedLockExpiresAt(lockExpiresAt);
    }

    const params = new URLSearchParams({
      movieID: movieID || "",
      movie: movie || "",
      time: time || "",
      date: date || "",
      hall: hall || "",
      rows: rows || "",
      seatsPerRow: seatsPerRow || "",
      showId: showId || "",
      seatId: selectedSeatIds.join(","),
      seats: selectedSeats.join(","),
      adult: String(tickets.adult),
      child: String(tickets.child),
      senior: String(tickets.senior),
      lockExpiresAt: String(lockExpiresAt),
    });

    const checkoutUrl = `/Checkout?${params.toString()}`;

    if (!currentUser) {
      router.push(`/Login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }

    router.push(checkoutUrl);
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
                const seatId = seat._id.toString();
                const isBooked = bookedSeatIds.includes(seatId);
                const isLocked = lockedSeatIds.includes(seatId);

                return (
                  <div
                    key={seat._id}
                    onClick={() => {
                      toggleSeat(`${seat.row}${seat.number}`, seatId);
                    }}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "5px",
                      background: isSelected ? "#0d6efd" : isBooked ? "#dc3545" : isLocked ? "#fd7e14" : "#6c757d",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      cursor: isBooked || isLocked ? "not-allowed" : "pointer",
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

            {selectedSeats.length > 0 && selectedLockExpiresAt && lockTimeRemaining > 0 && (
              <Alert variant="info" className="py-2 text-start">
                Selected seats are reserved for this session for {formatLockTime(lockTimeRemaining)}.
              </Alert>
            )}

            {seatLockMessage && (
              <Alert variant="secondary" className="py-2 text-start">
                {seatLockMessage}
              </Alert>
            )}

            <div className="d-flex flex-wrap gap-3 justify-content-center text-muted small mb-3">
              <span><Badge bg="primary">Blue</Badge> Selected</span>
              <span><Badge bg="secondary">Gray</Badge> Available</span>
              <span><Badge bg="danger">Red</Badge> Booked</span>
              <span><Badge bg="warning" text="dark">Orange</Badge> Reserved</span>
            </div>

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
