import { useQuery } from '@tanstack/react-query';
import { fetchAthletes } from '../services/api';
import { Athlete } from '../../domain/models/Athlete';

export const useAthletes = () => {
  return useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
    staleTime: 0,
  });
};