import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

const fetchPopularMovies = async () => {
  const response = await api.get('/movie/popular', {
    params: {
      language: 'ko-KR',
      page: 1,
    },
  });
  return response.data;
};

export const usePopularMoviesQuery = () =>
  useQuery({
    queryKey: ['movie-popular'],
    queryFn: fetchPopularMovies,
  });
