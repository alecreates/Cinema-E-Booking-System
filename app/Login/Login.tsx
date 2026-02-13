"use client";

import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const Login = () => {

    const [rememberMe, setRememberMe] = useState(false);
    
    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
            <Row className="w-100 justify-content-center">
                <Col xs={11} sm={8} md={6} lg={4}>
                    <Card className="p-4 shadow">
                        <h3 className="text-center mb-4">Log In</h3>

                        <Form>
                            {/* Email */}
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>

                            {/* Password */}
                            <Form.Group className="mb-2" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password" />
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

                            {/* Forgot password */}
                            <div className="text-end mb-3">
                                <a href="/forgot-password" style={{ fontSize: "0.9rem" }}>
                                    Forgot password?
                                </a>
                            </div>

                            {/* Login button */}
                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Log In
                            </Button>
                        </Form>

                        {/* Sign up reference */}
                        <div className="text-center">
                            <span>Already have an account? </span>
                            <a href="/register">Log in</a>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
