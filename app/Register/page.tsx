"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import emailjs from "@emailjs/browser";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [promoSub, setPromoSub] = useState(false);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState(""); // ✅ new state for success

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, promoSub, address }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed");
                return;
            }

            console.log("Registered user:", data.user);

            // send confirmation email
            try {
                await emailjs.send(
                    "service_nbvsrvg",
                    "template_r5uuwfc",
                    {
                        name: data.user.name,
                        email: data.user.email,
                        verify_link: `http://localhost:3000/api/verify?token=${data.user.verificationToken}`,
                    }
                );
            } catch (emailErr) {
                console.error("Email failed:", emailErr);
            }

            //  Show success message instead of redirecting immediately
            setSuccessMsg(
                "🎉 Your account is registered! Please check your email to confirm your identity."
            );

            // optional: clear form fields
            setName("");
            setAddress("");
            setEmail("");
            setPassword("");
            setPromoSub(false);

        } catch (err) {
            console.error("Register request failed:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
            <Row className="w-100 justify-content-center">
                <Col xs={11} sm={8} md={6} lg={4}>
                    <Card className="p-4 shadow">
                        <h3 className="text-center mb-4">Create Account</h3>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {successMsg && <Alert variant="success">{successMsg}</Alert>} {/* ✅ success box */}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formAddress">
                                <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPromoSub">
                                <Form.Check
                                    type="checkbox"
                                    label="Subscribe to promotional emails"
                                    checked={promoSub}
                                    onChange={(e) => setPromoSub(e.target.checked)}
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mb-3"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </Form>

                        <div className="text-center">
                            <span>Already have an account? </span>
                            <a href="/">Log In</a>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;