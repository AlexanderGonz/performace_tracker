import { useIonRouter } from '@ionic/react';
import { useMemo } from 'react';

type NavigationPaths = {
  editAthlete: (id: string) => string;
  athleteDetail: (id: string) => string;
  createAthlete: () => string;
};

const navigationPaths: NavigationPaths = {
  editAthlete: (id: string) => `/athletes/${id}/edit`,
  athleteDetail: (id: string) => `/athletes/${id}`,
  createAthlete: () => `/athletes/new`,
};

type NavigateFunctions = {
  [K in keyof NavigationPaths]: (...args: Parameters<NavigationPaths[K]>) => void;
};

export const useNavigate = (): NavigateFunctions => {
  const ionRouter = useIonRouter();

  const navigate = useMemo(() => {
    const navigateFunctions: { [K in keyof NavigationPaths]: (...args: any[]) => void } = Object.fromEntries(
      Object.keys(navigationPaths).map(key => [key, (...args: any[]) => {}])
    ) as { [K in keyof NavigationPaths]: (...args: any[]) => void };
    
    (Object.keys(navigationPaths) as Array<keyof NavigationPaths>).forEach((key) => {
      navigateFunctions[key] = function(this: any, ...args: any[]) {
        const pathFunction = navigationPaths[key];
        const path = pathFunction.apply(this, args as any);
        ionRouter.push(path);
      } as NavigateFunctions[typeof key];
    });

    return navigateFunctions;
  }, [ionRouter]);

  return navigate;
};