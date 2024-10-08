import React from 'react';
import { IonContent } from '@ionic/react';

interface PageContentProps {
  children: React.ReactNode;
}

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <IonContent>
      {children}
    </IonContent>
  );
};

export default PageContent;