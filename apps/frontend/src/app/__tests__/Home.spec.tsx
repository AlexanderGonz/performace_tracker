import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IonReactRouter } from '@ionic/react-router';
import { IonApp } from '@ionic/react';
import Home from '../pages/Home';
import { useAthletes } from '../hooks/useAthletes';

// Mock the useAthletes hook
jest.mock('../hooks/useAthletes');

// Mock the lazy-loaded AthleteList component
jest.mock('../components/AthleteList', () => ({
  __esModule: true,
  default: () => <div data-testid="athlete-list">Mocked Athlete List</div>,
}));

const mockQueryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={mockQueryClient}>
      <IonApp>
        <IonReactRouter>{ui}</IonReactRouter>
      </IonApp>
    </QueryClientProvider>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    (useAthletes as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('renders the Home component with correct title', async () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Athletes')).toBeInTheDocument();
  });

  it('displays loading state while fetching athletes', async () => {
    (useAthletes as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    renderWithProviders(<Home />);

    expect(screen.getByText('Loading athletes...')).toBeInTheDocument();
  });

  it('renders AthleteList when data is loaded', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('athlete-list')).toBeInTheDocument();
    });
  });

  it('displays FloatingAddButton as IonFab', () => {
    renderWithProviders(<Home />);

    const fabButton = screen.getByTestId('floating-add-button');
    expect(fabButton).toBeInTheDocument();
    expect(fabButton.closest('ion-fab')).toBeInTheDocument();
  });

  it('refetches data when IonViewWillEnter event is triggered', async () => {
    const mockRefetch = jest.fn();
    (useAthletes as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { container } = renderWithProviders(<Home />);

    // Simulate IonViewWillEnter event
    const ionPage = container.querySelector('ion-page');
    ionPage?.dispatchEvent(new Event('ionViewWillEnter'));

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('displays IonRefresher for pull-to-refresh functionality', () => {
    renderWithProviders(<Home />);

    expect(screen.getByTestId('ion-refresher')).toBeInTheDocument();
  });
});