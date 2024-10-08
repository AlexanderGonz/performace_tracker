import React from 'react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import HomeButton from '@/app/components/HomeButton';

interface PageHeaderProps {
  title: string;
  homeButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, homeButton=true }) => {
  return (
    <IonHeader>
      <IonToolbar>
        {homeButton 
        ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IonTitle>{title}</IonTitle>
          <HomeButton />
        </div>
        )
      : (
        <IonTitle>{title}</IonTitle>
      )}
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;