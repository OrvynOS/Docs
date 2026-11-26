import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Toc } from "@/components/Toc";
import { ALL_PAGES, getPage } from "@/lib/docs";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_PAGES.map((p) => ({ slug: p.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPage((await params).slug.join("/"));
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${page.slug}` } };
}

export default async function DocPage({ params }: Props) {
  const page = getPage((await params).slug.join("/"));
  if (!page) notFound();
  return (
    <div className="doc">
      <article className="doc-body">
        <p className="doc-section">{page.section}</p>
        <h1>{page.title}</h1>
        {page.description && <p className="doc-lede">{page.description}</p>}
        <div className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />
        <nav className="pager" aria-label="Previous and next">
          {page.prev ? (
            <Link href={`/${page.prev.slug}`} className="pager-link">
              <span>Previous</span>
              <b>← {page.prev.title}</b>
            </Link>
          ) : (
            <span />
          )}
          {page.next && (
            <Link href={`/${page.next.slug}`} className="pager-link pager-next">
              <span>Next</span>
              <b>{page.next.title} →</b>
            </Link>
          )}
        </nav>
      </article>
      <aside className="doc-aside">
        <Toc toc={page.toc} />
      </aside>
    </div>
  );
}
