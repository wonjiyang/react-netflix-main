import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

const fetchSearchMovie = async ({ keyword, page = 1 }) => {
  if (keyword) {
    return api.get('/search/movie', {
      params: { query: keyword, page, language: 'ko-KR' },
    });
  } else {
    return api.get('/movie/popular', {
      params: { page, language: 'ko-KR' },
    });
  }
};

export const useSearchMovieQuery = ({ keyword, page }) => {
  return useQuery({
    queryKey: ['movie-search', keyword, page],
    queryFn: () => fetchSearchMovie({ keyword, page }),
    select: (res) => res.data,
    staleTime: 300000,
  });
};
