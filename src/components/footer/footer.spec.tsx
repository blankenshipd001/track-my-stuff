import { renderWithProviders, screen } from "@/utils/test-utils";
import { Footer } from "./footer"

describe('The Footer', () => {
    it('should render and contain the copyright', () => {
        renderWithProviders(<Footer />)

        const copyright = screen.getByText('2023 Copyright:');
        const tmdbAttribution = screen.getByText('This product uses the TMDB API but is not endorsed or certified by TMDB.');
        const justWatchAttribution = screen.getByText('This product uses the Just Watch API but is not endorsed or certified by Just Watch.');
        
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
})