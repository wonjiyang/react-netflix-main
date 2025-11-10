import { useEffect, useState, useRef } from 'react';
import { Alert } from 'react-bootstrap';
import { usePopularMoviesQuery } from '../../../../hooks/usePopularMovies';
import './Banner.style.css';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaPlay } from 'react-icons/fa';

const DEFAULT_BANNER = '/default-banner.jpg';

function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export default function FullAutoBannerKo() {
  const { data, isLoading, isError, error } = usePopularMoviesQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const movies = data?.results || [];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  useEffect(() => {
    if (movies.length === 0) return;
    startAutoSlide();
    return () => stopAutoSlide();
  }, [movies]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(nextSlide, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  if (isLoading) return <div className="spinner">Loading...</div>;
  if (isError) return <Alert variant="danger">{error.message}</Alert>;
  if (movies.length === 0) return null;

  return (
    <div
      className="banner-container"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      {movies.map((movie, index) => {
        const imageUrl = movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : DEFAULT_BANNER;

        return (
          <div
            key={movie.id}
            className={`banner ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <div className="banner-overlay" />
            <div className="banner-text-area">
              <h1>{movie.title || ''}</h1>
              <p>{truncateText(movie.overview, 100) || ''}</p>
              <div className="banner-buttons">
                <button className="play-btn">
                  <FaPlay className="play-icon" />
                  재생
                </button>
                <button className="info-btn">
                  <AiOutlineInfoCircle className="info-icon" />
                  상세정보
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="dots">
        {movies.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
