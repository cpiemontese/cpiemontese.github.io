import Head from 'next/head'
import { useState } from 'react'

import Toggle from './toggle'

const name = 'Cristiano Piemontese'
export const siteTitle = `${name} Portfolio`

export const IT = 'IT'
export const EN = 'EN'

export default function Layout({ hasToggle, children }) {
  const [toggled, setToggled] = useState(false)

  const lang = toggled ? IT : EN

  return (
    <div className="max-w-4xl min-h-screen mx-auto overflow-hidden">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={siteTitle} />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&family=Work+Sans&display=swap" rel="stylesheet" />
      </Head>
      {hasToggle ? (
        <header className="flex justify-end items-center my-4 px-8">
          <Toggle toggled={toggled} setToggled={setToggled} />
        </header>
      ) : (
        <></>
      )}
      <main>{children({ lang })}</main>
    </div>
  )
}
