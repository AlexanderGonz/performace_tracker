import React, { Suspense, lazy} from 'react';
import { IonPage, useIonViewWillEnter } from '@ionic/react';
import { useQueryClient } from '@tanstack/react-query';
import { useAthletes } from '../hooks/useAthletes';
import PageContent from '@/app/components/PageContent';
import PageHeader from '@/app/components/PageHeader';
import FloatingAddButton from '@/app/components/FloatingButton';

const AthleteList = lazy(() => import('../components/AthleteList'));

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
        <Suspense fallback={<div>Loading athletes...</div>}>
          <AthleteList athletes={athletes} isLoading={isLoading} error={error as Error | null} />
        </Suspense>
        <FloatingAddButton routePath="/athletes/new" />
      </PageContent>
    </IonPage>
  );
};

export default Home;