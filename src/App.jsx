import { Route, Routes, Outlet } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import HomePage from './pages/Homepage/HomePage';
import MoviePage from './pages/Movies/MoviePage';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />

        <Route path="movies" element={<Outlet />}>
          <Route index element={<MoviePage />} />
          <Route path=":id" element={<MovieDetail />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
