import React from 'react';
import { IonItem, IonLabel, IonNote } from '@ionic/react';
import { MetricViewModel} from '../../domain/models/Metric';

interface MetricItemProps {
  metric: MetricViewModel;
}

const MetricItem: React.FC<MetricItemProps> = ({ metric }) => {
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

export default MetricItem;