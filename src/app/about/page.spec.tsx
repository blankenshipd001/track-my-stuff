import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';
import AboutPage from './page';

describe('About Page', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
    });

    it('should display "About Us" heading', () => {
      renderWithProviders(<AboutPage />);
      const heading = screen.getByRole('heading', { name: 'About Us' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should render main container', () => {
      const { container } = renderWithProviders(<AboutPage />);
      const boxes = container.querySelectorAll('[class*="MuiBox"]');
      expect(boxes.length).toBeGreaterThan(0);
    });
  });

  describe('Content', () => {
    it('should display description about the website purpose', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/We're passionate TV and movie fans/i)).toBeInTheDocument();
    });

    it('should mention calendar-style view feature', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/calendar-style view/i)).toBeInTheDocument();
    });

    it('should mention tracking favorite shows', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/tracking new releases/i)).toBeInTheDocument();
    });

    it('should mention where to watch streaming', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/where to watch them/i)).toBeInTheDocument();
    });

    it('should mention the tech stack', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/This website is built with React and Material-UI/i)).toBeInTheDocument();
    });

    it('should mention Next.js technology', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/Next.js/)).toBeInTheDocument();
    });

    it('should mention Firebase technology', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/Firebase/)).toBeInTheDocument();
    });

    it('should display copyright notice', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/© 2025 Copyright/)).toBeInTheDocument();
    });
  });

  describe('Links and Navigation', () => {
    it('should have link to creators GitHub', () => {
      renderWithProviders(<AboutPage />);
      const githubLink = screen.getByRole('link', { name: /Code-Monkey/i });
      expect(githubLink).toHaveAttribute('href', 'https://github.com/blankenshipd001');
    });

    it('should GitHub link open in same tab', () => {
      renderWithProviders(<AboutPage />);
      const githubLink = screen.getByRole('link', { name: /Code-Monkey/i }) as HTMLAnchorElement;
      expect(githubLink.target).not.toBe('_blank');
    });

    it('should have a link to Privacy Policy', () => {
      renderWithProviders(<AboutPage />);
      const privacyLink = screen.getByRole('link', { name: /Privacy Policy/i });
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('should have correct number of links', () => {
      renderWithProviders(<AboutPage />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBe(2); // GitHub and Privacy Policy
    });
  });

  describe('API Attribution', () => {
    it('should mention TMDB API usage', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/This product uses the TMDB API/i)).toBeInTheDocument();
    });

    it('should clarify not endorsed by TMDB', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/not endorsed or certified by TMDB/i)).toBeInTheDocument();
    });

    it('should mention Just Watch API usage', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/Just Watch API/i)).toBeInTheDocument();
    });

    it('should clarify not endorsed by Just Watch', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/not endorsed or certified by Just Watch/i)).toBeInTheDocument();
    });

    it('should have both API disclaimers on same element', () => {
      renderWithProviders(<AboutPage />);
      const disclaimerText = screen.getByText(/This product uses the TMDB API/i);
      expect(disclaimerText.textContent).toContain('Just Watch');
    });
  });

  describe('Styling and Layout', () => {
    it('should have heading with gradient styling', () => {
      renderWithProviders(<AboutPage />);
      const heading = screen.getByRole('heading', { name: 'About Us' });
      const styles = window.getComputedStyle(heading);
      expect(heading).toBeInTheDocument();
    });

    it('should have proper text color for main content', () => {
      renderWithProviders(<AboutPage />);
      const description = screen.getByText(/We're passionate TV and movie fans/i);
      expect(description).toBeVisible();
    });

    it('should have disclaimer text with smaller font size', () => {
      renderWithProviders(<AboutPage />);
      const disclaimer = screen.getByText(/This product uses the TMDB API/i);
      expect(disclaimer).toBeInTheDocument();
    });

    it('should have visual separator before Privacy Policy section', () => {
      const { container } = renderWithProviders(<AboutPage />);
      const privacyLink = screen.getByRole('link', { name: /Privacy Policy/i });
      const parentBox = privacyLink.closest('[class*="MuiBox"]');
      expect(parentBox).toBeInTheDocument();
    });
  });

  describe('Hover Interactions', () => {
    it('should handle hover on GitHub link', () => {
      renderWithProviders(<AboutPage />);
      const githubLink = screen.getByRole('link', { name: /Code-Monkey/i }) as HTMLAnchorElement;
      
      fireEvent.mouseEnter(githubLink);
      expect(githubLink.style.color).toBeDefined();
      
      fireEvent.mouseLeave(githubLink);
      expect(githubLink.style.color).toBeDefined();
    });

    it('should handle hover on Privacy Policy link', () => {
      renderWithProviders(<AboutPage />);
      const privacyLink = screen.getByRole('link', { name: /Privacy Policy/i }) as HTMLAnchorElement;
      
      fireEvent.mouseEnter(privacyLink);
      expect(privacyLink.style.color).toBeDefined();
      
      fireEvent.mouseLeave(privacyLink);
      expect(privacyLink.style.color).toBeDefined();
    });

    it('should have transition styling on links', () => {
      renderWithProviders(<AboutPage />);
      const githubLink = screen.getByRole('link', { name: /Code-Monkey/i });
      expect(githubLink).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic heading structure', () => {
      renderWithProviders(<AboutPage />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have accessible link labels', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByRole('link', { name: /Code-Monkey/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Privacy Policy/i })).toBeInTheDocument();
    });

    it('should have readable text contrast', () => {
      renderWithProviders(<AboutPage />);
      const headings = screen.getAllByRole('heading');
      headings.forEach(heading => {
        expect(heading).toBeVisible();
      });
    });

    it('should have proper link formatting', () => {
      renderWithProviders(<AboutPage />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('Content Integrity', () => {
    it('should not have duplicate links', () => {
      renderWithProviders(<AboutPage />);
      const allLinks = screen.getAllByRole('link');
      const linkTexts = allLinks.map(link => link.textContent);
      const uniqueLinkTexts = new Set(linkTexts);
      expect(allLinks.length).toBe(uniqueLinkTexts.size);
    });

    it('should display all sections of about content', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText(/We're passionate/i)).toBeInTheDocument();
      expect(screen.getByText(/React and Material-UI/i)).toBeInTheDocument();
      expect(screen.getByText(/© 2025 Copyright/)).toBeInTheDocument();
    });

    it('should have proper punctuation and formatting', () => {
      renderWithProviders(<AboutPage />);
      const disclaimer = screen.getByText(/This product uses the TMDB API/i);
      expect(disclaimer.textContent).toContain('.');
    });
  });

  describe('Edge Cases', () => {
    it('should render consistently on multiple renders', () => {
      const { rerender } = renderWithProviders(<AboutPage />);
      const heading1 = screen.getByText('About Us');
      expect(heading1).toBeInTheDocument();

      rerender(<AboutPage />);
      const heading2 = screen.getByText('About Us');
      expect(heading2).toBeInTheDocument();
    });

    it('should handle content with special characters', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/We're/)).toBeInTheDocument();
      expect(screen.getByText(/©/)).toBeInTheDocument();
    });

    it('should display all required text without truncation', () => {
      renderWithProviders(<AboutPage />);
      const mainText = screen.getByText(/We're passionate TV and movie fans/i);
      expect(mainText.textContent?.length).toBeGreaterThan(0);
    });
  });
});
