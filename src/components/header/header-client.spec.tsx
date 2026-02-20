import React from 'react';
import { renderWithProviders, screen, fireEvent, within } from '@/utils/test-utils';

// Mock next/image to a simple img for tests
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
jest.mock('firebase/auth', () => ({
  signInWithPopup: (...args: any[]) => mockSignInWithPopup(...args),
}));

jest.mock('@/lib/firebase/config', () => ({
  auth: {},
  googleProvider: {},
}));

// Stub UserMenu to expose the onLogout and onDeleteAccount props so tests can trigger them
jest.mock('./user-menu', () => (props: any) => (
  <div data-testid="user-menu">
    <button onClick={() => props.onLogout?.()}>Logout</button>
    <button onClick={() => props.onDeleteAccount?.()}>Delete Account</button>
  </div>
));

import HeaderClient from './header-client';

describe('HeaderClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('renders nav items and login button when user is null', () => {
    renderWithProviders(<HeaderClient user={null} navItems={[{ label: 'Home', path: '/home' }]} />);

    expect(screen.getByText('Home')).toBeVisible();
    expect(screen.getByText('Sign in')).toBeVisible();
  });

  it('navigates when buttons are clicked', () => {
    renderWithProviders(<HeaderClient user={null} navItems={[{ label: 'Home', path: '/home' }]} />);

    fireEvent.click(screen.getByText('Home'));
    expect(pushMock).toHaveBeenCalledWith('/home');
  });

  it('triggers Google sign-in when login button clicked', async () => {
    const mockUser = { getIdToken: jest.fn().mockResolvedValue('fake-token') };
    mockSignInWithPopup.mockResolvedValue({ user: mockUser });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    renderWithProviders(<HeaderClient user={null} navItems={[{ label: 'Home', path: '/home' }]} />);

    fireEvent.click(screen.getByText('Sign in'));

    await (async () => {
      await new Promise((r) => setTimeout(r, 0));
    })();

    expect(mockSignInWithPopup).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('/api/session', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'fake-token' }),
    }));
    expect(pushMock).toHaveBeenCalledWith('/activity');
    expect(refreshMock).toHaveBeenCalled();
  });

  it('shows user menu when user is present and handles logout', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { logoutUser } = require('@/lib/clientLogout');

    renderWithProviders(<HeaderClient user={{ uid: 'u1', name: 'Test User', email: 'a@b.com', auth_time: 1234567890, firebase: { identities: {}, sign_in_provider: 'google.com' } }} navItems={[{ label: 'Home', path: '/home' }]} />);

    const menu = screen.getByTestId('user-menu');
    expect(menu).toBeVisible();

    // click the logout button inside our stub
    fireEvent.click(screen.getByText('Logout'));

    // logoutUser should be called and router should navigate to home and refresh
    expect(logoutUser).toHaveBeenCalled();
    await (async () => {
      // handleLogout is async; wait for its router calls
      await new Promise((r) => setTimeout(r, 0));
    })();
    expect(pushMock).toHaveBeenCalledWith('/');
    expect(refreshMock).toHaveBeenCalled();
  });

  it('opens mobile drawer and navigates when drawer item clicked; logout in drawer triggers logoutUser', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { logoutUser } = require('@/lib/clientLogout');

    renderWithProviders(<HeaderClient user={{ uid: 'u1', name: 'Test User', email: 'test@example.com', auth_time: 1234567890, firebase: { identities: {}, sign_in_provider: 'google.com' } }} navItems={[{ label: 'Movies', path: '/movies' }]} />);

    // open the drawer by clicking the menu icon inside the header
    const menuIcon = screen.getByTestId('MenuIcon');
    const menuButton = menuIcon.closest('button');
    if (menuButton) fireEvent.click(menuButton);

    // find the drawer's dialog and scope queries to it
    const drawerDialog = screen.getByRole('dialog');
    const buttonsInDrawer = within(drawerDialog).getAllByRole('button');
    const navBtn = buttonsInDrawer.find((b: any) => b.textContent?.includes('Movies'));
    if (navBtn) fireEvent.click(navBtn);
    expect(pushMock).toHaveBeenCalledWith('/movies');

    // open drawer again to test logout list item
    if (menuButton) fireEvent.click(menuButton);
    const drawerDialog2 = screen.getByRole('dialog');
    const buttonsInDrawer2 = within(drawerDialog2).getAllByRole('button');
    const logoutBtn = buttonsInDrawer2.find((b: any) => /Log Out/i.test(b.textContent || ''));
    if (logoutBtn) fireEvent.click(logoutBtn);

    expect(logoutUser).toHaveBeenCalled();
  });

  it('triggers Google sign-in from mobile drawer when not logged in', async () => {
    const mockUser = { getIdToken: jest.fn().mockResolvedValue('fake-token') };
    mockSignInWithPopup.mockResolvedValue({ user: mockUser });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    renderWithProviders(<HeaderClient user={null} navItems={[{ label: 'Movies', path: '/movies' }]} />);

    // open the drawer
    const menuIcon = screen.getByTestId('MenuIcon');
    const menuButton = menuIcon.closest('button');
    if (menuButton) fireEvent.click(menuButton);

    const drawerDialog = screen.getByRole('dialog');
    const buttonsInDrawer = within(drawerDialog).getAllByRole('button');
    const loginBtn = buttonsInDrawer.find((b: any) => b.textContent?.includes('Sign in'));
    if (loginBtn) fireEvent.click(loginBtn);

    await (async () => {
      await new Promise((r) => setTimeout(r, 0));
    })();

    expect(mockSignInWithPopup).toHaveBeenCalled();
  });
});
