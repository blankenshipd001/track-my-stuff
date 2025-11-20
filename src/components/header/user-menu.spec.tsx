import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';

import UserMenu from './user-menu';

describe('UserMenu', () => {
  it('shows email in menu and calls onLogout when Log Out clicked', () => {
    const onLogout = jest.fn();
    const user = { uid: 'u1', email: 'a@b.com', picture: '' };

    renderWithProviders(<UserMenu user={user} onLogout={onLogout} />);

    // Click the avatar button to open menu
    const avatarBtn = screen.getByRole('button');
    fireEvent.click(avatarBtn);

    // Email should be visible
    expect(screen.getByText(/a@b.com/i)).toBeVisible();

    // Click Log Out
    const logout = screen.getByRole('button', { name: /Log Out/i });
    fireEvent.click(logout);

    expect(onLogout).toHaveBeenCalled();
  });
});
