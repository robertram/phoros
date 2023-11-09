import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  const title = "Phoros"
  const description = "Amplify Engagement Beyond the Mint"
  return (
    <Html lang='en'>
      <Head>
        <title>Phoros</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content="phoros, Costa Rica" />
        <meta name="author" content="Robert Ramirez" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/checkmyticket-20.appspot.com/o/Banner2.png?alt=media&token=beaf8527-f0d4-46aa-8ba5-7ce696d81f17" /> */}
        <meta property="og:image:alt" content={title} />
        <meta property="og:url" content="https://www.checkmyticket.xyz/" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* <meta name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/checkmyticket-20.appspot.com/o/Banner2.png?alt=media&token=beaf8527-f0d4-46aa-8ba5-7ce696d81f17" /> */}
        <meta name="twitter:image:alt" content={title}></meta>

        {
          typeof window !== "undefined" &&
          <link rel="stylesheet" href="//cdn.quilljs.com/1.2.6/quill.snow.css" />
        }
        <Script
          id="gtag"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />

        <Script id="ganalytics" strategy="lazyOnload">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
          page_path: window.location.pathname,
          });
          `}
        </Script>



        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=League+Gothic&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
