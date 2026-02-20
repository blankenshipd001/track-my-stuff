import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';

import { BackButton } from './back-button';

describe('BackButton', () => {
  it('renders and calls provided click handler', () => {
    const fn = jest.fn();
    renderWithProviders(<BackButton buttonClick={fn} />);

    const el = screen.getByText(/Back/i);
    expect(el).toBeVisible();

    fireEvent.click(el);
    expect(fn).toHaveBeenCalled();
  });

  it('calls window.history.back when no buttonClick prop is provided', () => {
    const backMock = jest.fn();
    Object.defineProperty(window, 'history', {
      value: { back: backMock },
      writable: true,
    });

    renderWithProviders(<BackButton />);

    const el = screen.getByText(/Back/i);
    fireEvent.click(el);
    
    expect(backMock).toHaveBeenCalled();
  });
});
