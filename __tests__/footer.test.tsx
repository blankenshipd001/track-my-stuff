import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe } from "node:test";
import Footer from "../lib/shared/footer";

describe("Footer", () => {
    it("should render the footer", () => {
        render(<Footer />);
        
        const copyRight = screen.getByText("© 2023 Copyright:");
        const name = screen.getByText("Code-Monkey");
        const callOuts = screen.getByText("This product uses the TMDB API but is not endorsed or certified by TMDB.")

        expect(copyRight).toBeInTheDocument();
        expect(name).toBeInTheDocument();
        expect(callOuts).toBeInTheDocument();
    });
});