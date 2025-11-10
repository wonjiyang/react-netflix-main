import Banner from './components/Banner/Banner';
import PopularMovieSlide from './components/PopularMovieSlide/PopularMovieSlide';
import GenreMovieSlide from './components/Genres/GenreMovieSlide';

function HomePage() {
  return (
    <div>
      <Banner testMode={false} />
      <PopularMovieSlide />
      <GenreMovieSlide />
    </div>
  );
}

export default HomePage;
