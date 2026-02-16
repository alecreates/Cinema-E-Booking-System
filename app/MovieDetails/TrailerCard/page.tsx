import { Movie } from "@/app/types/movie";
import { Card } from "react-bootstrap";

const TrailerCard = ({ movie }: { movie: Movie }) => (
    <Card className="shadow-sm m-3">

        <Card.Header className="text-center">Watch Trailer</Card.Header>
        <div className="video-responsive d-flex justify-content-center">
            <iframe
                width="800"
                height="480"
                src={`https://www.youtube.com/embed/${movie.trailerUrl}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>
    </Card>
);

export default TrailerCard;
