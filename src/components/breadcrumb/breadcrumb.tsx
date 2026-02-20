'use client';

import React from 'react';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/schema-markup';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const schema = generateBreadcrumbSchema(items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem',
            '& .MuiBreadcrumbs-separator': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            if (isLast) {
              return (
                <Typography
                  key={item.url}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 600,
                  }}
                >
                  {item.name}
                </Typography>
              );
            }

            return (
              <Link
                key={item.url}
                href={item.url}
                style={{
                  textDecoration: 'none',
                  color: 'rgba(138, 43, 226, 0.8)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    'rgba(138, 43, 226, 1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    'rgba(138, 43, 226, 0.8)';
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>
    </>
  );
}
