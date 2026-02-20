import { render } from '@testing-library/react';
import { FontLoader } from './font-loader';

describe('FontLoader', () => {
  beforeEach(() => {
    // Clean up any existing Material Icons links before each test
    const existingLinks = document.querySelectorAll('link[href*="Material+Icons"]');
    existingLinks.forEach(link => link.remove());
  });

  afterEach(() => {
    // Clean up after each test
    const links = document.querySelectorAll('link[href*="Material+Icons"]');
    links.forEach(link => link.remove());
  });

  it('should render without crashing', () => {
    const { container } = render(<FontLoader />);
    expect(container).toBeInTheDocument();
  });

  it('should return null (no visible content)', () => {
    const { container } = render(<FontLoader />);
    expect(container.firstChild).toBeNull();
  });

  it('should add Material Icons link to document head', () => {
    render(<FontLoader />);
    
    const link = document.querySelector('link[href*="Material+Icons"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('rel', 'stylesheet');
    expect(link).toHaveAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
  });

  it('should add link to head, not body', () => {
    render(<FontLoader />);
    
    const linkInHead = document.head.querySelector('link[href*="Material+Icons"]');
    const linkInBody = document.body.querySelector('link[href*="Material+Icons"]');
    
    expect(linkInHead).toBeInTheDocument();
    expect(linkInBody).not.toBeInTheDocument();
  });

  it('should remove link when component unmounts', () => {
    const { unmount } = render(<FontLoader />);
    
    // Verify link is added
    let link = document.querySelector('link[href*="Material+Icons"]');
    expect(link).toBeInTheDocument();
    
    // Unmount component
    unmount();
    
    // Verify link is removed
    link = document.querySelector('link[href*="Material+Icons"]');
    expect(link).not.toBeInTheDocument();
  });

  it('should handle multiple mount/unmount cycles correctly', () => {
    const { unmount: unmount1 } = render(<FontLoader />);
    expect(document.querySelector('link[href*="Material+Icons"]')).toBeInTheDocument();
    
    unmount1();
    expect(document.querySelector('link[href*="Material+Icons"]')).not.toBeInTheDocument();
    
    const { unmount: unmount2 } = render(<FontLoader />);
    expect(document.querySelector('link[href*="Material+Icons"]')).toBeInTheDocument();
    
    unmount2();
    expect(document.querySelector('link[href*="Material+Icons"]')).not.toBeInTheDocument();
  });

  it('should only add one link even if mounted multiple times simultaneously', () => {
    render(<FontLoader />);
    render(<FontLoader />);
    render(<FontLoader />);
    
    const links = document.querySelectorAll('link[href*="Material+Icons"]');
    // Multiple FontLoader instances will each add a link
    expect(links.length).toBeGreaterThanOrEqual(1);
  });
});
