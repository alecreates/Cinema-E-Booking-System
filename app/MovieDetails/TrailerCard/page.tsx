import { Movie } from "@/types/movie";
import { Card } from "react-bootstrap";

const TrailerCard = ({ movie }: { movie: Movie }) => (
    <Card className="shadow-sm m-3">

        <Card.Header className="text-center">Watch Trailer</Card.Header>
        <div className="video-responsive d-flex justify-content-center">
            <iframe width="560" 
                height="315" 
                src={movie.trailerUrl} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen></iframe>
        </div>
    </Card>
);

export default TrailerCard;
