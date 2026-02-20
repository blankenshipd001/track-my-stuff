import React from 'react';
import { renderWithProviders, screen, waitFor } from '@/utils/test-utils';
import { useRouter } from 'next/navigation';
import { User } from '@/data-models/user.interface';
import userEvent from '@testing-library/user-event';

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

  it('shows email in menu and calls onLogout when Log Out clicked', async () => {
    const onLogout = jest.fn();
    const onDeleteAccount = jest.fn();
    const user: User = { uid: 'u1', name: 'Test User', email: 'a@b.com', picture: '', auth_time: 1234567890, firebase: { identities: {}, sign_in_provider: 'google.com' } };

    renderWithProviders(<UserMenu user={user} onLogout={onLogout} onDeleteAccount={onDeleteAccount} />);

    // Click the avatar button to open menu
    const avatarBtn = screen.getByRole('button');
    await userEvent.click(avatarBtn);

    // Email should be visible
    await waitFor(() => {
      expect(screen.getByText(/a@b.com/i)).toBeVisible();
    });

    // Click Log Out
    const logout = screen.getByRole('button', { name: /Log Out/i });
    await userEvent.click(logout);

    expect(onLogout).toHaveBeenCalled();
  });

  it('shows Delete Account button and confirmation dialog', async () => {
    const onLogout = jest.fn();
    const onDeleteAccount = jest.fn().mockResolvedValue(undefined);
    const user: User = { uid: 'u1', name: 'Test User', email: 'test@example.com', picture: '', auth_time: 1234567890, firebase: { identities: {}, sign_in_provider: 'google.com' } };

    renderWithProviders(<UserMenu user={user} onLogout={onLogout} onDeleteAccount={onDeleteAccount} />);

    // Click the avatar button to open menu
    const avatarBtn = screen.getByRole('button');
    await userEvent.click(avatarBtn);

    // Click Delete Account button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Delete Account/i })).toBeInTheDocument();
    });
    const deleteBtn = screen.getByRole('button', { name: /Delete Account/i });
    await userEvent.click(deleteBtn);

    // Confirmation dialog should appear
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete your account/i)).toBeVisible();
    });

    // Cancel the deletion
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelBtn);

    expect(onDeleteAccount).not.toHaveBeenCalled();
  });

  it('calls onDeleteAccount when confirmed in dialog', async () => {
    const onLogout = jest.fn();
    const onDeleteAccount = jest.fn().mockResolvedValue(undefined);
    const user: User = { uid: 'u1', name: 'Test User', email: 'test@example.com', picture: '', auth_time: 1234567890, firebase: { identities: {}, sign_in_provider: 'google.com' } };

    renderWithProviders(<UserMenu user={user} onLogout={onLogout} onDeleteAccount={onDeleteAccount} />);

    // Click the avatar button to open menu
    const avatarBtn = screen.getByRole('button');
    await userEvent.click(avatarBtn);

    // Click Delete Account button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Delete Account/i })).toBeInTheDocument();
    });
    const deleteBtn = screen.getByRole('button', { name: /Delete Account/i });
    await userEvent.click(deleteBtn);

    // Wait for dialog and confirm deletion
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete your account/i)).toBeVisible();
    });

    const confirmBtn = screen.getByRole('button', { name: /^Delete Account$/i });
    await userEvent.click(confirmBtn);

    await waitFor(() => {
      expect(onDeleteAccount).toHaveBeenCalled();
    });
  });

  it('navigates to /providers when Add Providers button is clicked', async () => {
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
    await userEvent.click(avatarBtn);

    // Click Add Providers button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Add Providers/i })).toBeInTheDocument();
    });
    const addProvidersBtn = screen.getByRole('button', { name: /Add Providers/i });
    await userEvent.click(addProvidersBtn);

    expect(mockPush).toHaveBeenCalledWith('/providers');
  });
});
