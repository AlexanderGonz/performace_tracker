import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import Home from 'apps/frontend/src/app/pages/Home';
import AthleteList from 'apps/frontend/src/app/components/AthleteList';
import AthleteForm from 'apps/frontend/src/app/components/AthleteForm';

setupIonicReact();

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home" component={Home} exact={true} />
          <Route path="/athletes" component={AthleteList} exact={true} />
          {/* <Route path="/athletes/:id" component={AthleteDetails} exact={true} /> */}
          <Route path="/athletes/new" component={AthleteForm} exact={true} />
          <Route path="/athletes/:id/edit" component={AthleteForm} exact={true} />
          {/* <Route path="/athletes/:id/metrics/new" component={MetricForm} exact={true} /> */}
          <Route exact path="/" render={() => <Redirect to="/home" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </QueryClientProvider>
);

export default App;
