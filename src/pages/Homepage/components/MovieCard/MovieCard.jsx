import React from 'react';
import { Badge } from 'react-bootstrap';
import { FaStar, FaFire, FaChild, FaExclamationTriangle } from 'react-icons/fa';
import { useMovieGenreQuery } from '../../../../hooks/useMovieGenre';
import './MovieCard.style.css';

function MovieCard({ movie }) {
  const { data: genresData } = useMovieGenreQuery();

  if (!movie.poster_path || !movie.title) return null;

  const imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const genres = movie.genre_ids
    .slice(0, 2)
    .map((id) => genresData?.find((g) => g.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="movie-card">
      <img src={imgUrl} alt={movie.title} className="movie-card-img" />
      <div className="movie-card-overlay">
        <h5 className="movie-card-title">{movie.title}</h5>

        <div className="movie-card-badges">
          {genres.map((genre) => (
            <Badge key={genre} bg="danger" className="me-1">
              {genre}
            </Badge>
          ))}
        </div>

        <div className="movie-card-info">
          <p>
            <FaStar /> {movie.vote_average.toFixed(1)}
          </p>
          <p>
            <FaFire /> {Math.round(movie.popularity)}
          </p>
          <p>
            {movie.adult ? (
              <>
                <FaExclamationTriangle /> 성인
              </>
            ) : (
              <>
                <FaChild /> 전체관람가
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
