import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from '@wagmi/core';
import { Button } from '@mantine/core';
import { useIsMounted } from '../../hooks/useIsMounted';
import { shortenAddress } from '../../utils';

export default function Header() {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <header className="flex items-center justify-between py-4">
      <div>Logo</div>
      {isMounted && isConnected ? (
        <Button>{address && shortenAddress(address)}</Button>
      ) : (
        <Button onClick={() => connect()}>Connect Wallet</Button>
      )}
    </header>
  );
}
