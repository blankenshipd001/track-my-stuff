import { renderWithProviders, screen } from '@/utils/test-utils';
import { Breadcrumb } from './breadcrumb';
import { fireEvent } from '@testing-library/react';
import { generateBreadcrumbSchema } from '@/lib/schema-markup';

jest.mock('@/lib/schema-markup', () => ({
  generateBreadcrumbSchema: jest.fn(),
}));

describe('Breadcrumb', () => {
  const mockItems = [
    { name: 'Home', url: '/' },
    { name: 'Movies', url: '/movies' },
    { name: 'Action', url: '/movies/action' },
  ];

  beforeEach(() => {
    (generateBreadcrumbSchema as jest.Mock).mockReturnValue({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithProviders(<Breadcrumb items={mockItems} />);
    expect(screen.getByLabelText('breadcrumb')).toBeInTheDocument();
  });

  it('should render all breadcrumb items', () => {
    renderWithProviders(<Breadcrumb items={mockItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('should render links for all items except the last one', () => {
    renderWithProviders(<Breadcrumb items={mockItems} />);
    
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const moviesLink = screen.getByRole('link', { name: 'Movies' });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(moviesLink).toHaveAttribute('href', '/movies');
  });

  it('should not render a link for the last item', () => {
    renderWithProviders(<Breadcrumb items={mockItems} />);
    
    // The last item should be in a Typography component, not a link
    const actionText = screen.getByText('Action');
    expect(actionText.tagName).toBe('P'); // MUI Typography renders as <p>
    expect(actionText.closest('a')).toBeNull();
  });

  it('should generate and include breadcrumb schema', () => {
    renderWithProviders(<Breadcrumb items={mockItems} />);
    
    expect(generateBreadcrumbSchema).toHaveBeenCalledWith(mockItems);
    
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThan(0);
  });

  it('should handle single item (no links)', () => {
    const singleItem = [{ name: 'Home', url: '/' }];
    renderWithProviders(<Breadcrumb items={singleItem} />);
    
    const homeText = screen.getByText('Home');
    expect(homeText.tagName).toBe('P');
    expect(homeText.closest('a')).toBeNull();
  });

  it('should handle empty items array', () => {
    renderWithProviders(<Breadcrumb items={[]} />);
    
    expect(screen.getByLabelText('breadcrumb')).toBeInTheDocument();
    // No items should be rendered
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should change link color on mouse enter and leave', () => {
    renderWithProviders(<Breadcrumb items={mockItems} />);
    
    const homeLink = screen.getByRole('link', { name: 'Home' });
    
    // Initial color
    expect(homeLink).toHaveStyle({ color: 'rgba(138, 43, 226, 0.8)' });
    
    // Mouse enter
    fireEvent.mouseEnter(homeLink);
    expect(homeLink).toHaveStyle({ color: 'rgba(138, 43, 226, 1)' });
    
    // Mouse leave
    fireEvent.mouseLeave(homeLink);
    expect(homeLink).toHaveStyle({ color: 'rgba(138, 43, 226, 0.8)' });
  });

  it('should render correct number of separators', () => {
    const { container } = renderWithProviders(<Breadcrumb items={mockItems} />);
    
    // MUI adds separators between items
    const separators = container.querySelectorAll('.MuiBreadcrumbs-separator');
    // Should have n-1 separators for n items
    expect(separators.length).toBe(mockItems.length - 1);
  });
});
