"use client";

import React from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  return (
    <Container fluid className="min-vh-100 bg-light py-4">
      {/* Header */}
      <Row className="mb-4 justify-content-center">
        <Col xs={11} md={10} lg={8}>
          <Card className="p-3 shadow-sm d-flex flex-row justify-content-between align-items-center">
            <h4 className="mb-0">🎬 Cinema E-Booking System</h4>
            <div>
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                onClick={() => router.push("/Profile")}
              >
                Profile
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => router.push("/")}
              >
                Logout
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="justify-content-center mb-4">
        <Col xs={11} md={10} lg={8}>
          <Card className="p-3 shadow-sm">
            <Form>
              <Form.Control
                type="text"
                placeholder="Search movies or theaters..."
              />
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Now Showing */}
      <Row className="justify-content-center">
        <Col xs={11} md={10} lg={8}>
          <h5 className="mb-3">Now Showing</h5>

          <Row>
            {[1, 2, 3, 4].map((movie) => (
              <Col xs={12} sm={6} md={4} lg={3} key={movie} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <div
                    style={{ height: "180px", background: "#ddd" }}
                    className="d-flex align-items-center justify-content-center"
                  >
                    Poster
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>Movie Title</Card.Title>
                    <Card.Text className="text-muted">
                      Genre • Rating
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="mt-auto"
                      onClick={() => router.push("/MovieDetails")}
                    >
                      View Movie Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Footer */}
      <Row className="mt-5 justify-content-center">
        <Col xs={11} md={10} lg={8} className="text-center text-muted">
          <small>2026 Cinema E-Booking</small>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;