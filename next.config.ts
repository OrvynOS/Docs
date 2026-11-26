import type { NextConfig } from "next";

// docs.orvyn.cash: a fully static site (no server, no secrets). Pages come from src/content/*.md.
const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default config;
