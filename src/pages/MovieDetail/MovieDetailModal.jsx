import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './MovieDetailModal.style.css';

export default function MovieDetailModal({ movie, onClose, onMovieClick }) {
  const [movieDetail, setMovieDetail] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------------
     영화 상세, 비디오, 추천영화
  --------------------------------------------------------- */
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);

        const { data: detailData } = await api.get(`/movie/${movie.id}`, {
          params: { language: 'ko-KR' },
        });
        setMovieDetail(detailData);

        const { data: videoData } = await api.get(`/movie/${movie.id}/videos`, {
          params: { language: 'ko-KR' },
        });
        const trailer = videoData.results.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        setTrailerKey(trailer ? trailer.key : null);

        const { data: recData } = await api.get(
          `/movie/${movie.id}/recommendations`,
          { params: { language: 'ko-KR' } }
        );
        setRecommendations(recData.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movie]);

  /* ---------------------------------------------------------
     리뷰 가져오기 (영어 + 페이지네이션)
  --------------------------------------------------------- */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get(`/movie/${movie.id}/reviews`, {
          params: {
            page: reviewPage, // 페이지네이션 적용
            language: 'en-US', // 영어 리뷰
          },
        });

        setTotalReviewPages(data.total_pages || 1);

        setReviews(
          data.results.map((r) => ({
            ...r,
            expanded: false,
          })) || []
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
  }, [movie, reviewPage]);

  if (loading || !movieDetail)
    return <div className="modal-loading">Loading...</div>;

  const imgUrl = `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`;
  const genres = movieDetail.genres.map((g) => g.name).join(', ');

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const toggleReview = (id) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, expanded: !r.expanded } : r))
    );
  };

  /* 별점(author_details.rating) → 10점 → 5점으로 변환 */
  const renderStars = (rating) => {
    if (!rating) return <span className="rating-none">No rating</span>;

    const score = Math.round(rating / 2); // 5점 기준으로 환산
    return (
      <span className="review-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n <= score ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </span>
    );
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>

          {/* ---------------- 상세 정보 ---------------- */}
          <div className="modal-header-alt">
            <img src={imgUrl} alt={movieDetail.title} className="poster-alt" />

            <div className="movie-info-alt">
              <h2 className="movie-title-alt">{movieDetail.title}</h2>

              <div className="poster-info-line">
                <span className="genre-badge">{genres}</span>
                <span className="rating-badge">
                  ⭐ {movieDetail.vote_average.toFixed(1)}
                </span>
              </div>

              <div className="info-section-alt">
                <div className="info-card-alt">
                  <div className="info-card-icon">🔥</div>
                  <div className="info-text">
                    <span className="info-label-alt">인기도</span>
                    <span className="info-value-alt">
                      {Math.round(movieDetail.popularity)}
                    </span>
                  </div>
                </div>
                <div className="info-card-alt">
                  <div className="info-card-icon">💰</div>
                  <div className="info-text">
                    <span className="info-label-alt">예산</span>
                    <span className="info-value-alt">
                      {movieDetail.budget.toLocaleString()} 원
                    </span>
                  </div>
                </div>
                <div className="info-card-alt">
                  <div className="info-card-icon">📅</div>
                  <div className="info-text">
                    <span className="info-label-alt">개봉일</span>
                    <span className="info-value-alt">
                      {movieDetail.release_date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overview-alt">
                <p>{movieDetail.overview}</p>
              </div>

              {trailerKey && (
                <button
                  className="trailer-btn"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶ 예고편
                </button>
              )}
            </div>
          </div>

          {/* ---------------- 리뷰 ---------------- */}
          <div className="modal-section">
            <h3>리뷰</h3>

            {reviews.length === 0 ? (
              <p>리뷰가 없습니다.</p>
            ) : (
              <div className="review-grid">
                {reviews.map((review) => (
                  <div className="review-card" key={review.id}>
                    <p className="review-author">{review.author}</p>

                    {/* ⭐ 리뷰 별점 */}
                    <div className="review-rating">
                      {renderStars(review.author_details?.rating)}
                    </div>

                    <p className="review-content">
                      {review.expanded
                        ? review.content
                        : truncateText(review.content, 200)}
                    </p>

                    {review.content.length > 40 && (
                      <button
                        className="review-toggle"
                        onClick={() => toggleReview(review.id)}
                      >
                        {review.expanded ? '접기 ▲' : '더보기 ▼'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ⭐ 리뷰 페이지네이션 */}
            {totalReviewPages > 1 && (
              <div className="review-pagination">
                <button
                  disabled={reviewPage === 1}
                  onClick={() => setReviewPage((p) => p - 1)}
                >
                  이전
                </button>

                <span>
                  {reviewPage} / {totalReviewPages}
                </span>

                <button
                  disabled={reviewPage === totalReviewPages}
                  onClick={() => setReviewPage((p) => p + 1)}
                >
                  다음
                </button>
              </div>
            )}
          </div>

          {/* ---------------- 추천 영화 ---------------- */}
          <div className="modal-section">
            <h3>추천 영화</h3>
            {recommendations.length === 0 ? (
              <p>추천 영화가 없습니다.</p>
            ) : (
              <div className="recommendation-slider">
                {recommendations.map((rec) => (
                  <div
                    className="recommendation-card"
                    key={rec.id}
                    onClick={() => onMovieClick(rec)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                      alt={rec.title}
                    />
                    <p>{rec.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- 트레일러 ---------------- */}
      {showTrailer && (
        <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
          <div className="trailer-wrapper" onClick={(e) => e.stopPropagation()}>
            <button
              className="trailer-close"
              onClick={() => setShowTrailer(false)}
            >
              ✕
            </button>
            {trailerKey ? (
              <iframe
                width="100%"
                height="480"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="예고편"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            ) : (
              <p>예고편을 불러올 수 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
