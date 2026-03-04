"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { Movie } from "@/types/movie";
import Select from "react-select";

const HomePage = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<readonly { label: string, value: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchMovies = async () => {
      try {
        const res = await fetch("/api/movies");
        if (!res.ok) throw new Error("Failed to fetch movies");
        const json = await res.json();
        setMovies(json.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const allGenres = [...new Set(movies.flatMap((movie) => movie.genre))];
  const genreOptions = allGenres.map(g => ({ label: g, value: g }));

  // FILTER LOGIC
  const filterMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()) &&
    (selectedGenres.length > 0
      ? selectedGenres.every((genre) => m.genre.includes(genre.value))  // AND logic
      : true) &&
    (selectedDate ? m.showtimes.some(showtime => showtime.date === selectedDate) : true)
  );

  const nowShowing = filterMovies.filter(m => m.status === "now_showing");
  const comingSoon = filterMovies.filter(m => m.status === "coming_soon");
  const noResults = !loading && nowShowing.length === 0 && comingSoon.length === 0;

  return (
    <Container fluid className="min-vh-100 bg-light py-4">
      {/* Header */}
      <Row className="mb-4 justify-content-center">
        <Col xs={11} md={10} lg={8}>
          <Card className="p-3 shadow-sm d-flex flex-row justify-content-between align-items-center">
            <h4 className="mb-0">🎬 Cinema E-Booking System</h4>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => router.push("/Profile")}>
                Profile
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => router.push("/")}>
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mb-2"
              />

              {isClient && (
                <Select
                  options={genreOptions}
                  value={selectedGenres}
                  onChange={(selected) => setSelectedGenres((selected || []) as { label: string; value: string }[])}
                  isMulti
                  placeholder="Select genres..."
                  className="mb-2"
                />
              )}

              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form>
          </Card>
        </Col>
      </Row>

      {noResults && (
        <Row className="justify-content-center mb-4">
          <Col xs={11} md={10} lg={8}>
            <Card className="p-4 text-center shadow-sm">
              <h6 className="text-muted mb-0">No results found.</h6>
            </Card>
          </Col>
        </Row>
      )}

      {/* Now Showing */}
      <Row className="justify-content-center">
        <Col xs={11} md={10} lg={8}>
          <h5 className="mb-3">Now Showing</h5>
          <Row>
            {nowShowing.map((movie) => (
              <Col xs={12} sm={6} md={4} lg={3} key={movie.id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <div
                    style={{
                      height: "180px",
                      backgroundImage: `url(${movie.posterUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text className="text-muted">{movie.genre.join(", ")} • {movie.rating}</Card.Text>
                    <Button variant="primary" className="mt-auto" onClick={() => router.push(`/MovieDetails/${movie.id}`)}>
                      View Movie Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Coming Soon */}
      <Row className="justify-content-center">
        <Col xs={11} md={10} lg={8}>
          <h5 className="mb-3">Coming Soon</h5>
          <Row>
            {comingSoon.map((movie) => (
              <Col xs={12} sm={6} md={4} lg={3} key={movie.id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <div
                    style={{
                      height: "180px",
                      backgroundImage: `url(${movie.posterUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text className="text-muted">{movie.genre.join(", ")} • {movie.rating}</Card.Text>
                    <Button variant="primary" className="mt-auto" onClick={() => router.push(`/MovieDetails/${movie.id}`)}>
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