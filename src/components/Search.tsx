"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/docs";

function score(entry: SearchEntry, terms: string[]) {
  const title = entry.title.toLowerCase();
  const heading = (entry.heading ?? "").toLowerCase();
  const text = entry.text.toLowerCase();
  let s = 0;
  for (const t of terms) {
    if (heading.includes(t)) s += 6;
    else if (title.includes(t)) s += entry.heading ? 2 : 5;
    else if (text.includes(t)) s += 1;
    else return 0;
  }
  // Whole phrase in the section text ranks above scattered words.
  if (terms.length > 1 && text.includes(terms.join(" "))) s += 4;
  return s;
}

/** Ctrl/⌘ K search over page titles, section headings and text. */
export function Search() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<SearchEntry[]>([]);

  // Load the index on first open.
  useEffect(() => {
    if (!open || index.length) return;
    fetch("/search.json")
      .then((r) => r.json())
      .then(setIndex)
      .catch(() => undefined);
  }, [open, index.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !open && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => input.current?.focus(), 0);
    }
  }, [open]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return index.filter((e) => !e.heading).slice(0, 8);
    return index
      .map((e) => ({ e, s: score(e, terms) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((r) => r.e);
  }, [index, query]);

  const go = (e: SearchEntry) => {
    setOpen(false);
    router.push(`/${e.slug}${e.anchor ? `#${e.anchor}` : ""}`);
  };

  return (
    <>
      <button className="search-trigger" onClick={() => setOpen(true)} aria-label="Search the docs">
        <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
          <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span>Search</span>
        <kbd>Ctrl K</kbd>
      </button>
      {open && (
        <div className="search-overlay" onMouseDown={() => setOpen(false)}>
          <div className="search-modal" role="dialog" aria-modal="true" aria-label="Search" onMouseDown={(e) => e.stopPropagation()}>
            <input
              ref={input}
              value={query}
              placeholder="Search the docs"
              aria-label="Search the docs"
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter" && results[active]) go(results[active]);
              }}
            />
            <ul className="search-results" role="listbox">
              {index.length === 0 && <li className="search-empty">Loading…</li>}
              {index.length > 0 && results.length === 0 && <li className="search-empty">No results for “{query}”</li>}
              {results.map((r, i) => (
                <li key={`${r.slug}#${r.anchor ?? ""}`} role="option" aria-selected={i === active}>
                  <button className={i === active ? "active" : undefined} onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
                    <span className="search-section">{r.section}</span>
                    <span className="search-title">
                      {r.title}
                      {r.heading && <span className="search-heading"> › {r.heading}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
