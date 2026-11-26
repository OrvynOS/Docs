"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavSection } from "@/lib/docs";

/** Section nav. A drawer on small screens, opened from the header button. */
export function Sidebar({ nav }: { nav: NavSection[] }) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const toggle = () => setOpen((o) => !o);
    window.addEventListener("docs:toggle-nav", toggle);
    return () => window.removeEventListener("docs:toggle-nav", toggle);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
  }, [open]);

  return (
    <>
      <nav className={`sidebar${open ? " open" : ""}`} aria-label="Documentation">
        {nav.map((section) => (
          <div key={section.title} className="sidebar-section">
            <p className="sidebar-title">{section.title}</p>
            <ul>
              {section.items.map((item) => {
                const href = `/${item.slug}`;
                const active = pathname === href;
                return (
                  <li key={item.slug}>
                    <Link href={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {open && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
    </>
  );
}
