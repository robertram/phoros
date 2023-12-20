import Head from 'next/head';

const siteUrl = 'https://app.phoros.io';

export default function SEO({
  title = 'Phoros',
  description = "The platform to connect in twitter lists with your nft",
  ogImgUrl = 'https://firebasestorage.googleapis.com/v0/b/checkmyticket-20.appspot.com/o/Team%2FCheckMyTicketBanner2.jpg?alt=media&token=798ce41e-028f-4b59-b745-864fa4315fc7',
  ogUrl = siteUrl,
}) {
  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <meta key="description" name="description" content={description} />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:description" property="og:description" content={description} />
        <meta key="og:image" property="og:image" content={ogImgUrl} />
        <meta key="og:url" property="og:url" content={ogUrl} />
        <meta key="twitter:card" property="twitter:card" content="summary_large_image" />
      </Head>
    </>
  );
}