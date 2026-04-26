"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

type PromoType = "percentage" | "flat";

const AdminAddPromos = () => {
  const [formData, setFormData] = useState({
    promoCode: "",
    discount: "",
    type: "percentage" as PromoType,
    minSpend: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode: formData.promoCode.toUpperCase().trim(),
          type: formData.type,
          value: Number(formData.discount),
          minSpend: formData.minSpend ? Number(formData.minSpend) : 0,
          active: true,
        }),
      });

      const promoRes = await res.json();

      if (!res.ok) throw new Error(promoRes.message);

      const emailRes = await fetch("/api/promotions/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode: promoRes.data.promoCode,
          type: promoRes.data.type,
          value: promoRes.data.value,
        }),
      });

      const emailData = await emailRes.json();

      if (!emailRes.ok) {
        throw new Error(emailData.message);
      }

      setMessage(`Promo created + emails sent to ${emailData.sent} users`);

      setFormData({
        promoCode: "",
        discount: "",
        type: "percentage",
        minSpend: "",
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

              {/* NEW: promo type selector */}
              <Form.Group className="mb-3">
                <Form.Label>Discount Type</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="percentage">Percent (%)</option>
                  <option value="flat">Flat ($)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  {formData.type === "percentage" ? "Discount (%)" : "Discount ($)"}
                </Form.Label>
                <Form.Control
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* OPTIONAL: future rule support */}
              <Form.Group className="mb-3">
                <Form.Label>Minimum Spend (optional)</Form.Label>
                <Form.Control
                  type="number"
                  name="minSpend"
                  value={formData.minSpend}
                  onChange={handleChange}
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