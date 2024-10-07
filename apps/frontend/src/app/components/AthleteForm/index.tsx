import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel } from '@ionic/react';
import ErrorMessage from '../ErrorMessage';

interface AthleteFormData {
  name: string;
  age: number;
  team: string;
}

const createAthlete = async (data: AthleteFormData) => {
  const response = await fetch('http://localhost:4000/athletes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create athlete');
  }
  return response.json();
};

const AthleteForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<AthleteFormData>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAthlete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
      // Redirect or show success message
    },
  });

  const onSubmit = (data: AthleteFormData) => {
    mutation.mutate(data);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Athlete</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel position="floating">Name</IonLabel>
            <IonInput {...register('name', { required: 'Name is required' })} />
            {errors.name && <ErrorMessage message={errors.name.message || ''} />}
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Age</IonLabel>
            <IonInput type="number" {...register('age', { required: 'Age is required', min: { value: 0, message: 'Age must be positive' } })} />
            {errors.age && <ErrorMessage message={errors.age.message || ''} />}
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Team</IonLabel>
            <IonInput {...register('team', { required: 'Team is required' })} />
            {errors.team && <ErrorMessage message={errors.team.message || ''} />}
          </IonItem>
          <IonButton expand="block" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create Athlete'}
          </IonButton>
          {mutation.isError && <ErrorMessage message={(mutation.error as Error).message} />}
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AthleteForm;