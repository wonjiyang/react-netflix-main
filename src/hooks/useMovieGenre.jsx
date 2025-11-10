import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

const fetchMovieGenre = async () => {
  const response = await api.get('/genre/movie/list', {
    params: { language: 'ko-KR' },
  });
  return response.data.genres;
};

export const useMovieGenreQuery = () => {
  return useQuery({
    queryKey: ['movie-genre'],
    queryFn: fetchMovieGenre,
    staleTime: 300000,
  });
};
