import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Fjalla+One&family=Source+Sans+3&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
