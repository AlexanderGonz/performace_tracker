import React from 'react';
import { useForm } from 'react-hook-form';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel } from '@ionic/react';
import ErrorMessage from '../ErrorMessage';
import { AthleteFormData } from '../../../domain/models/Athlete';
import {  useAthlete } from '../../hooks/useAthleteForm';
import { useAthleteSubmit } from 'apps/frontend/src/app/hooks/useAthleteSubmit';

interface AthleteFormProps {
  athleteId?: string;
}

const AthleteForm: React.FC<AthleteFormProps> = ({ athleteId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AthleteFormData>();
  const { submitAthlete, isSubmitting, error } = useAthleteSubmit(athleteId);
  const { data: athlete, isLoading } = athleteId ? useAthlete(athleteId) : { data: null, isLoading: false };

  const onSubmit = (data: AthleteFormData) => {
    submitAthlete(data);
  };

  if (athleteId && isLoading) return <div>Loading...</div>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{athleteId ? 'Edit Athlete' : 'Create Athlete'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel position="floating">Name</IonLabel>
            <IonInput {...register('name', { required: 'Name is required' })} defaultValue={athlete?.name} />
            {errors.name && <ErrorMessage message={errors.name.message || ''} />}
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Age</IonLabel>
            <IonInput type="number" {...register('age', { required: 'Age is required', min: { value: 0, message: 'Age must be positive' } })} defaultValue={athlete?.age} />
            {errors.age && <ErrorMessage message={errors.age.message || ''} />}
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Team</IonLabel>
            <IonInput {...register('team', { required: 'Team is required' })} defaultValue={athlete?.team} />
            {errors.team && <ErrorMessage message={errors.team.message || ''} />}
          </IonItem>
          <IonButton expand="block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Athlete'}
          </IonButton>
          {error && <ErrorMessage message={error.message || 'An error occurred'} />}
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AthleteForm;