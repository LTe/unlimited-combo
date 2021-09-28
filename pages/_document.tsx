import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;
    const mode = pageProps.isDark ? 'dark-mode' : 'light-mode';
    return (
      <Html>
        <Head />
        <body className={`${mode} bg-yellow-100 text-gray-500`}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
