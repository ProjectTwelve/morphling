import React, { PropsWithChildren } from 'react';
import { createClient, WagmiConfig } from 'wagmi';
import { getDefaultProvider } from 'ethers';
import Header from './Header';
import Footer from './Footer';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <WagmiConfig client={client}>
      <div className="container relative mx-auto">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </WagmiConfig>
  );
}
