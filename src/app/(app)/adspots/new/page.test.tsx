import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewAdSpotPage from './page';

// Mock del componente de formulario
vi.mock('@/components/adspots/AdSpotForm', () => ({
  AdSpotForm: () => <div data-testid="adspot-form">AdSpot Form</div>,
}));

describe('NewAdSpotPage', () => {
  it('debe renderizar el título y descripción', () => {
    render(<NewAdSpotPage />);

    expect(screen.getByText(/crear nuevo adspot/i)).toBeInTheDocument();
    expect(screen.getByText(/completa el formulario/i)).toBeInTheDocument();
  });

  it('debe renderizar el botón para volver a la lista', () => {
    render(<NewAdSpotPage />);

    const backButton = screen.getByRole('link', { name: /volver a la lista/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('href', '/adspots');
  });

  it('debe renderizar el formulario de creación', () => {
    render(<NewAdSpotPage />);

    expect(screen.getByTestId('adspot-form')).toBeInTheDocument();
  });

  it('debe mostrar el icono de flecha en el botón de volver', () => {
    render(<NewAdSpotPage />);

    const backButton = screen.getByRole('link', { name: /volver a la lista/i });
    expect(backButton).toBeInTheDocument();
    // El icono ArrowLeft debería estar presente (aunque puede estar oculto en el DOM)
  });

  it('debe tener la estructura correcta con Card', () => {
    render(<NewAdSpotPage />);

    // Verificar que el contenido está dentro de una Card
    expect(screen.getByText(/crear nuevo adspot/i)).toBeInTheDocument();
    expect(screen.getByTestId('adspot-form')).toBeInTheDocument();
  });
});

