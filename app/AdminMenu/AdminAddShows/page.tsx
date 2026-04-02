"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

const AdminAddShows = () => {
    const router = useRouter();

    const [movies, setMovies] = useState([]);
    const [showRooms, setShowRooms] = useState([]);

    const [formData, setFormData] = useState({
        movieId: "",
        showRoomId: "",
        showTime: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // FETCH MOVIES
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch("/api/movies");
                const json = await res.json();

                //right now, this displays ALL movies regardless of status
                setMovies(json.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load movies");
            }
        };

        fetchMovies();
    }, []);

    // FETCH SHOWROOMS
    useEffect(() => {
        const fetchShowrooms = async () => {
            try {
                const res = await fetch("/api/showrooms");
                const data = await res.json();

                setShowRooms(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load showrooms")
            }
        };
        fetchShowrooms();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/shows", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            console.log(JSON.stringify(formData))

            if (!res.ok) throw new Error("Failed to create show");

            setMessage("Show scheduled successfully!");

            // optional reset
            setFormData({
                movieId: "",
                showRoomId: "",
                showTime: "",
            });

        } catch (err) {
            console.error(err);
            setError("Error scheduling show");
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="p-4 shadow">
                        <h3 className="mb-4 text-center">Schedule a Show</h3>

                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            {/* MOVIE DROPDOWN */}
                            <Form.Group className="mb-3">
                                <Form.Label>Select Movie</Form.Label>
                                <Form.Select
                                    name="movieId"
                                    value={formData.movieId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Choose Movie --</option>
                                    {movies.map((movie) => (
                                        <option key={movie.id} value={movie.id}>
                                            {movie.title}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* SHOWROOM DROPDOWN */}
                            <Form.Group className="mb-3">
                                <Form.Label>Select Show Room</Form.Label>
                                <Form.Select
                                    name="showRoomId"
                                    value={formData.showRoomId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Choose Room --</option>
                                    {showRooms.map((room) => (
                                        <option key={room._id} value={room._id}>
                                            {room.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* DATE + TIME */}
                            <Form.Group className="mb-3">
                                <Form.Label>Show Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="showTime"
                                    value={formData.showTime}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Schedule Show
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminAddShows;