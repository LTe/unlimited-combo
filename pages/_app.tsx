import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { DarkMode } from '@components/DarkMode';
// @ts-ignore
import nightwind from 'nightwind/helper';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container h-full w-full mx-auto p-10">
      <div className={'absolute top-1 left-1'}>
        <DarkMode />
      </div>
      <Head>
        <title>Unlimited Combo</title>
        <meta name="description" content="Unlimited Combo Generator" />
        <link rel="icon" href="/favicon.ico" />
        <body className={'bg-yellow-100 dark:bg-yellow-900 text-gray-500'} />
        <script dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
      </Head>

      <div className="flex justify-center flex-col items-center gap-8">
        <Link href={'/'}>
          <a>
            <h1 className="text-5xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-500 to-red-500">
              Unlimited Combo Generator
            </h1>
          </a>
        </Link>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
export default MyApp;
