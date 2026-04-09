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

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promoCode: formData.promoCode,
          discount: Number(formData.discount),
        }),
      });

      if (!res.ok) throw new Error("Failed to create promotion");

      setMessage("Promotion created successfully!");

      setFormData({
        promoCode: "",
        discount: "",
      });

    } catch (err) {
      console.error(err);
      setError("Error creating promotion");
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
                  type="text"
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

              <Button variant="primary" type="submit" className="w-100">
                Create Promotion
              </Button>

            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAddPromos;  