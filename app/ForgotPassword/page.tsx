"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // hook to backend later when passwords and emails and stuff are there idk its like 1am
    console.log("Password reset requested for:", email);

    setSubmitted(true);
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="p-4 shadow">
            <h3 className="text-center mb-3">Forgot Password</h3>

            <p className="text-center text-muted mb-4" style={{ fontSize: "0.95rem" }}>
              Enter your email and we'll send you a reset link.
            </p>

            {submitted && (
              <Alert variant="success">
                If an account exists for that email, a reset link has been sent.
              </Alert>
            )}

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

              <Button type="submit" variant="primary" className="w-100 mb-3">
                Send Reset Link
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