import { renderWithProviders, screen, waitFor } from '@/utils/test-utils';
import { PWAInstallPrompt } from './pwa-install-prompt';
import { fireEvent, act } from '@testing-library/react';

// Mock BeforeInstallPromptEvent
class MockBeforeInstallPromptEvent extends Event {
  prompt = jest.fn().mockResolvedValue(undefined);
  userChoice = Promise.resolve({ outcome: 'accepted' as const });

  constructor() {
    super('beforeinstallprompt');
  }
}

describe('PWAInstallPrompt', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    Storage.prototype.getItem = jest.fn((key) => localStorageMock[key] || null);
    Storage.prototype.setItem = jest.fn((key, value) => {
      localStorageMock[key] = value;
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should render nothing initially', () => {
    const { container } = renderWithProviders(<PWAInstallPrompt />);
    expect(container.firstChild).toBeNull();
  });

  it('should not show prompt if already dismissed', () => {
    localStorageMock['pwa-prompt-dismissed'] = 'true';
    
    renderWithProviders(<PWAInstallPrompt />);
    
    const event = new MockBeforeInstallPromptEvent();
    fireEvent(window, event);
    
    jest.advanceTimersByTime(3000);
    
    expect(screen.queryByText('Install ReelTime')).not.toBeInTheDocument();
  });

  it('should not show prompt if already installed', () => {
    localStorageMock['pwa-installed'] = 'true';
    
    renderWithProviders(<PWAInstallPrompt />);
    
    const event = new MockBeforeInstallPromptEvent();
    fireEvent(window, event);
    
    jest.advanceTimersByTime(3000);
    
    expect(screen.queryByText('Install ReelTime')).not.toBeInTheDocument();
  });

  it('should show prompt after delay when beforeinstallprompt event fires', async () => {
    renderWithProviders(<PWAInstallPrompt />);
    
    const event = new MockBeforeInstallPromptEvent();
    
    act(() => {
      fireEvent(window, event);
    });
    
    // Should not show immediately
    expect(screen.queryByText('Install ReelTime')).not.toBeInTheDocument();
    
    // Advance timers past the delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Install ReelTime')).toBeInTheDocument();
    });
  });

  it('should display correct prompt content', async () => {
    renderWithProviders(<PWAInstallPrompt />);
    
    act(() => {
      fireEvent(window, new MockBeforeInstallPromptEvent());
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Install ReelTime')).toBeInTheDocument();
      expect(screen.getByText('Add to your home screen for quick access')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Install' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Dismiss install prompt' })).toBeInTheDocument();
    });
  });

  it('should call prompt and hide when Install button is clicked', async () => {
    renderWithProviders(<PWAInstallPrompt />);
    
    const mockEvent = new MockBeforeInstallPromptEvent();
    
    act(() => {
      fireEvent(window, mockEvent);
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Install ReelTime')).toBeInTheDocument();
    });
    
    const installButton = screen.getByRole('button', { name: 'Install' });
    
    await act(async () => {
      fireEvent.click(installButton);
    });
    
    expect(mockEvent.prompt).toHaveBeenCalled();
    expect(localStorageMock['pwa-installed']).toBe('true');
    
    await waitFor(() => {
      expect(screen.queryByText('Install ReelTime')).not.toBeInTheDocument();
    });
  });

  it('should set dismissed flag and hide when close button is clicked', async () => {
    renderWithProviders(<PWAInstallPrompt />);
    
    act(() => {
      fireEvent(window, new MockBeforeInstallPromptEvent());
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Install ReelTime')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByRole('button', { name: 'Dismiss install prompt' });
    fireEvent.click(closeButton);
    
    expect(localStorageMock['pwa-prompt-dismissed']).toBe('true');
    
    await waitFor(() => {
      expect(screen.queryByText('Install ReelTime')).not.toBeInTheDocument();
    });
  });

  it('should handle user dismissing the prompt', async () => {
    const mockEvent = new MockBeforeInstallPromptEvent();
    mockEvent.userChoice = Promise.resolve({ outcome: 'dismissed' });
    
    renderWithProviders(<PWAInstallPrompt />);
    
    act(() => {
      fireEvent(window, mockEvent);
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Install ReelTime')).toBeInTheDocument();
    });
    
    const installButton = screen.getByRole('button', { name: 'Install' });
    
    await act(async () => {
      fireEvent.click(installButton);
    });
    
    expect(mockEvent.prompt).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(screen.queryByText('Install ReelTime')).not.toBeInTheDocument();
    });
  });

  it('should hide prompt when appinstalled event fires', async () => {
    renderWithProviders(<PWAInstallPrompt />);
    
    act(() => {
      fireEvent(window, new MockBeforeInstallPromptEvent());
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Install ReelTime')).toBeInTheDocument();
    });
    
    act(() => {
      fireEvent(window, new Event('appinstalled'));
    });
    
    expect(localStorageMock['pwa-installed']).toBe('true');
    
    await waitFor(() => {
      expect(screen.queryByText('Install ReelTime')).not.toBeInTheDocument();
    });
  });

  it('should not show prompt if running as standalone app', () => {
    // Mock standalone mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    renderWithProviders(<PWAInstallPrompt />);
    
    expect(localStorageMock['pwa-installed']).toBe('true');
    
    act(() => {
      fireEvent(window, new MockBeforeInstallPromptEvent());
      jest.advanceTimersByTime(2000);
    });
    
    expect(screen.queryByText('Install ReelTime')).not.toBeInTheDocument();
  });
});
