import React, { useState, useEffect } from 'react';
import MovieCard from '../Homepage/components/MovieCard/MovieCard';
import MovieDetailModal from '../MovieDetail/MovieDetailModal';
import ReactPaginate from 'react-paginate';
import api from '../../utils/api';
import './Moviepage.style.css';
import { useMovieGenreQuery } from '../../hooks/useMovieGenre';
import { useSearchParams } from 'react-router-dom';

function MoviePage() {
  const { data: genreList } = useMovieGenreQuery();
  const [allMovies, setAllMovies] = useState([]); // 전체 영화 저장
  const [filteredMovies, setFilteredMovies] = useState([]); // 필터 후 영화
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('전체');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const MOVIES_PER_PAGE = 20;

  // 전체 영화 데이터를 가져오기 (최대 5페이지 정도로 제한 가능)
  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true);
        let page = 1;
        let results = [];
        const maxPages = 5; // 필요에 따라 조정 가능
        while (page <= maxPages) {
          const endpoint = searchQuery ? '/search/movie' : '/movie/popular';
          const { data } = await api.get(endpoint, {
            params: {
              query: searchQuery || undefined,
              language: 'ko-KR',
              page: page,
            },
          });
          results = results.concat(data.results);
          if (page >= data.total_pages) break;
          page++;
        }
        setAllMovies(results);

        // 장르 버튼용
        const genreSet = new Set();
        results.forEach((movie) => {
          movie.genre_ids?.forEach((gId) => {
            const genreName = genreList?.find((g) => g.id === gId)?.name;
            if (genreName) genreSet.add(genreName);
          });
        });
        setGenres(['전체', ...Array.from(genreSet)]);
        setSelectedGenre('전체');
        setCurrentPage(0); // 초기 페이지
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, [searchQuery, genreList]);

  // 필터 및 정렬 적용
  useEffect(() => {
    let tempMovies = [...allMovies];
    if (selectedGenre !== '전체') {
      tempMovies = tempMovies.filter((m) =>
        m.genre_ids.some(
          (id) => genreList?.find((g) => g.id === id)?.name === selectedGenre
        )
      );
    }

    if (sortBy === 'popularity.desc') {
      tempMovies.sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === 'vote_average.desc') {
      tempMovies.sort((a, b) => b.vote_average - a.vote_average);
    }

    setFilteredMovies(tempMovies);
    setCurrentPage(0); // 필터 적용 시 첫 페이지로
  }, [selectedGenre, sortBy, allMovies, genreList]);

  // 현재 페이지 영화 계산
  const pageCount = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
  const displayMovies = filteredMovies.slice(
    currentPage * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE + MOVIES_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="movie-page-container">
      <h2 className="page-title">
        {searchQuery ? `검색 결과: ${searchQuery}` : '인기 영화'}
      </h2>

      {/* 필터 */}
      <div className="filter-bar">
        <div className="genre-filter">
          {genres.map((g) => (
            <button
              key={g}
              className={`filter-btn ${selectedGenre === g ? 'active' : ''}`}
              onClick={() => setSelectedGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="sort-filter">
          <button
            className={`filter-btn ${
              sortBy === 'popularity.desc' ? 'active' : ''
            }`}
            onClick={() => setSortBy('popularity.desc')}
          >
            인기순
          </button>
          <button
            className={`filter-btn ${
              sortBy === 'vote_average.desc' ? 'active' : ''
            }`}
            onClick={() => setSortBy('vote_average.desc')}
          >
            평점순
          </button>
        </div>
      </div>

      {/* 영화 그리드 */}
      {loading ? (
        <div className="spinner-area">Loading...</div>
      ) : displayMovies.length === 0 ? (
        <div className="no-result">
          <h3>검색 결과가 없습니다.</h3>
        </div>
      ) : (
        <div className="movie-grid">
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => setSelectedMovie(movie)}
              genreList={genreList}
            />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {pageCount > 1 && (
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          containerClassName={'movie-pagination'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          activeClassName={'active'}
          disabledClassName={'disabled'}
        />
      )}

      {/* 영화 상세 모달 */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onMovieClick={(movie) => setSelectedMovie(movie)}
        />
      )}
    </div>
  );
}

export default MoviePage;
