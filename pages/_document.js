import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet"/>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.2.3/milligram.min.css"
          type="text/css"
        />
        <meta charSet="UTF-8"></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
