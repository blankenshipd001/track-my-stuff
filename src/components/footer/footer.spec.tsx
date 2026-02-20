import { renderWithProviders, screen } from "@/utils/test-utils";
import { Footer } from "./footer"
import { COLORS } from "@/lib/theme-constants";
import userEvent from "@testing-library/user-event";

describe('The Footer', () => {
    it('should render and contain the copyright', () => {
        renderWithProviders(<Footer />)

    // Use regex-based queries to be robust to the © symbol and spacing
    const copyright = screen.getByText(/\d{4}\s+Copyright:/i);
    const tmdbAttribution = screen.getByText(/This product uses the TMDB API but is not endorsed or certified by TMDB\./i);
    const justWatchAttribution = screen.getByText(/This product uses the Just Watch API but is not endorsed or certified by Just Watch\./i);

    expect(copyright).toBeVisible();
    expect(tmdbAttribution).toBeVisible();
    expect(justWatchAttribution).toBeVisible();
    });

    it('should have link to github repo', () => {
        renderWithProviders(<Footer />);

        expect(screen.getByRole('link', { 
            name: 'Code-Monkey' 
        })).toHaveAttribute('href', 'https://github.com/blankenshipd001');
    });

    it('should render footer as semantic footer element', () => {
        renderWithProviders(<Footer />);
        const footer = screen.getByRole('contentinfo');
        expect(footer).toBeInTheDocument();
    });

    it('should have correct initial link styles', () => {
        renderWithProviders(<Footer />);
        const link = screen.getByRole('link', { name: 'Code-Monkey' });
        
        expect(link).toHaveStyle({
            color: COLORS.purple.solid,
            textDecoration: 'none',
            marginLeft: '0.25rem',
            transition: 'color 0.2s'
        });
    });

    it('should change link color on mouse enter', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Footer />);
        const link = screen.getByRole('link', { name: 'Code-Monkey' });
        
        // Hover over the link
        await user.hover(link);
        
        // Color should change to pink (contains '244' from rgb(244, 114, 182))
        expect(link.style.color).toContain('244');
    });

    it('should revert link color on mouse leave', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Footer />);
        const link = screen.getByRole('link', { name: 'Code-Monkey' });
        
        const initialColor = link.style.color;
        
        // Hover over the link
        await user.hover(link);
        const hoverColor = link.style.color;
        
        // Colors should be different
        expect(hoverColor).not.toBe(initialColor);
        
        // Move away from the link
        await user.unhover(link);
        const finalColor = link.style.color;
        
        // Color should revert to initial
        expect(finalColor).toBe(initialColor);
    });

    it('should contain TMDB disclaimer', () => {
        renderWithProviders(<Footer />);
        const tmdbDisclaimer = screen.getByText(/This product uses the TMDB API but is not endorsed or certified by TMDB\./i);
        expect(tmdbDisclaimer).toBeInTheDocument();
    });

    it('should contain Just Watch disclaimer', () => {
        renderWithProviders(<Footer />);
        const justWatchDisclaimer = screen.getByText(/This product uses the Just Watch API but is not endorsed or certified by Just Watch\./i);
        expect(justWatchDisclaimer).toBeInTheDocument();
    });

    it('should have correct link text', () => {
        renderWithProviders(<Footer />);
        const link = screen.getByRole('link', { name: 'Code-Monkey' });
        expect(link).toHaveTextContent('Code-Monkey');
    });

    it('should have line break between disclaimers', () => {
        renderWithProviders(<Footer />);
        const footer = screen.getByRole('contentinfo');
        const breakElements = footer.querySelectorAll('br');
        expect(breakElements.length).toBeGreaterThan(0);
    });
})