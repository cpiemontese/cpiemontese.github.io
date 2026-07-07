import Head from 'next/head'
import { useState } from 'react'

import Toggle from './toggle'

const name = 'Cristiano Piemontese'
export const siteTitle = `${name} Portfolio`

export const IT = 'IT'
export const EN = 'EN'

export default function Layout({ hasToggle = true, children }) {
  const [toggled, setToggled] = useState(false)

  const lang = toggled ? IT : EN

  return (
    <div className="max-w-4xl min-h-screen mx-auto overflow-hidden bg-[#020617]">
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
      </Head>
      {hasToggle ? (
        <header className="fixed z-10 flex justify-end h-10 max-w-4xl w-full items-center px-6 sm:px-8 bg-slate-900/85 text-slate-100 border-b border-slate-700/80 backdrop-blur">
          <Toggle toggled={toggled} setToggled={setToggled} />
        </header>
      ) : (
        <></>
      )}
      <main className={hasToggle ? 'mt-10' : ''}>{children({ lang })}</main>
    </div>
  )
}
