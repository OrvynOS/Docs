"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Wires up the rendered Markdown: copy buttons on code blocks. */
export function Enhance() {
  const pathname = usePathname();
  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest(".code-copy");
      if (!button) return;
      const code = button.parentElement?.querySelector("code")?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Press Ctrl+C";
      }
      setTimeout(() => (button.textContent = "Copy"), 1500);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);
  return null;
}

/** Header button that opens the section drawer on small screens. */
export function NavToggle() {
  return (
    <button className="nav-toggle" aria-label="Open the docs menu" onClick={() => window.dispatchEvent(new Event("docs:toggle-nav"))}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
