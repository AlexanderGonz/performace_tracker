import React from 'react';
import { IonText } from '@ionic/react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <IonText color="danger"> 
      <p>{message}</p>
    </IonText>
  );
};

export default ErrorMessage;