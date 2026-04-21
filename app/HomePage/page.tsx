"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { Movie } from "@/types/movie";
import Select from "react-select";
import { useUser } from "@/app/context/UserContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const HomePage = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser, logout } = useUser();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<
    readonly { label: string; value: string }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isClient, setIsClient] = useState(false);

  /* ---------------- FETCH MOVIES ---------------- */
  useEffect(() => {
    setIsClient(true);

    const fetchMovies = async () => {
      try {
        const res = await fetch("/api/movies");
        if (!res.ok) throw new Error("Failed to fetch movies");
        const json = await res.json();
        setMovies(json.data || json);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (currentUser === null) {
      router.replace("/");
    }
  }, [currentUser, router]);

  /* ---------------- FETCH RECOMMENDATIONS (WITH CACHE) ---------------- */
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentUser) return;

      const cacheKey = `recs_${currentUser.id}`;

      // Try cache first
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const ONE_HOUR = 1000 * 60 * 60;

          if (Date.now() - parsed.timestamp < ONE_HOUR) {
            setRecommendations(parsed.data);
            return;
          } else {
            localStorage.removeItem(cacheKey);
          }
        } catch {
          localStorage.removeItem(cacheKey);
        }
      }

      // Fetch from API
      try {
        setRecLoading(true);

        const res = await fetch(`/api/recommendations/${currentUser.id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        const recMovies = data.results;

        // Save to cache
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: recMovies,
            timestamp: Date.now(),
          })
        );

        setRecommendations(recMovies);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setRecLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentUser]);

  /* ---------------- FILTERING ---------------- */
  const allGenres = [...new Set(movies.flatMap((m) => m.genre))];
  const genreOptions = allGenres.map((g) => ({ label: g, value: g }));

  const filterMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) &&
      (selectedGenres.length > 0
        ? selectedGenres.every((g) => m.genre.includes(g.value))
        : true) &&
      (selectedDate
        ? m.showtimes?.some((s) => s.date === selectedDate)
        : true)
  );

  const nowShowing = filterMovies.filter((m) => m.status === "now_showing");
  const comingSoon = filterMovies.filter((m) => m.status === "coming_soon");

  const noResults =
    !loading && nowShowing.length === 0 && comingSoon.length === 0;

  /* ---------------- FAVORITES ---------------- */
  const isFavorite = (movieId: string) => {
    return currentUser?.favoriteMovies?.includes(movieId);
  };

  const toggleFavorite = async (movieId: string) => {
    if (!currentUser) return;

    try {
      const res = await fetch("/api/users/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          movieId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCurrentUser({
        ...currentUser,
        favoriteMovies: data.favoriteMovies,
      });

      // Clear cache so recommendations refresh
      localStorage.removeItem(`recs_${currentUser.id}`);
    } catch (err) {
      console.error("Failed to update favorites:", err);
    }
  };

  /* ---------------- MOVIE CARD ---------------- */
  const renderMovieCard = (movie: Movie) => (
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
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title className="mb-0">{movie.title}</Card.Title>
            {currentUser && (
              <span
                style={{
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  color: isFavorite(movie.id) ? "red" : "gray",
                }}
                onClick={() => toggleFavorite(movie.id)}
              >
                {isFavorite(movie.id) ? <FaHeart /> : <FaRegHeart />}
              </span>
            )}
          </div>

          <Card.Text className="text-muted">
            {movie.genre.join(", ")} • {movie.rating}
          </Card.Text>

          <Button
            variant="primary"
            className="mt-auto"
            onClick={() => router.push(`/MovieDetails/${movie.id}`)}
          >
            View Movie Details
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );

  /* ---------------- SIDEBAR ---------------- */
  const renderSidebar = () => (
    <Card className="p-3 shadow-sm">
      <h6 className="mb-3">🎯 For You</h6>

      {recLoading && <p className="text-muted">Loading...</p>}

      {!recLoading && recommendations.length === 0 && (
        <p className="text-muted">No recommendations yet</p>
      )}

      {recommendations.slice(0, 4).map((movie) => (
        <div
          key={movie.id}
          className="d-flex align-items-center mb-2"
        >
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{
              width: "40px",
              height: "60px",
              objectFit: "cover",
              marginRight: "8px",
              borderRadius: "4px",
            }}
          />
          <div style={{ fontSize: "0.8rem" }}>
            <div>{movie.title}</div>
            <div style={{ color: "gray", fontSize: "0.7rem" }}>
              {movie.genre.slice(0, 2).join(", ")}
            </div>
          </div>
        </div>
      ))}
    </Card>
  );

  /* ---------------- UI ---------------- */
  return (
    <Container fluid className="min-vh-100 bg-light py-4">
      {/* HEADER */}
      <Row className="mb-4 justify-content-center">
        <Col xs={11} md={10} lg={10}>
          <Card className="p-3 shadow-sm d-flex flex-row justify-content-between align-items-center">
            <h4 className="mb-0">🎬 Cinema E-Booking System</h4>

            <div>
              {!isClient ? null : currentUser ? (
                <>
                  <Button
                    size="sm"
                    className="me-2"
                    onClick={() => router.push("/Profile")}
                  >
                    Profile
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      localStorage.removeItem(`recs_${currentUser.id}`);
                      logout();
                      router.push("/");
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => router.push("/Login")}
                >
                  Login
                </Button>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* SEARCH */}
      <Row className="justify-content-center mb-4">
        <Col xs={11} md={10} lg={10}>
          <Card className="p-3 shadow-sm">
            <Form>
              <Form.Control
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mb-2"
              />

              {isClient && (
                <Select
                  options={genreOptions}
                  value={selectedGenres}
                  onChange={(s) =>
                    setSelectedGenres((s || []) as any)
                  }
                  isMulti
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

      {/* MAIN + SIDEBAR */}
      <Row className="justify-content-center">
        <Col xs={11} md={10} lg={10}>
          <Row>
            <Col lg={9}>
              {nowShowing.length > 0 && (
                <>
                  <h5>Now Showing</h5>
                  <Row>{nowShowing.map(renderMovieCard)}</Row>
                </>
              )}

              {comingSoon.length > 0 && (
                <>
                  <h5 className="mt-4">Coming Soon</h5>
                  <Row>{comingSoon.map(renderMovieCard)}</Row>
                </>
              )}

              {noResults && <p>No results found.</p>}
            </Col>

            <Col lg={3}>{renderSidebar()}</Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;