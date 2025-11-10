import { usePopularMoviesQuery } from '../../../../hooks/usePopularMovies';
import { Alert, Spinner } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './PopularMovieSlide.style.css';
import MovieCard from '../MovieCard/MovieCard';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1280 },
    items: 6,
  },
  laptop: {
    breakpoint: { max: 1280, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 2,
  },
};

function PopularMovieSlide() {
  const { data, isLoading, isError, error } = usePopularMoviesQuery();

  if (isLoading)
    return (
      <div className="netflix-loading">
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
        itemClass="netflix-slide p-1"
        containerClass="netflix-carousel"
        arrows={true}
        draggable
      >
        {data.results.map((movie, index) => (
          <MovieCard movie={movie} key={index} />
        ))}
      </Carousel>
    </div>
  );
}

export default PopularMovieSlide;
