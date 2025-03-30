import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content="FlashMaster" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="FlashMaster" />
          <meta name="description" content="A modern flashcard application with spaced repetition" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#0ea5e9" />
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#0ea5e9" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0c4a6e" />

          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 