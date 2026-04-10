"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

const AdminAddPromos = () => {
  const [formData, setFormData] = useState({
    promoCode: "",
    discount: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      // 1. create promo
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode: formData.promoCode,
          discount: Number(formData.discount),
        }),
      });

      const promoRes = await res.json();

      if (!res.ok) throw new Error(promoRes.message);

      // 2. trigger email sending (SERVER SIDE)
      const emailRes = await fetch("/api/promotions/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode: promoRes.data.promoCode,
          discount: promoRes.data.discount,
        }),
      });

      const emailData = await emailRes.json();

      if (!emailRes.ok) {
        throw new Error(emailData.message);
      }

      setMessage(
        `Promo created + emails sent to ${emailData.sent} users`
      );

      setFormData({
        promoCode: "",
        discount: "",
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow">
            <h3 className="mb-4 text-center">Create Promotion</h3>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              
              <Form.Group className="mb-3">
                <Form.Label>Promo Code</Form.Label>
                <Form.Control
                
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Discount (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? "Processing..." : "Create Promotion"}
              </Button>

            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAddPromos;