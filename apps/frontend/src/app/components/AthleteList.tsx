import React from 'react';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import ErrorMessage from './ErrorMessage';
import { Athlete } from '../../domain/models/Athlete';

interface AthleteListItemProps {
  athlete: Athlete;
}

const AthleteListItem: React.FC<AthleteListItemProps> = ({ athlete }) => (
  <IonItem key={athlete.id} routerLink={`/athletes/${athlete.id}`}>
    <IonLabel>
      <h2>{athlete.name}</h2>
      <p>Age: {athlete.age}</p>
      <p>Team: {athlete.team || 'No team'}</p>
    </IonLabel>
  </IonItem>
);

interface AthleteListProps {
  athletes: Athlete[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const AthleteList: React.FC<AthleteListProps> = ({ athletes, isLoading, error }) => {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <IonList>
      {athletes && athletes.length > 0 ? (
        athletes.map((athlete: Athlete) => (
          <AthleteListItem key={athlete.id} athlete={athlete} />
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