import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAthlete as deleteAthleteService } from '../services/api';
import { useIonRouter } from '@ionic/react';

export const useDeleteAthlete = () => {
  const queryClient = useQueryClient();
  const ionRouter = useIonRouter();

  const { mutate, isPending, error } = useMutation({
    mutationFn: deleteAthleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
      ionRouter.push('/home');
    },
  });

  return { deleteAthlete: mutate, isDeleting: isPending, deleteError: error };
};