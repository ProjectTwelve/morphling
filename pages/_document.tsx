import { createGetInitialProps } from '@mantine/next';
import { Html, Head, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = getInitialProps;