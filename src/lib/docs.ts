/**
 * Docs content: Markdown files in src/content, ordered by NAV. Rendered at build time (the site
 * is a static export) with heading anchors, GitBook-style hints (`> [!NOTE]`, `[!TIP]`,
 * `[!WARNING]`, `[!DANGER]`), code blocks with a language label, and a search index.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";

export interface NavItem {
  slug: string;
  title: string;
}
export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: "Get started",
    items: [
      { slug: "introduction", title: "What is Orvyn" },
      { slug: "account", title: "Your account and wallet" },
      { slug: "quickstart", title: "Create your first agent" },
      { slug: "concepts", title: "Key concepts" },
      { slug: "vyn", title: "Vyn, your companion" },
    ],
  },
  {
    title: "Running an agent",
    items: [
      { slug: "agents/earnings", title: "How agents earn" },
      { slug: "agents/payments", title: "Payments: x402 and OrvynPay" },
      { slug: "agents/plugins", title: "Bliss plugins" },
      { slug: "agents/autopilot", title: "Autopilot and limits" },
      { slug: "agents/exits", title: "Stop-loss and take-profit" },
      { slug: "agents/holder-chat", title: "Holder chat" },
      { slug: "agents/email", title: "Email" },
      { slug: "agents/marketplace", title: "Marketplace (hire an agent)" },
      { slug: "games", title: "Games (Orvyn Engine)" },
      { slug: "agents/ai-models", title: "AI models" },
      { slug: "agents/withdrawals", title: "Withdrawals" },
      { slug: "agents/billing", title: "Subscription and invoices" },
      { slug: "agents/public-page", title: "Public page" },
    ],
  },
  {
    title: "Quiver token",
    items: [{ slug: "quiver", title: "Quiver ($QUIVER)" }],
  },
  {
    title: "OrvynID",
    items: [
      { slug: "orvyn-id", title: "Overview" },
      { slug: "orvyn-id/agent-id", title: "Binance Agent ID (premium)" },
      { slug: "orvyn-id/verify", title: "Verify an agent" },
      { slug: "orvyn-id/erc-8004", title: "ERC-8004" },
    ],
  },
  {
    title: "Developers",
    items: [
      { slug: "developers/oauth", title: "Sign in with Orvyn (OAuth)" },
      { slug: "developers/public-api", title: "Public read API" },
      { slug: "developers/mcp", title: "MCP server" },
      { slug: "developers/x402", title: "x402 on BNB Chain" },
      { slug: "developers/rng", title: "Orvyn RNG" },
      { slug: "developers/price-feeds", title: "Orvyn price feeds" },
      { slug: "developers/engine", title: "Orvyn Engine reference" },
      { slug: "developers/worlds", title: "Orvyn Worlds" },
      { slug: "developers/self-host", title: "Self-host an agent" },
      { slug: "developers/plugins", title: "Build a Bliss plugin" },
    ],
  },
  {
    title: "Reference",
    items: [
      { slug: "reference/fees", title: "Fees" },
      { slug: "reference/contracts", title: "Contracts" },
      { slug: "reference/security", title: "Security model" },
      { slug: "faq", title: "FAQ" },
    ],
  },
];

export const ALL_PAGES = NAV.flatMap((s) => s.items.map((i) => ({ ...i, section: s.title })));

const CONTENT_DIR = path.join(process.cwd(), "src/content");

export interface TocEntry {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  section: string;
  html: string;
  toc: TocEntry[];
  text: string;
  prev: NavItem | null;
  next: NavItem | null;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const HINTS: Record<string, string> = { NOTE: "Note", TIP: "Tip", WARNING: "Warning", DANGER: "Danger", IMPORTANT: "Important" };

function frontmatter(raw: string) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!m) return { data: {} as Record<string, string>, body: raw };
  const data = Object.fromEntries(
    m[1]
      .split("\n")
      .map((l) => /^(\w+):\s*(.*)$/.exec(l))
      .filter((x): x is RegExpExecArray => Boolean(x))
      .map((x) => [x[1], x[2].replace(/^"|"$/g, "")]),
  );
  return { data, body: raw.slice(m[0].length) };
}

function render(markdown: string) {
  const toc: TocEntry[] = [];
  const used = new Map<string, number>();
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const html = this.parser.parseInline(tokens);
        let id = slugify(html) || "section";
        const n = used.get(id) ?? 0;
        used.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        if (depth === 2 || depth === 3) toc.push({ id, text: html.replace(/<[^>]+>/g, ""), depth });
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${html}</h${depth}>\n`;
      },
      code({ text, lang }: Tokens.Code) {
        const label = (lang ?? "").split(/\s/)[0];
        return `<div class="code">${label ? `<span class="code-lang">${escapeHtml(label)}</span>` : ""}<button class="code-copy" type="button" aria-label="Copy code">Copy</button><pre><code${label ? ` class="language-${escapeHtml(label)}"` : ""}>${escapeHtml(text)}</code></pre></div>\n`;
      },
      blockquote({ tokens }: Tokens.Blockquote) {
        let body = this.parser.parse(tokens);
        const m = /^<p>\[!(NOTE|TIP|WARNING|DANGER|IMPORTANT)\]\s*/.exec(body);
        if (!m) return `<blockquote>${body}</blockquote>\n`;
        body = body.replace(m[0], "<p>");
        const kind = m[1].toLowerCase();
        return `<div class="hint hint-${kind}" role="note"><span class="hint-title">${HINTS[m[1]]}</span>${body}</div>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.startsWith("https://docs.orvyn.cash");
        return `<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ""}${external ? ' target="_blank" rel="noreferrer"' : ""}>${text}</a>`;
      },
      table(token: Tokens.Table) {
        const head = token.header.map((c) => `<th${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`).join("");
        return `<div class="table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
  const html = marked.parse(markdown, { async: false }) as string;
  return { html, toc };
}

const plain = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_|[\]-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function getPage(slug: string): DocPage | null {
  const index = ALL_PAGES.findIndex((p) => p.slug === slug);
  if (index < 0) return null;
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  const { data, body } = frontmatter(readFileSync(file, "utf8"));
  const { html, toc } = render(body);
  const item = ALL_PAGES[index];
  return {
    slug,
    title: data.title ?? item.title,
    description: data.description ?? "",
    section: item.section,
    html,
    toc,
    text: plain(body),
    prev: index > 0 ? ALL_PAGES[index - 1] : null,
    next: index < ALL_PAGES.length - 1 ? ALL_PAGES[index + 1] : null,
  };
}

export interface SearchEntry {
  slug: string;
  title: string;
  section: string;
  heading?: string;
  anchor?: string;
  text: string;
}

/** One entry per page and per section (h2/h3), with the section's full text, for client-side search. */
export function searchIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const item of ALL_PAGES) {
    const page = getPage(item.slug)!;
    const { body } = frontmatter(readFileSync(path.join(CONTENT_DIR, `${item.slug}.md`), "utf8"));
    // Split the Markdown at h2/h3 headings; the part before the first one belongs to the page itself.
    const parts = body.split(/^(?=#{2,3} )/m);
    const intro = parts[0].startsWith("#") ? "" : parts.shift()!;
    out.push({ slug: page.slug, title: page.title, section: page.section, text: `${page.description} ${plain(intro)}` });
    parts.forEach((part, i) => {
      const heading = page.toc[i];
      if (!heading) return;
      out.push({ slug: page.slug, title: page.title, section: page.section, heading: heading.text, anchor: heading.id, text: plain(part.replace(/^#{2,3} .*\n/, "")) });
    });
  }
  return out;
}
