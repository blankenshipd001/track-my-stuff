import { render } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { ScrollToTop } from './scroll-to-top';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('ScrollToTop', () => {
  let scrollToSpy: jest.SpyInstance;

  beforeEach(() => {
    scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  afterEach(() => {
    scrollToSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<ScrollToTop />);
    expect(container).toBeInTheDocument();
  });

  it('should return null (no visible content)', () => {
    const { container } = render(<ScrollToTop />);
    expect(container.firstChild).toBeNull();
  });

  it('should scroll to top on initial mount', () => {
    render(<ScrollToTop />);
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });

  it('should scroll to top when pathname changes', () => {
    const { rerender } = render(<ScrollToTop />);
    expect(scrollToSpy).toHaveBeenCalledTimes(1);

    // Change pathname
    (usePathname as jest.Mock).mockReturnValue('/movies');
    rerender(<ScrollToTop />);
    
    expect(scrollToSpy).toHaveBeenCalledTimes(2);
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 0);
  });

  it('should scroll to top multiple times for multiple pathname changes', () => {
    const { rerender } = render(<ScrollToTop />);
    expect(scrollToSpy).toHaveBeenCalledTimes(1);

    // First change
    (usePathname as jest.Mock).mockReturnValue('/tv');
    rerender(<ScrollToTop />);
    expect(scrollToSpy).toHaveBeenCalledTimes(2);

    // Second change
    (usePathname as jest.Mock).mockReturnValue('/about');
    rerender(<ScrollToTop />);
    expect(scrollToSpy).toHaveBeenCalledTimes(3);

    // All calls should be with the same arguments
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });
});
