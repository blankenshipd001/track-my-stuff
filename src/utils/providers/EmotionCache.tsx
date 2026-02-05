"use client";
import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";

export default function EmotionCache({ children }: { children: React.ReactNode }) {
  const [registry] = React.useState(() => {
    const cache = createCache({ key: "css", prepend: true });
    cache.compat = true;
    return { cache, flush: () => {
      const names = cache.inserted;
      return Object.keys(names);
    } };
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
