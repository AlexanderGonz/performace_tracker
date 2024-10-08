import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMetric } from '../services/api';
import { Metric } from '../../domain/models/Metric';

export const useMetricForm = (athleteId: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: Omit<Metric, 'id' | 'athleteId'>) => createMetric(athleteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete', athleteId] });
      setIsOpen(false);
    },
  });

  const openForm = () => setIsOpen(true);
  const closeForm = () => setIsOpen(false);

  return {
    isOpen,
    openForm,
    closeForm,
    createMetric: mutate,
    isPending,
    error,
  };
};