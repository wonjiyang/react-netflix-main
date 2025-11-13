import { useQuery } from '@tanstack/react-query';
import { Alert, Spinner } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import MovieCard from '../MovieCard/MovieCard';
import api from '../../../../utils/api';
import './GenreMovie.style.css';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1280 }, items: 6 },
  laptop: { breakpoint: { max: 1280, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 600 }, items: 3 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 2 },
};

const fetchMoviesByGenre = async (genreId) => {
  const res = await api.get('/discover/movie', {
    params: { with_genres: genreId, language: 'ko-KR', page: 1 },
  });
  return res.data;
};

function GenreCarousel({ genreId, title, onMovieClick }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`genre-${genreId}-movies`],
    queryFn: () => fetchMoviesByGenre(genreId),
  });

  if (isLoading)
    return (
      <div className="movie-loading">
        <Spinner animation="border" variant="light" />
      </div>
    );

  if (isError) return <Alert variant="danger">{error.message}</Alert>;
  if (!data?.results || data.results.length === 0)
    return <Alert variant="warning">{title} 영화가 없습니다.</Alert>;

  return (
    <div className="movie-card-sec">
      <h3 className="movie-title">{title}</h3>
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

export default function GenreMovieSlide({ onMovieClick }) {
  return (
    <>
      <GenreCarousel
        genreId={35}
        title="코미디 시리즈"
        onMovieClick={onMovieClick}
      />
      <GenreCarousel
        genreId={28}
        title="액션 시리즈"
        onMovieClick={onMovieClick}
      />
      <GenreCarousel
        genreId={18}
        title="드라마 시리즈"
        onMovieClick={onMovieClick}
      />
    </>
  );
}
