import React, { useMemo } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, useIonViewWillEnter, IonButton, IonItem, useIonRouter } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import ErrorMessage from '../../components/ErrorMessage';
import { useAthlete } from '../../hooks/useAthleteForm';
import Metric from '../../components/Metric';
import { createMetric } from '../../services/api';
import { useMetricForm } from '../../hooks/useMetricForm';
import MetricModal from '../../components/MetricModal';
import ActionButton from '../../components/ActionButton';

const AthleteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ionRouter = useIonRouter();
  const queryClient = useQueryClient();
  const { data: athlete, isLoading, error, refetch } = useAthlete(id);
  const { isOpen, openForm, closeForm, createMetric, isPending: isCreatingMetric, error: createError } = useMetricForm(id);

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

  const handleSubmit = (data: { metricType: string; value: number; unit: string }) => {
    createMetric({
      ...data,
      timestamp: new Date(),
    });
  };

  const navigateToEditForm = () => {
    ionRouter.push(`/athletes/${id}/edit`);
  };

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>{athlete.name}</IonCardTitle>
                <ActionButton onClick={navigateToEditForm} iconType="edit" />
            </div>
          </IonCardHeader>
          <IonCardContent>
            <p>Age: {athlete.age}</p>
            <p>Team: {athlete.team}</p>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <IonCardTitle>Metrics</IonCardTitle>
              <ActionButton onClick={openForm} iconType="add" />
            </div>
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
        <MetricModal
          isOpen={isOpen}
          onClose={closeForm}
          onSubmit={handleSubmit}
          isLoading={isCreatingMetric}
          error={createError as Error | null}
        />
      </IonContent>
    </IonPage>
  );
};

export default AthleteDetail;