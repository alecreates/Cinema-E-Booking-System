"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Alert, Modal } from "react-bootstrap";
import { useUser } from "@/app/context/UserContext";
import emailjs from "@emailjs/browser";
import { Movie } from "@/types/movie";
import { mockPaymentCards } from "@/app/mock/paymentMock";

const Profile = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // favorites from db
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  const [cards, setCards] = useState<any[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);

  const [editingCard, setEditingCard] = useState<any | null>(null);

  const [showCardModal, setShowCardModal] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expirationDate: "",
    billingAddress: "",
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
    promoSub: false,
    address: ""
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    promoSub: false,
    currentPassword: "",
    newPassword: "",
    address: ""
  });

  const sendUpdateEmail = async (message: string) => {
    if (!currentUser?.email) return;

    try {
      await emailjs.send(
        "service_nbvsrvg",
        "template_2tb6c16",
        {
          name: currentUser.name,
          email: currentUser.email,
          message, // add this field in EmailJS template
        }
      );
    } catch (err) {
      console.error("Email failed:", err);
    }
  };

  // fetch payment card information

  useEffect(() => {
    const fetchCards = async () => {
      if (!currentUser?.id) return;

      try {
        setLoadingCards(true);

        const res = await fetch(`/api/paymentcards?userId=${currentUser.id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setCards(data);
      } catch (err) {
        console.error("Failed to load cards:", err);
      } finally {
        setLoadingCards(false);
      }
    };

    fetchCards();
  }, [currentUser]);

  // Initialize user info from context
  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name,
        email: currentUser.email,
        promoSub: currentUser.promoSub || false,
        address: currentUser.address
      });
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        promoSub: currentUser.promoSub || false,
        currentPassword: "",
        newPassword: "",
        address: ""
      });
    }
  }, [currentUser]);

  // fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("/api/movies");
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setAllMovies(data.data || data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (!currentUser?.favoriteMovies || allMovies.length === 0) return;

    const favs = allMovies.filter((m) =>
      currentUser.favoriteMovies.includes(m.id)
    );

    setFavoriteMovies(favs);
  }, [currentUser, allMovies]);

  // ---------- Profile Handlers ----------
  const handleUserChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveProfile = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentUser?.id,
          name: formData.name,
          promoSub: formData.promoSub,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          address: formData.address
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to update profile");
        return;
      }

      setUser(data.user);
      if (currentUser) setCurrentUser(data.user);

      setIsEditing(false);
      setSuccessMsg("Profile updated successfully!");

      // Only send email if changes occurred
      const nameChanged = formData.name !== currentUser?.name;
      const promoChanged = formData.promoSub !== currentUser?.promoSub;
      const passwordChanged = formData.newPassword.length > 0;

      if (nameChanged || promoChanged || passwordChanged) {
        await sendUpdateEmail(
          passwordChanged
            ? "Your password has been updated."
            : "Your profile information has been updated."
        );
      }

    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
    }
  };

  // ---------- Payment Card Handlers ----------

  const fetchCards = async () => {
    if (!currentUser?.id) return;

    setLoadingCards(true);

    try {
      const res = await fetch(`/api/paymentcards?userId=${currentUser.id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setCards(data);
    } finally {
      setLoadingCards(false);
    }
  };

  const startEditCard = (card: any) => {
    setEditingCard({
      _id: card._id,
      cardNumber: card.cardNumber, // FULL VALUE
      expirationDate: card.expirationDate,
      billingAddress: card.billingAddress,
    });
  };

  const handleEditCardChange = (e: any) => {
    const { name, value } = e.target;

    setEditingCard((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveCard = async () => {
    try {
      if (!editingCard?._id) return;

      const res = await fetch(`/api/paymentcards/${editingCard._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: editingCard.cardNumber,
          billingAddress: editingCard.billingAddress,
          expirationDate: editingCard.expirationDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // refresh UI after update
      await fetchCards();

      setEditingCard(null);

      await sendUpdateEmail("Your payment card details were updated.");

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to update card");
    }
  };

  const cancelEditCard = () => setEditingCard(null);

  const removeCard = async (id: string) => {
    try {
      const res = await fetch(`/api/paymentcards/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCards((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to delete card");
    }
  };

  // ADD CARD (opens empty editor)
  const addCard = () => {
    if (cards.length >= 3) {
      setErrorMsg("Maximum of 3 payment cards allowed.");
      return;
    }

    setNewCard({
      cardNumber: "",
      expirationDate: "",
      billingAddress: "",
    });

    setShowCardModal(true);
  };

  const handleCreateCard = async () => {
    try {
      const res = await fetch("/api/paymentcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: currentUser?.id,
          ...newCard,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await fetchCards();

      setShowCardModal(false);
      await sendUpdateEmail("A new payment card was added to your account.");

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create card");
    }
  };

  // favorites handlers
  const removeFavorite = async (movieId: string) => {
    if (!currentUser) return;

    try {
      const res = await fetch("/api/users/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          movieId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCurrentUser({ ...currentUser, favoriteMovies: data.favoriteMovies });

      await sendUpdateEmail("A payment card was removed from your account.");
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  return (
    <Container fluid className="min-vh-100 bg-light py-4">
      {/* HEADER */}
      <Row className="justify-content-center mb-3">
        <Col xs={11} md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => router.back()}>
                ← Back
              </button>
              <span className="mx-auto fw-bold">Profile</span>
              <div style={{ width: "60px" }} />
            </Card.Header>
          </Card>
        </Col>
      </Row>

      {/* MAIN CONTENT */}
      <Row className="justify-content-center">
        <Col xs={11} md={8} lg={6}>
          <Card className="p-4 shadow-sm">
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            {/* PROFILE FORM */}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  name="name"
                  value={isEditing ? formData.name : user.name}
                  onChange={handleUserChange}
                  disabled={!isEditing}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control value={user.email} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name="address"
                  value={isEditing ? formData.address : user.address}
                  onChange={handleUserChange}
                  disabled={!isEditing}
                />
              </Form.Group>

              <Form.Check
                className="mb-3"
                label="Subscribe to promotions"
                name="promoSub"
                checked={isEditing ? formData.promoSub : user.promoSub}
                onChange={handleUserChange}
                disabled={!isEditing}
              />

              {isEditing && (
                <>
                  <hr />
                  <h6>Change Password</h6>
                  <Form.Control
                    className="mb-2"
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                    value={formData.currentPassword}
                    onChange={handleUserChange}
                  />
                  <Form.Control
                    className="mb-3"
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleUserChange}
                  />
                </>
              )}

              <div className="d-flex justify-content-between mb-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                ) : (
                  <>
                    <Button variant="success" onClick={handleSaveProfile}>Save</Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ ...user, currentPassword: "", newPassword: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>

              {/* FAVORITES */}
              <hr className="mt-4" />
              <h5>❤️ Favorite Movies</h5>
              <Row>
                {favoriteMovies.map((movie) => (
                  <Col xs={6} sm={4} md={3} key={movie.id}>
                    <Card className="h-100 shadow-sm mb-3">
                      <div
                        style={{
                          height: "120px",
                          backgroundImage: `url(${movie.posterUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title style={{ fontSize: "0.9rem" }}>{movie.title}</Card.Title>
                        <div className="mt-auto d-flex flex-column gap-1">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => router.push(`/MovieDetails/${movie.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => removeFavorite(movie.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* PAYMENT CARDS */}
              <hr className="mt-4" />
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>💳 Payment Methods</h5>
                <Button size="sm" disabled={cards.length >= 3} onClick={addCard}>
                  Add Card
                </Button>
              </div>

              {cards.map((card) => (
                <Card key={card._id} className="p-3 mb-2 shadow-sm">
                  {editingCard?._id === card._id ? (
                    <>
                      {/* EDIT MODE */}
                      <Form.Control
                        className="mb-2"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={editingCard.cardNumber}
                        required
                        onChange={handleEditCardChange}
                      />

                      <Form.Control
                        className="mb-2"
                        name="expirationDate"
                        placeholder="MM/YY"
                        value={editingCard.expirationDate}
                        required
                        onChange={handleEditCardChange}
                      />

                      <Form.Control
                        className="mb-2"
                        name="billingAddress"
                        placeholder="Billing Address"
                        value={editingCard.billingAddress}
                        required
                        onChange={handleEditCardChange}
                      />

                      <div className="d-flex gap-2">
                        <Button size="sm" variant="success" onClick={saveCard}>
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={cancelEditCard}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* VIEW MODE */}
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{card.cardNumberMasked}</strong>

                          <div className="text-muted">
                            Exp: {card.expirationDate}
                          </div>

                          <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                            {card.billingAddress}
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <Button size="sm" onClick={() => startEditCard(card)}>
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => removeCard(card._id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal show={showCardModal} onHide={() => setShowCardModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Payment Card</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Control
              name="cardNumber"
              placeholder="Card Number"
              value={newCard.cardNumber}
              onChange={(e) =>
                setNewCard({ ...newCard, cardNumber: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              name="expirationDate"
              placeholder="MM/YY"
              value={newCard.expirationDate}
              onChange={(e) =>
                setNewCard({ ...newCard, expirationDate: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Control
              name="billingAddress"
              placeholder="Billing Address"
              value={newCard.billingAddress}
              onChange={(e) =>
                setNewCard({ ...newCard, billingAddress: e.target.value })
              }
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCardModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateCard}>
            Save Card
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;