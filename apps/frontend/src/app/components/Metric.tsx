import React from 'react';
import { IonItem, IonLabel, IonNote } from '@ionic/react';
import { Metric as MetricType } from '../../domain/models/Metric';

interface MetricProps {
  metric: MetricType;
}

const Metric: React.FC<MetricProps> = ({ metric }) => {
  return (
    <IonItem>
      <IonLabel>
        <h2>{metric.metricType}</h2>
        <p>{metric.value} {metric.unit}</p>
      </IonLabel>
      <IonNote slot="end">
        {new Date(metric.timestamp).toLocaleString()}
      </IonNote>
    </IonItem>
  );
};

export default Metric;