import { render, screen, fireEvent } from '@testing-library/react';
import { SkipLink } from './skip-link';

describe('SkipLink', () => {
  it('should render without crashing', () => {
    render(<SkipLink />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('should have correct href attribute', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should start with top position at -40 (hidden)', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveStyle({ top: '-40px' });
  });

  it('should change top position to 0 when focused', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    
    fireEvent.focus(link);
    expect(link).toHaveStyle({ top: '0px' });
  });

  it('should return top position to -40 when blurred', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    
    // Focus then blur
    fireEvent.focus(link);
    expect(link).toHaveStyle({ top: '0px' });
    
    fireEvent.blur(link);
    expect(link).toHaveStyle({ top: '-40px' });
  });

  it('should have sr-only class for accessibility', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveClass('sr-only');
  });

  it('should have focus-visible:not-sr-only class', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveClass('focus-visible:not-sr-only');
  });

  it('should have correct styling', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    
    expect(link).toHaveStyle({
      position: 'absolute',
      left: 0,
      zIndex: 100,
      padding: '8px',
      backgroundColor: '#a78bfa',
      color: '#000',
      textDecoration: 'none',
      borderRadius: '0 0 4px 0',
      transition: 'top 200ms ease-in-out',
    });
  });

  it('should toggle visibility multiple times correctly', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    
    // First focus
    fireEvent.focus(link);
    expect(link).toHaveStyle({ top: '0px' });
    
    // First blur
    fireEvent.blur(link);
    expect(link).toHaveStyle({ top: '-40px' });
    
    // Second focus
    fireEvent.focus(link);
    expect(link).toHaveStyle({ top: '0px' });
    
    // Second blur
    fireEvent.blur(link);
    expect(link).toHaveStyle({ top: '-40px' });
  });
});
