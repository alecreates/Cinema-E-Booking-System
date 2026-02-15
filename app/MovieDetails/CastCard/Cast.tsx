import { Movie } from "@/app/types/movie";
import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const Cast = ({ movie }: { movie: Movie }) => (
  <Card className="m-3 shadow-sm">
    <Card.Header>Cast</Card.Header>
    <ListGroup variant="flush">
      {movie.cast.map((c) => (
        <ListGroup.Item key={c.name}>
          <strong>{c.name}</strong> as {c.role}
        </ListGroup.Item>
      ))}
    </ListGroup>
  </Card>
);

export default Cast;
