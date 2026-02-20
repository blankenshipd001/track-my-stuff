import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor, within } from '@/utils/test-utils';

// Mock next/image
jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

const pushMock = jest.fn();
const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
  useServerInsertedHTML: jest.fn((callback) => callback()),
}));

jest.mock('@/lib/clientLogout', () => ({ logoutUser: jest.fn() }));

// Mock Firebase auth
const mockSignInWithPopup = jest.fn();
const mockGetIdToken = jest.fn();
jest.mock('firebase/auth', () => ({
  signInWithPopup: (...args: any[]) => mockSignInWithPopup(...args),
}));

jest.mock('@/lib/firebase/config', () => ({
  auth: {
    currentUser: null,
  },
  googleProvider: {},
}));

// Stub UserMenu
jest.mock('./user-menu', () => (props: any) => (
  <div data-testid="user-menu">
    <button onClick={() => props.onLogout?.()}>Logout</button>
    <button onClick={() => props.onDeleteAccount?.()}>Delete Account</button>
  </div>
));

import HeaderClient from './header-client';

describe('HeaderClient - Delete Account Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    mockGetIdToken.mockResolvedValue('fake-token');
  });

  describe('Delete Account Flow', () => {
    it('successfully deletes account when user is authenticated', async () => {
      // Mock authenticated user
      const mockUser = {
        uid: 'test-uid',
        name: 'Test User',
        email: 'test@example.com',
        auth_time: 1234567890,
        firebase: { identities: {}, sign_in_provider: 'google.com' }
      };

      // Mock auth.currentUser
      const { auth } = require('@/lib/firebase/config');
      auth.currentUser = {
        getIdToken: mockGetIdToken,
      };

      // Mock successful delete response
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      renderWithProviders(
        <HeaderClient 
          user={mockUser} 
          navItems={[{ label: 'Home', path: '/home' }]} 
        />
      );

      const userMenu = screen.getByTestId('user-menu');
      const deleteButton = within(userMenu).getByText('Delete Account');
      
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockGetIdToken).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith('/api/delete-account', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake-token',
          },
        });
      });

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith('/');
        expect(refreshMock).toHaveBeenCalled();
      });
    });

    it('logs error when delete account fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const mockUser = {
        uid: 'test-uid',
        name: 'Test User',
        email: 'test@example.com',
        auth_time: 1234567890,
        firebase: { identities: {}, sign_in_provider: 'google.com' }
      };

      const { auth } = require('@/lib/firebase/config');
      auth.currentUser = {
        getIdToken: mockGetIdToken,
      };

      // Mock failed delete response
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

      renderWithProviders(
        <HeaderClient 
          user={mockUser} 
          navItems={[{ label: 'Home', path: '/home' }]} 
        />
      );

      const userMenu = screen.getByTestId('user-menu');
      const deleteButton = within(userMenu).getByText('Delete Account');
      
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to delete account');
      });

      // Should not navigate on failure
      expect(pushMock).not.toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });

    it('handles delete account when no user is authenticated', async () => {
      const mockUser = {
        uid: 'test-uid',
        name: 'Test User',
        email: 'test@example.com',
        auth_time: 1234567890,
        firebase: { identities: {}, sign_in_provider: 'google.com' }
      };

      const { auth } = require('@/lib/firebase/config');
      auth.currentUser = null; // No authenticated user

      renderWithProviders(
        <HeaderClient 
          user={mockUser} 
          navItems={[{ label: 'Home', path: '/home' }]} 
        />
      );

      const userMenu = screen.getByTestId('user-menu');
      const deleteButton = within(userMenu).getByText('Delete Account');
      
      fireEvent.click(deleteButton);

      await waitFor(() => {
        // Should return early without calling fetch
        expect(global.fetch).not.toHaveBeenCalled();
      });
    });

    it('handles delete account error during token retrieval', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const mockUser = {
        uid: 'test-uid',
        name: 'Test User',
        email: 'test@example.com',
        auth_time: 1234567890,
        firebase: { identities: {}, sign_in_provider: 'google.com' }
      };

      const { auth } = require('@/lib/firebase/config');
      const tokenError = new Error('Token error');
      auth.currentUser = {
        getIdToken: jest.fn().mockRejectedValue(tokenError),
      };

      renderWithProviders(
        <HeaderClient 
          user={mockUser} 
          navItems={[{ label: 'Home', path: '/home' }]} 
        />
      );

      const userMenu = screen.getByTestId('user-menu');
      const deleteButton = within(userMenu).getByText('Delete Account');
      
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Delete account error:', tokenError);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Login Error Handling', () => {
    it('logs error when login fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const loginError = new Error('Login failed');
      
      mockSignInWithPopup.mockRejectedValue(loginError);

      renderWithProviders(
        <HeaderClient 
          user={null} 
          navItems={[{ label: 'Home', path: '/home' }]} 
        />
      );

      const signInButton = screen.getByText('Sign in');
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Login error:', loginError);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Mobile Drawer - Delete Account', () => {
    it('can delete account from mobile drawer', async () => {
      const mockUser = {
        uid: 'test-uid',
        name: 'Test User',
        email: 'test@example.com',
        auth_time: 1234567890,
        firebase: { identities: {}, sign_in_provider: 'google.com' }
      };

      const { auth } = require('@/lib/firebase/config');
      auth.currentUser = {
        getIdToken: mockGetIdToken,
      };

      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      renderWithProviders(
        <HeaderClient 
          user={mockUser} 
          navItems={[{ label: 'Movies', path: '/movies' }]} 
        />
      );

      // Open mobile drawer
      const menuIcon = screen.getByTestId('MenuIcon');
      const menuButton = menuIcon.closest('button');
      if (menuButton) fireEvent.click(menuButton);

      const drawerDialog = screen.getByRole('dialog');
      const buttonsInDrawer = within(drawerDialog).getAllByRole('button');
      const deleteBtn = buttonsInDrawer.find((b: any) => /Delete Account/i.test(b.textContent || ''));
      
      if (deleteBtn) {
        fireEvent.click(deleteBtn);

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith('/api/delete-account', expect.any(Object));
        });
      }
    });
  });

  describe('Logo Navigation', () => {
    it('navigates to home when logo is clicked', () => {
      renderWithProviders(
        <HeaderClient 
          user={null} 
          navItems={[{ label: 'Home', path: '/home' }]} 
        />
      );

      const logo = screen.getByAltText('Logo');
      const logoContainer = logo.closest('div');
      
      if (logoContainer) {
        fireEvent.click(logoContainer);
        expect(pushMock).toHaveBeenCalledWith('/');
      }
    });
  });
});
