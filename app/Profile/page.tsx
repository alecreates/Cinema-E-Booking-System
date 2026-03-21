"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { mockMovie } from "@/app/mock/movieMock";
import { mockPaymentCards } from "@/app/mock/paymentMock";
import { useUser } from "@/app/context/UserContext";

const Profile = () => {
    const router = useRouter();
    const { currentUser } = useUser();

    const [isEditing, setIsEditing] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [favorites, setFavorites] = useState([mockMovie]);
    const [cards, setCards] = useState(mockPaymentCards);

    const [editingCard, setEditingCard] = useState<any | null>(null);

    const [user, setUser] = useState({
        name: "",
        email: "",
        promoSub: false,
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        promoSub: false,
        currentPassword: "",
        newPassword: "",
    });

    // Initialize from context
    useEffect(() => {
        if (currentUser) {
            setUser({
                name: currentUser.name,
                email: currentUser.email,
                promoSub: currentUser.promoSub || false,
            });
            setFormData({
                name: currentUser.name,
                email: currentUser.email,
                promoSub: currentUser.promoSub || false,
                currentPassword: "",
                newPassword: "",
            });
        }
    }, [currentUser]);

    // ---------- Profile Handlers ----------
    const handleUserChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSaveProfile = () => {
        setErrorMsg("");
        setSuccessMsg("");

        if (formData.newPassword && !formData.currentPassword) {
            setErrorMsg("Please enter current password to change password.");
            return;
        }

        // TODO: PUT /api/user/update
        setUser(formData);
        setIsEditing(false);
        setSuccessMsg("Profile updated successfully!");
    };

    // ---------- Payment Card Handlers ----------
    const startEditCard = (card: any) => setEditingCard({ ...card });

    const handleCardChange = (e: any) => {
        const { name, value } = e.target;
        setEditingCard((prev: any) => ({ ...prev, [name]: value }));
    };

    const saveCard = () => {
        // TODO: PUT /api/cards/:id (encrypt card)
        setCards((prev) =>
            prev.map((c) => (c.id === editingCard.id ? editingCard : c))
        );
        setEditingCard(null);
    };

    const cancelEditCard = () => setEditingCard(null);

    const removeCard = (id: string) => setCards((prev) => prev.filter((c) => c.id !== id));

    const addCard = () => {
        if (cards.length >= 3) {
            setErrorMsg("Maximum of 3 payment cards allowed.");
            return;
        }
        setEditingCard({
            id: Date.now().toString(),
            cardNumber: "",
            expiration: "",
            billingAddress: "",
        });
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
                                {favorites.map((movie) => (
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
                                                <Card.Title style={{ fontSize: "0.9rem" }}>
                                                    {movie.title}
                                                </Card.Title>
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
                                                        onClick={() => setFavorites((prev) => prev.filter((m) => m.id !== movie.id))}
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
                                <Card key={card.id} className="p-3 mb-2 shadow-sm">
                                    {editingCard?.id === card.id ? (
                                        <>
                                            <Form.Control
                                                className="mb-2"
                                                name="cardNumber"
                                                placeholder="Card Number"
                                                value={editingCard.cardNumber}
                                                onChange={handleCardChange}
                                            />
                                            <Form.Control
                                                className="mb-2"
                                                name="expiration"
                                                placeholder="MM/YY"
                                                value={editingCard.expiration}
                                                onChange={handleCardChange}
                                            />
                                            <Form.Control
                                                className="mb-2"
                                                name="billingAddress"
                                                placeholder="Billing Address"
                                                value={editingCard.billingAddress}
                                                onChange={handleCardChange}
                                            />
                                            <div className="d-flex gap-2">
                                                <Button size="sm" variant="success" onClick={saveCard}>Save</Button>
                                                <Button size="sm" variant="secondary" onClick={cancelEditCard}>Cancel</Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{card.cardNumber}</strong>
                                                <div className="text-muted">Exp: {card.expiration}</div>
                                                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                                                    {card.billingAddress}
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Button size="sm" onClick={() => startEditCard(card)}>✏️</Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => removeCard(card.id)}>Remove</Button>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;