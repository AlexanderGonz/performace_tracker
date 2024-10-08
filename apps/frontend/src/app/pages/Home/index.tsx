import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import AthleteList from '../../components/AthleteList';
import FloatingAddButton from '../../components/FloatingButton';


const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Athletes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Athletes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AthleteList />
        <FloatingAddButton routePath="/athletes/new" />
      </IonContent>
    </IonPage>
  );
};

export default Home;