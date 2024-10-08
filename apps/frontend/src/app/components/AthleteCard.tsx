import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { Athlete } from '@/domain/models/Athlete';
import { useCardColor } from '../hooks/useCardColor';
import { AthleteCardActions } from './AthleteCardActions';
import { AthleteCardContent } from './AthleteCardContent';

interface AthleteCardProps {
  athlete: Athlete;
  editAthleteId: string;
  onDelete: () => void;
}

const AthleteCard: React.FC<AthleteCardProps> = ({ athlete, editAthleteId, onDelete }) => {
  const cardColor = useCardColor(athlete.name);

  return (
    <IonCard style={{ backgroundColor: cardColor }}>
      <IonCardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IonCardTitle>{athlete.name}</IonCardTitle>
          <AthleteCardActions editAthleteId={editAthleteId} onDelete={onDelete} />
        </div>
      </IonCardHeader>
      <IonCardContent>
        <AthleteCardContent athlete={athlete} />
      </IonCardContent>
    </IonCard>
  );
};

export default AthleteCard;