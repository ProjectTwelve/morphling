import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from '@wagmi/core';
import { Button } from '@mantine/core';
import { useIsMounted } from '../../hooks/useIsMounted';
import { shortenAddress } from '../../utils';
import Link from 'next/link';

export default function Header() {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <header className="flex items-center justify-between py-4">
      <div>Logo</div>
      <div className="flex items-center justify-center">
        <div className="mx-4 cursor-pointer text-white hover:text-white">
          <Link href="sign-typed-data">Sign Typed Data</Link>
        </div>
        <div className="mx-4 cursor-pointer text-white hover:text-white">
          <Link href="ecrecover">Ecrecover</Link>
        </div>
        <div className="mx-4 cursor-pointer text-white hover:text-white">
          <Link href="faucet">Faucet</Link>
        </div>
      </div>
      {isMounted && isConnected ? (
        <Button>{address && shortenAddress(address)}</Button>
      ) : (
        <Button onClick={() => connect()}>Connect Wallet</Button>
      )}
    </header>
  );
}
