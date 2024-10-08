import React from 'react';
import { IonList, IonItem, IonLabel, useIonViewWillEnter } from '@ionic/react';
import ErrorMessage from './ErrorMessage';
import { useAthletes } from '../hooks/useAthletes';
import { Athlete } from '../../domain/models/Athlete';
import { useQueryClient } from '@tanstack/react-query';

const AthleteList: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: athletes, isLoading, error, refetch } = useAthletes();

  useIonViewWillEnter(() => {
    queryClient.invalidateQueries({ queryKey: ['athletes'] });
    refetch();
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <ErrorMessage message={(error as Error).message} />;

  return (
    <IonList>
      {athletes && athletes.length > 0 ? (
        athletes.map((athlete: Athlete) => (
          <IonItem key={athlete.id} routerLink={`/athletes/${athlete.id}`}>
            <IonLabel>
              <h2>{athlete.name}</h2>
              <p>Age: {athlete.age}</p>
              <p>Team: {athlete.team || 'No team'}</p>
            </IonLabel>
          </IonItem>
        ))
      ) : (
        <IonItem>
          <IonLabel>No athletes found</IonLabel>
        </IonItem>
      )}
    </IonList>
  );
};

export default AthleteList;