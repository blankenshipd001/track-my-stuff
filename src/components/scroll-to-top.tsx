'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Component that scrolls to the top of the page when the route changes.
 * This provides a better user experience by ensuring users start at the top
 * of each new page rather than maintaining their previous scroll position.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
