import React, { useState, useEffect } from 'react';
import { useSearchMovieQuery } from '../../hooks/useSearchMovie';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../Homepage/components/MovieCard/MovieCard';
import ReactPaginate from 'react-paginate'; // ✅ 추가!
import './MoviePage.style.css';

function MoviePage() {
  const [query] = useSearchParams();
  const keyword = query.get('q') || '';
  const [page, setPage] = useState(1);

  // 검색어가 바뀔 때마다 페이지 초기화
  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const { data, isLoading, isError, error } = useSearchMovieQuery({
    keyword,
    page,
  });

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  // 이미지 & 제목 없는 항목 제외
  const movies =
    data?.results?.filter((movie) => movie.poster_path && movie.title) || [];

  return (
    <div className="movie-page-container">
      {keyword && (
        <h2 className="page-title">
          검색 결과: <span>{keyword}</span>
        </h2>
      )}

      {isLoading && <div className="spinner-area">로딩중...</div>}

      {isError && (
        <div className="no-result">
          <h3>오류가 발생했습니다.</h3>
          <p>{error?.message || '알 수 없는 오류'}</p>
        </div>
      )}

      {!isLoading && !isError && movies.length === 0 && (
        <div className="no-result">
          <h3>검색 결과가 없습니다.</h3>
        </div>
      )}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}

            {/* 카드가 적을 때 빈칸 유지 */}
            {movies.length < 6 &&
              Array.from({ length: 6 - movies.length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="movie-card empty-card" />
              ))}
          </div>

          {/* 페이지네이션 */}
          {data?.total_pages > 1 && (
            <ReactPaginate
              nextLabel="▶"
              previousLabel="◀"
              pageCount={data.total_pages}
              forcePage={page - 1}
              onPageChange={handlePageClick}
              containerClassName="netflix-pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          )}
        </>
      )}
    </div>
  );
}

export default MoviePage;
