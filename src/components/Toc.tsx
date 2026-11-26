"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/docs";

/** "On this page", highlighting the section in view. */
export function Toc({ toc }: { toc: TocEntry[] }) {
  const [current, setCurrent] = useState(toc[0]?.id);
  useEffect(() => {
    const headings = toc.map((t) => document.getElementById(t.id)).filter((h): h is HTMLElement => Boolean(h));
    const onScroll = () => {
      let id = headings[0]?.id;
      for (const h of headings) if (h.getBoundingClientRect().top < 120) id = h.id;
      setCurrent(id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  if (toc.length < 2) return null;
  return (
    <nav className="toc" aria-label="On this page">
      <p className="toc-title">On this page</p>
      <ul>
        {toc.map((t) => (
          <li key={t.id} className={t.depth === 3 ? "toc-sub" : undefined}>
            <a href={`#${t.id}`} className={current === t.id ? "active" : undefined}>
              {t.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
