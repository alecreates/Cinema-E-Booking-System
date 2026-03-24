"use client";

import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

const AdminHome = () => {
  const router = useRouter();

  return (
    <Container fluid className="min-vh-100 bg-light py-4">
      <Row className="mb-4 justify-content-center">
        <Col xs={11} md={10} lg={8}>
          <Card className="p-3 shadow-sm d-flex flex-row justify-content-between align-items-center">
            <h4 className="mb-0">⚙️ Admin Menu</h4>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => router.push("/Login")}
            >
              ← Back to Login
            </Button>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={11} md={10} lg={8}>
          <Row className="g-4">

            <Col xs={12} sm={6}>
              <Card className="h-100 shadow-sm text-center p-4">
                <h5 className="mb-3">🎬 Manage Movies</h5>
                <p className="text-muted">
                  Add, edit, or remove movies from the system.
                </p>
                <Button
                  variant="primary"
                >
                  Go to Movies
                </Button>
              </Card>
            </Col>

            <Col xs={12} sm={6}>
              <Card className="h-100 shadow-sm text-center p-4">
                <h5 className="mb-3">🏷️ Promotions</h5>
                <p className="text-muted">
                  Create and manage discounts or special offers.
                </p>
                <Button
                  variant="primary"
                >
                  Manage Promotions
                </Button>
              </Card>
            </Col>

            <Col xs={12} sm={6}>
              <Card className="h-100 shadow-sm text-center p-4">
                <h5 className="mb-3">👤 Users</h5>
                <p className="text-muted">
                  View and manage user accounts.
                </p>
                <Button
                  variant="primary"
                >
                  Manage Users
                </Button>
              </Card>
            </Col>

            <Col xs={12} sm={6}>
              <Card className="h-100 shadow-sm text-center p-4">
                <h5 className="mb-3">🕒 Showtimes</h5>
                <p className="text-muted">
                  Schedule and update movie showtimes.
                </p>
                <Button
                  variant="primary"
                >
                  Manage Showtimes
                </Button>
              </Card>
            </Col>

          </Row>
        </Col>
      </Row>

      <Row className="mt-5 justify-content-center">
        <Col xs={11} md={10} lg={8} className="text-center text-muted">
          <small>Admin Menu • Cinema E-Booking System</small>
        </Col>
      </Row>

    </Container>
  );
};

export default AdminHome;