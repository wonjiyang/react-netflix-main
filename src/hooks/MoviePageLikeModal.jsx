import { useState } from 'react';
import PopularMovieSlide from './PopularMovieSlide';
import GenreMovieSlide from './GenreMovieSlide';
import MovieDetail from '../MovieDetail/MovieDetail';

export default function MoviePageLikeModal() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div>
      <PopularMovieSlide onMovieClick={setSelectedMovie} />
      <GenreMovieSlide onMovieClick={setSelectedMovie} />

      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
