import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div className='main'>
          <div className='gradient' />
        </div>
        <main>
          <Main />
          <NextScript />
        </main>
      </body>
    </Html>
  )
}
