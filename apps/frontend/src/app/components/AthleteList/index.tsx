import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/react';
import ErrorMessage from '../ErrorMessage';

const fetchAthletes = async () => {
  const response = await fetch('http://localhost:4000/athletes');
  if (!response.ok) {
    throw new Error('Failed to fetch athletes');
  }
  return response.json();
};

const AthleteList: React.FC = () => {
  const { data: athletes, isLoading, error } = useQuery({ queryKey: ['athletes'], queryFn: fetchAthletes });

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
            athletes.map((athlete: any) => (
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
      </IonContent>
    </IonPage>
  );
};

export default AthleteList;