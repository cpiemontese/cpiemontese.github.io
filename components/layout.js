import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

import Toggle from '../components/toggle'

const name = 'Cristiano Piemontese'
export const siteTitle = `${name} Portfolio`

export const IT = 'IT'
export const EN = 'EN'

export default function Layout({ children, home }) {
  const [toggled, setToggled] = useState(false);

  const lang = toggled ? IT : EN;

  return (
    <div className="max-w-4xl min-h-screen mx-auto pt-4 px-8 pb-8 overflow-hidden bg-gray-100 dark:bg-gray-800">
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
      <header className="flex justify-end items-center mb-4">
        <Toggle toggled={toggled} setToggled={setToggled} />
      </header>
      <main>{ children({ lang }) }</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>
              {
                lang === EN ? '← Back' : '← Indietro'
              }
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}
