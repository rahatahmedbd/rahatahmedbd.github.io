"use client";

import Script from "next/script";

/**
 * LegacySite — renders the original site markup verbatim and boots the
 * original scripts. The external scripts self-initialize (they check
 * document.readyState), so loading them with afterInteractive (after the
 * markup is hydrated) reproduces the original behaviour exactly.
 * The redundant inline DOMContentLoaded script from the original file is
 * intentionally dropped (duplicate logic) — the modules below cover it all.
 */
export default function LegacySite({ html }: { html: string }) {
  return (
    <>
      {/* display:contents keeps header/main/footer as effective children of <body> */}
      <div
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <Script src="/js/nav.js" strategy="afterInteractive" />
      <Script src="/js/reveal.js" strategy="afterInteractive" />
      <Script src="/js/counter.js" strategy="afterInteractive" />
      <Script src="/js/language.js" strategy="afterInteractive" />
      <Script src="/js/theme.js" strategy="afterInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />
    </>
  );
}
