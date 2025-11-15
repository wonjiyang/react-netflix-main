import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

export const useMovieReviews = (movieId, page = 1) =>
  useQuery({
    queryKey: ['movieReviews', movieId, page],
    queryFn: async () => {
      const res = await api.get(
        `/movie/${movieId}/reviews?language=en-US&page=${page}`
      );
      return res.data;
    },
    enabled: !!movieId,
  });
