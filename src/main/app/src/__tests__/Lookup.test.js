import React from 'react';
import { render } from '@testing-library/react';
import Lookup from '../components/Lookup';

test('renders the lookup page', () => {
    const component = render(<Lookup />);

    const linkElement = component.getByPlaceholderText(/Search For Movie/i);

    expect(linkElement).toBeInTheDocument();
});
