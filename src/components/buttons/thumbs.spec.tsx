import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';

import { ThumbUpButton } from './thumb-up-button';
import { ThumbDownButton } from './thumb-down-button';

describe('Thumb buttons', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls console.log when thumb up clicked', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const movie = { title: 'X' } as any;
    renderWithProviders(<ThumbUpButton movie={movie} />);

  const btn = screen.getByRole('button');
  // the click handler is attached to the inner icon (svg), so click that
  const svg = btn.querySelector('svg');
  if (svg) fireEvent.click(svg);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('calls console.log when thumb down clicked', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const movie = { title: 'Y' } as any;
    renderWithProviders(<ThumbDownButton movie={movie} />);

  const btn = screen.getByRole('button');
  const svg = btn.querySelector('svg');
  if (svg) fireEvent.click(svg);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
