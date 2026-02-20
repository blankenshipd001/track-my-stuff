import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';
import { IconButton } from './icon-button';
import StarIcon from '@mui/icons-material/Star';

describe('IconButton', () => {
  it('renders with label and icon', () => {
    renderWithProviders(
      <IconButton 
        label="Test Button" 
        buttonIcon={<StarIcon data-testid="star-icon" />} 
      />
    );

    expect(screen.getByText('Test Button')).toBeVisible();
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    renderWithProviders(
      <IconButton 
        label="Clickable Button" 
        buttonIcon={<StarIcon />} 
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: 'Clickable Button' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders without onClick handler', () => {
    renderWithProviders(
      <IconButton 
        label="No Click" 
        buttonIcon={<StarIcon />} 
      />
    );

    const button = screen.getByRole('button', { name: 'No Click' });
    expect(button).toBeVisible();
    
    // Should not throw when clicked
    fireEvent.click(button);
  });

  it('renders as MUI Button with correct variant', () => {
    renderWithProviders(
      <IconButton 
        label="Styled Button" 
        buttonIcon={<StarIcon />} 
      />
    );

    const button = screen.getByRole('button', { name: 'Styled Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('MuiButton-root');
    expect(button).toHaveClass('MuiButton-outlined');
  });
});
