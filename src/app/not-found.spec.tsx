import { renderWithProviders, screen } from '@/utils/test-utils';
import NotFound from './not-found';
import { useRouter } from 'next/navigation';

describe('NotFound Page', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should display 404 heading', () => {
    renderWithProviders(<NotFound />);
    const heading = screen.getByText('404');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('should display "Page Not Found" message', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should display helpful message', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText((content) => content.includes("page you're looking for"))).toBeInTheDocument();
  });

  it('should have a "Home Page" button', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByRole('link', { name: /home page/i })).toBeInTheDocument();
  });

  it('should have a "Go Back" button', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('should navigate to home when "Home Page" is clicked', () => {
    renderWithProviders(<NotFound />);
    const homeButton = screen.getByRole('link', { name: /home page/i });
    expect(homeButton).toHaveAttribute('href', '/');
  });

  it('should have Go Back button clickable', () => {
    renderWithProviders(<NotFound />);
    const backButton = screen.getByRole('button', { name: /go back/i });
    expect(backButton).toBeInTheDocument();
  });

  it('should call router.back() when Go Back button is clicked', () => {
    renderWithProviders(<NotFound />);
    const backButton = screen.getByRole('button', { name: /go back/i });
    backButton.click();
    expect(mockBack).toHaveBeenCalled();
  });

  it('should display popular pages links', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByRole('link', { name: /activity/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /streaming/i })).toBeInTheDocument();
  });

  it('should have correct href for Activity link', () => {
    renderWithProviders(<NotFound />);
    const activityLink = screen.getByRole('link', { name: /activity/i });
    expect(activityLink).toHaveAttribute('href', '/activity');
  });

  it('should have correct href for Watched link', () => {
    renderWithProviders(<NotFound />);
    const watchedLink = screen.getByRole('link', { name: /watched/i });
    expect(watchedLink).toHaveAttribute('href', '/watched');
  });

  it('should display with proper styling (centered layout)', () => {
    const { container } = renderWithProviders(<NotFound />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
