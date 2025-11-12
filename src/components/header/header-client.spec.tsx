import React from 'react';
import { renderWithProviders, screen, fireEvent, within } from '@/utils/test-utils';

// Mock next/image to a simple img for tests
jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

const pushMock = jest.fn();
const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

jest.mock('@/lib/clientLogout', () => ({ logoutUser: jest.fn() }));

// Stub UserMenu to expose the onLogout prop so tests can trigger it
jest.mock('./user-menu', () => (props: any) => (
  <div data-testid="user-menu">
    <button onClick={() => props.onLogout?.()}>Logout</button>
  </div>
));

import HeaderClient from './header-client';

describe('HeaderClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nav items and login button when user is null', () => {
    renderWithProviders(<HeaderClient user={null} navItems={[{ label: 'Home', path: '/home' }]} />);

    expect(screen.getByText('Home')).toBeVisible();
    expect(screen.getByText('LOG IN')).toBeVisible();
  });

  it('navigates when buttons are clicked', () => {
    renderWithProviders(<HeaderClient user={null} navItems={[{ label: 'Home', path: '/home' }]} />);

    fireEvent.click(screen.getByText('Home'));
    expect(pushMock).toHaveBeenCalledWith('/home');

    fireEvent.click(screen.getByText('LOG IN'));
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('shows user menu when user is present and handles logout', async () => {
    const { logoutUser } = require('@/lib/clientLogout');

    renderWithProviders(<HeaderClient user={{ uid: 'u1', email: 'a@b.com' }} navItems={[{ label: 'Home', path: '/home' }]} />);

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
    const { logoutUser } = require('@/lib/clientLogout');

    renderWithProviders(<HeaderClient user={{ uid: 'u1' }} navItems={[{ label: 'Movies', path: '/movies' }]} />);

    // open the drawer by clicking the menu icon inside the header
    const menuIcon = screen.getByTestId('MenuIcon');
    const menuButton = menuIcon.closest('button');
    if (menuButton) fireEvent.click(menuButton);

    // find the drawer's dialog and scope queries to it
    const drawerDialog = screen.getByRole('dialog');
    const buttonsInDrawer = within(drawerDialog).getAllByRole('button');
    const navBtn = buttonsInDrawer.find((b) => b.textContent?.includes('Movies'));
    if (navBtn) fireEvent.click(navBtn);
    expect(pushMock).toHaveBeenCalledWith('/movies');

    // open drawer again to test logout list item
    if (menuButton) fireEvent.click(menuButton);
    const drawerDialog2 = screen.getByRole('dialog');
    const buttonsInDrawer2 = within(drawerDialog2).getAllByRole('button');
    const logoutBtn = buttonsInDrawer2.find((b) => /Log Out/i.test(b.textContent || ''));
    if (logoutBtn) fireEvent.click(logoutBtn);

    expect(logoutUser).toHaveBeenCalled();
  });
});
