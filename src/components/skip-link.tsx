'use client';

import { useState } from 'react';

export function SkipLink() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <a
      href="#main-content"
      className="sr-only focus-visible:not-sr-only"
      style={{
        position: 'absolute',
        top: isVisible ? 0 : -40,
        left: 0,
        zIndex: 100,
        padding: '8px',
        backgroundColor: '#a78bfa',
        color: '#000',
        textDecoration: 'none',
        borderRadius: '0 0 4px 0',
        transition: 'top 200ms ease-in-out',
      }}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      Skip to main content
    </a>
  );
}
