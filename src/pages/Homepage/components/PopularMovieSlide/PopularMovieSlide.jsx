import { Alert, Spinner } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import MovieCard from '../MovieCard/MovieCard';
import './PopularMovieSlide.style.css';
import { usePopularMoviesQuery } from '../../../../hooks/usePopularMovies';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1280 }, items: 6 },
  laptop: { breakpoint: { max: 1280, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 600 }, items: 3 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 2 },
};

export default function PopularMovieSlide({ onMovieClick }) {
  const { data, isLoading, isError, error } = usePopularMoviesQuery();

  if (isLoading)
    return (
      <div className="movie-loading">
        <Spinner animation="border" variant="light" />
      </div>
    );

  if (isError) return <Alert variant="danger">{error.message}</Alert>;

  return (
    <div className="movie-card-sec">
      <h3 className="movie-title">보고 또 봐도 좋은 인기 시리즈</h3>
      <Carousel
        responsive={responsive}
        infinite
        itemClass="movie-slide p-1"
        containerClass="movie-carousel"
        arrows
        draggable
      >
        {data.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </Carousel>
    </div>
  );
}
