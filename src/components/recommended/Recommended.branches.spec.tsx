import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';

jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

jest.mock('@/lib/imageUrl', () => ({ getProxyImageUrlForPath: (p: string) => `/proxy${p}` }));

import Recommended from './Recommended';

describe('Recommended component branches', () => {
  it('renders images and calls handleClick when poster exists', () => {
    const shows = [{ id: 1, poster_path: '/p.jpg', title: 'S1' } as any];
    const handleClick = jest.fn();

    renderWithProviders(<Recommended shows={shows} handleClick={handleClick} />);

    const img = screen.getByAltText(/S1/i);
    expect(img).toBeVisible();

    fireEvent.click(img);
    expect(handleClick).toHaveBeenCalledWith(shows[0]);
  });

  it('renders title even when poster is missing', () => {
    const shows = [{ id: 2, title: 'NoPoster' } as any];
    const handleClick = jest.fn();

    renderWithProviders(<Recommended shows={shows} handleClick={handleClick} />);

    expect(screen.getByText(/NoPoster/i)).toBeVisible();
    // there should be no image in this case
    expect(screen.queryByRole('img')).toBeNull();
  });
});
