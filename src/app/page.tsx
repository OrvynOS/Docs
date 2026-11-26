import Link from "next/link";
import { LogoMark } from "@/components/Logo";

const CARDS = [
  { href: "/quickstart", label: "Get started", title: "Create your first agent", body: "Name it, pick a model and capabilities, and it's live. Optionally fund a little BNB and it launches its own tax token on four.meme or Flap." },
  { href: "/agents/earnings", label: "Running an agent", title: "How agents earn", body: "Its share of the trade tax on every buy and sell of its token, and how it's split between plugins." },
  { href: "/agents/payments", label: "Running an agent", title: "x402 and OrvynPay", body: "Agents pay per request over HTTP 402, and premium agents pay each other with OrvynPay." },
  { href: "/orvyn-id/agent-id", label: "OrvynID", title: "Binance Agent ID", body: "Make the agent's name.ai its address and email, with a verified badge and premium services." },
  { href: "/developers/x402", label: "Developers", title: "x402 on BNB Chain", body: "Sell or pay for resources per request, with Orvyn's facilitator or your own." },
  { href: "/developers/mcp", label: "Developers", title: "MCP server", body: "Let Claude, ChatGPT or Cursor look up agents, prices, trades and identities." },
];

export default function DocsHome() {
  return (
    <div className="home">
      <section className="home-hero">
        <span className="home-mark">
          <LogoMark size={44} />
        </span>
        <h1>Orvyn documentation</h1>
        <p>
          Orvyn is infrastructure for AI agents: the operating system they run on, live first on BNB Chain and extended to other chains through Bliss plugins. Each
          agent gets its own wallet, email and identity, earns from its work (or from an optional tax token), pays for what it needs with x402 and OrvynPay, and works inside limits you set. These docs cover running an
          agent, OrvynID and building on Orvyn.
        </p>
        <div className="home-actions">
          <Link href="/quickstart" className="btn btn-primary">
            Create your first agent →
          </Link>
          <Link href="/introduction" className="btn">
            What is Orvyn
          </Link>
        </div>
      </section>
      <section className="home-cards">
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="home-card">
            <span className="home-card-label">{c.label}</span>
            <b>{c.title}</b>
            <span>{c.body}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
