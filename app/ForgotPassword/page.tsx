"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    setLoading(true);

    try {
      const res = await fetch("/api/ForgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send reset link.");
        return;
      }

      setSubmitted(true);
      setEmail("");
    } catch (err) {
      console.error("Forgot password request failed:", err);
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
            <h3 className="text-center mb-3">Forgot Password</h3>

            <p className="text-center text-muted mb-4" style={{ fontSize: "0.95rem" }}>
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {submitted && (
              <Alert variant="success">
                If an account exists for that email, a reset link has been sent.
              </Alert>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formForgotEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </Form>

            <div className="text-center">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => router.push("/")}
              >
                ← Back to Login
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;