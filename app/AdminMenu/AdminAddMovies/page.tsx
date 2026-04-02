"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

const AdminAddMovies = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    status: "coming_soon",
    rating: "",
    posterUrl: "",
    trailerUrl: "",
    duration: 0,
    genre: "",
    description: "",
    synopsis: "",
    director: "",
    producer: "",
    category: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // Convert genre string to array
    const movieData = {
      ...formData,
      genre: formData.genre.split(",").map((g) => g.trim()),
      duration: Number(formData.duration),
    };

    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to add movie");
        return;
      }

      setSuccessMsg(`Movie "${data.title}" added successfully!`);
      setFormData({
        title: "",
        status: "coming_soon",
        rating: "",
        posterUrl: "",
        trailerUrl: "",
        duration: 0,
        genre: "",
        description: "",
        synopsis: "",
        director: "",
        producer: "",
        category: "",
      });
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <Card className="p-4 shadow-sm">
            <h3 className="mb-3">Add New Movie</h3>

            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <Form onSubmit={handleSubmit}>

              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status *</Form.Label>
                <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="now_showing">Now Showing</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  type="text"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="e.g. PG-13, R"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Poster URL</Form.Label>
                <Form.Control
                  type="text"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Trailer URL</Form.Label>
                <Form.Control
                  type="text"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Duration (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Genre(s)</Form.Label>
                <Form.Control
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="Comma separated: Action, Comedy"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Synopsis</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Director</Form.Label>
                <Form.Control
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Producer</Form.Label>
                <Form.Control
                  type="text"
                  name="producer"
                  value={formData.producer}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" variant="primary">
                Add Movie
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAddMovies;