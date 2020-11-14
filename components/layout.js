import Head from 'next/head'
import Link from 'next/link'

const name = 'Cristiano Piemontese'
export const siteTitle = 'Next.js Sample Website'

export default function Layout({ children, home }) {
  return (
    <div className="max-w-4xl min-h-screen mx-auto p-8 overflow-hidden">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Cristiano Piemontese portfolio"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content="Cristiano Piemontese's portfolio" />
      </Head>
      {/* <header className="">
      </header> */}
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}
