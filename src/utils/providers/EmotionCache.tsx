"use client";
import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";

/**
 * EmotionCache for MUI styling with SSR optimization
 * 
 * This component:
 * 1. Creates an Emotion cache with prepend=true to ensure MUI styles override user styles
 * 2. Uses useServerInsertedHTML to inject critical styles during SSR
 * 3. Separates global styles from component styles for better CSSOM performance
 * 4. Prevents style injection delays during hydration
 */
export default function EmotionCache({ children }: { children: React.ReactNode }) {
  const [registry] = React.useState(() => {
    const cache = createCache({ 
      key: "css", 
      prepend: true,
      // stylisPlugin: [] // Can add plugins here for critical CSS extraction if needed
    });
    cache.compat = true;
    return { 
      cache, 
      flush: () => {
        const names = cache.inserted;
        return Object.keys(names);
      } 
    };
  });

  useServerInsertedHTML(() => {
    const inserted = registry.flush();
    if (inserted.length === 0) {
      return null;
    }
    let styles = "";
    const dataEmotionAttribute = registry.cache.key;

    const globals: Array<{ name: string; style: string }> = [];

    inserted.forEach((name) => {
      const style = registry.cache.inserted[name];
      if (typeof style !== "boolean" && style !== undefined) {
        if (style.startsWith("/*|*/")) {
          globals.push({ name, style });
        } else {
          styles += style;
        }
      }
    });

    return (
      <>
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${dataEmotionAttribute}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}
        {styles && (
          <style
            data-emotion={`${dataEmotionAttribute} ${inserted.join(" ")}`}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </>
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
