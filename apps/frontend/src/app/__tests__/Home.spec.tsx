import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IonReactRouter } from '@ionic/react-router';
import { IonApp } from '@ionic/react';
import Home from '../pages/Home';
import { useAthletes } from '../hooks/useAthletes'; 
import * as reactQuery from '@tanstack/react-query';

// Mock the useAthletes hook
jest.mock('../hooks/useAthletes');


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

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders AthleteList when data is loaded', async () => {
    const mockAthletes = [
      { id: '1', name: 'John Doe', age: 25, team: 'Team A' },
      { id: '2', name: 'Jane Smith', age: 28, team: 'Team B' },
    ];

    (useAthletes as jest.Mock).mockReturnValue({
      data: mockAthletes,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    await act(async () => { 
      renderWithProviders(<Home />);
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Age: 25')).toBeInTheDocument();
      expect(screen.getByText('Team: Team A')).toBeInTheDocument();
    });
  });

  it('displays "No athletes found" when the list is empty', async () => {
    (useAthletes as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    await act(async () => { 
      renderWithProviders(<Home />);
    });

    await waitFor(() => {
      expect(screen.getByText('No athletes found')).toBeInTheDocument();
    });
  });

  it('displays FloatingAddButton as IonFab', () => {
    renderWithProviders(<Home />);

    const fabButton = screen.getByTestId('floating-add-button');
    expect(fabButton).toBeInTheDocument();
    expect(fabButton.closest('ion-fab')).toBeInTheDocument();
  });
});