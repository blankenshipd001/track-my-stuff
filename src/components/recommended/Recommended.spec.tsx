import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';

// Mock next/image to a simple img element
jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

import Recommended from './Recommended';

describe('Recommended', () => {
  it('renders poster and calls handleClick when image is clicked', () => {
    const shows = [
      { id: 1, poster_path: '/p1.jpg', title: 'S1' },
      { id: 2, poster_path: '/p2.jpg', title: 'S2' },
    ] as any;

    const handleClick = jest.fn();
    renderWithProviders(<Recommended shows={shows} handleClick={handleClick} />);

    const img = screen.getByAltText(/S1/i);
    expect(img).toBeVisible();

    fireEvent.click(img);
    expect(handleClick).toHaveBeenCalledWith(shows[0]);
  });
});
