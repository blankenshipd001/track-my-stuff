import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { useRouter } from 'next/navigation';
import { User } from '@/data-models/user.interface';

import UserMenu from './user-menu';

describe('UserMenu', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('shows email in menu and calls onLogout when Log Out clicked', () => {
    const onLogout = jest.fn();
    const onDeleteAccount = jest.fn();
    const user: User = { uid: 'u1', name: 'Test User', email: 'a@b.com', picture: '', auth_time: 1234567890, firebase: { identities: {}, sign_in_provider: 'google.com' } };

    renderWithProviders(<UserMenu user={user} onLogout={onLogout} onDeleteAccount={onDeleteAccount} />);

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

  it('shows Delete Account button and confirmation dialog', async () => {
    const onLogout = jest.fn();
    const onDeleteAccount = jest.fn().mockResolvedValue(undefined);
    const user: User = { uid: 'u1', name: 'Test User', email: 'test@example.com', picture: '', auth_time: 1234567890, firebase: { identities: {}, sign_in_provider: 'google.com' } };

    renderWithProviders(<UserMenu user={user} onLogout={onLogout} onDeleteAccount={onDeleteAccount} />);

    // Click the avatar button to open menu
    const avatarBtn = screen.getByRole('button');
    fireEvent.click(avatarBtn);

    // Click Delete Account button
    const deleteBtn = screen.getByRole('button', { name: /Delete Account/i });
    fireEvent.click(deleteBtn);

    // Confirmation dialog should appear
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete your account/i)).toBeVisible();
    });

    // Cancel the deletion
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(onDeleteAccount).not.toHaveBeenCalled();
  });

  it('calls onDeleteAccount when confirmed in dialog', async () => {
    const onLogout = jest.fn();
    const onDeleteAccount = jest.fn().mockResolvedValue(undefined);
    const user: User = { uid: 'u1', name: 'Test User', email: 'test@example.com', picture: '', auth_time: 1234567890, firebase: { identities: {}, sign_in_provider: 'google.com' } };

    renderWithProviders(<UserMenu user={user} onLogout={onLogout} onDeleteAccount={onDeleteAccount} />);

    // Click the avatar button to open menu
    const avatarBtn = screen.getByRole('button');
    fireEvent.click(avatarBtn);

    // Click Delete Account button
    const deleteBtn = screen.getByRole('button', { name: /Delete Account/i });
    fireEvent.click(deleteBtn);

    // Wait for dialog and confirm deletion
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete your account/i)).toBeVisible();
    });

    const confirmBtn = screen.getByRole('button', { name: /^Delete Account$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(onDeleteAccount).toHaveBeenCalled();
    });
  });

  it('navigates to /providers when Add Providers button is clicked', () => {
    const onLogout = jest.fn();
    const onDeleteAccount = jest.fn();
    const user: User = { uid: 'u1', name: 'Test User', email: 'test@example.com', picture: '', auth_time: 1234567890, firebase: { identities: {}, sign_in_provider: 'google.com' } };
    const mockPush = jest.fn();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    renderWithProviders(<UserMenu user={user} onLogout={onLogout} onDeleteAccount={onDeleteAccount} />);

    // Click the avatar button to open menu
    const avatarBtn = screen.getByRole('button');
    fireEvent.click(avatarBtn);

    // Click Add Providers button
    const addProvidersBtn = screen.getByRole('button', { name: /Add Providers/i });
    fireEvent.click(addProvidersBtn);

    expect(mockPush).toHaveBeenCalledWith('/providers');
  });
});
