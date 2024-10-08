import React, { useMemo } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, useIonViewWillEnter } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import ErrorMessage from '../../components/ErrorMessage';
import { useAthlete } from '../../hooks/useAthleteForm';
import Metric from '../../components/Metric';
import { Athlete } from '../../../domain/models/Athlete';

const AthleteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: athlete, isLoading, error, refetch } = useAthlete(id);

  useIonViewWillEnter(() => {
    console.log('AthleteDetail view will enter');
    queryClient.invalidateQueries({ queryKey: ['athlete', id] });
    refetch();
  });

  const cardColor = useMemo(() => {
    if (!athlete) return 'primary';
    const hash = athlete.name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  }, [athlete]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <ErrorMessage message={(error as Error).message} />;
  if (!athlete) return <div>Athlete not found</div>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Athlete Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard style={{ backgroundColor: cardColor }}>
          <IonCardHeader>
            <IonCardTitle>{athlete.name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Age: {athlete.age}</p>
            <p>Team: {athlete.team}</p>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Metrics</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {athlete.metrics.length > 0 ? (
                athlete.metrics.map((metric) => (
                  <Metric key={metric.id} metric={metric} />
                ))
              ) : (
                <p>No metrics available</p>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AthleteDetail;