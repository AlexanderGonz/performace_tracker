import React from 'react';
import { IonPage, useIonViewWillEnter } from '@ionic/react';
import { useQueryClient } from '@tanstack/react-query';
import AthleteList from '../components/AthleteList';
import { useAthletes } from '../hooks/useAthletes';
import PageContent from '@/app/components/PageContent';
import PageHeader from '@/app/components/PageHeader';
import FloatingAddButton from '@/app/components/FloatingButton';

const Home: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: athletes, isLoading, error, refetch } = useAthletes();

  useIonViewWillEnter(() => {
    queryClient.invalidateQueries({ queryKey: ['athletes'] });
    refetch();
  });

  return (
    <IonPage>
      <PageHeader title="Athletes" />
      <PageContent>
        <AthleteList athletes={athletes} isLoading={isLoading} error={error as Error | null} />
        <FloatingAddButton routePath="/athletes/new" />
      </PageContent>
    </IonPage>
  );
};

export default Home;