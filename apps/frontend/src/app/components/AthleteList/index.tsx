import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, useIonViewWillEnter } from '@ionic/react';
import ErrorMessage from '../ErrorMessage';
import { useAthletes } from '../../hooks/useAthletes';
import { Athlete } from '../../../domain/models/Athlete';
import FloatingAddButton from 'apps/frontend/src/app/components/FloatingButton';
import { useQueryClient } from '@tanstack/react-query';

const AthleteList: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: athletes, isLoading, error, refetch } = useAthletes();

  useIonViewWillEnter(() => {
    console.log('AthleteList view will enter');
    queryClient.invalidateQueries({ queryKey: ['athletes'] });
    refetch();
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <ErrorMessage message={(error as Error).message} />;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Athletes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {athletes && athletes.length > 0 ? (
            athletes.map((athlete: Athlete) => (
              <IonItem key={athlete.id} routerLink={`/athletes/${athlete.id}`}>
                <IonLabel>{athlete.name}</IonLabel>
              </IonItem>
            ))
          ) : (
            <IonItem>
              <IonLabel>No athletes found</IonLabel>
            </IonItem>
          )}
        </IonList>
        <FloatingAddButton routePath="/athletes/new" />
      </IonContent>
    </IonPage>
  );
};

export default AthleteList;