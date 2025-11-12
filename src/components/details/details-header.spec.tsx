import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';

// Mock AddToWatchlist so we don't bring in extra dependencies
jest.mock('@/components/buttons/AddToWatchlist', () => () => <div data-testid="add">AddStub</div>);

const backMock = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ back: backMock }) }));

import DetailsHeader from './details-header';

describe('DetailsHeader', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders back button and calls router.back when clicked', () => {
    renderWithProviders(<DetailsHeader user={null} media={{ id: 1, title: 'T' } as any} />);

    const btn = screen.getByRole('button', { name: /Back/i });
    expect(btn).toBeVisible();

    fireEvent.click(btn);
    expect(backMock).toHaveBeenCalled();
  });
});
