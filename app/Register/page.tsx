"use client";

import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

const Register = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: handle register API call here
    console.log("Registering:", { email, password });

    // after successful register, route to Home -- user will automatically be logged in
    toast.success("Successfully registered");
    router.push("/Login"); // <-- routes to app/login/page.tsx
  };

  return (
    // This empty tag syntax is shorthand for <React.Fragment>
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="p-4 shadow">
            <h3 className="text-center mb-4">Register</h3>

            <Form onSubmit={handleSubmit}>

              {/* Display Name */}
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Remember me checkbox */}
              <Form.Group className="mb-3" controlId="formRememberMe">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </Form.Group>

              {/* Register button */}
              <Button variant="primary" type="submit" className="w-100 mb-3">
                Register
              </Button>
            </Form>

            {/* Log up reference */}
            <div className="text-center">
              <span>Already have an account? </span>
              <a href="/Login">Log in</a>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;