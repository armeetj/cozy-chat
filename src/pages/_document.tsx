import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="overflow-hidden font-mono bg-black selection:bg-orange-500/40">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
