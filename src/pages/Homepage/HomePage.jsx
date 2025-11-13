import Banner from './components/Banner/Banner';
import PopularMovieSlide from './components/PopularMovieSlide/PopularMovieSlide';
import GenreMovieSlide from './components/Genres/GenreMovieSlide';
import { useOutletContext } from 'react-router-dom';

function HomePage() {
  const { onMovieClick } = useOutletContext();

  return (
    <div>
      <Banner onMovieClick={onMovieClick} />
      <PopularMovieSlide onMovieClick={onMovieClick} />
      <GenreMovieSlide onMovieClick={onMovieClick} />
    </div>
  );
}

export default HomePage;
