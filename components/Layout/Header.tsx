import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from '@wagmi/core';
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
        <button className="btn btn-primary">{address && shortenAddress(address)}</button>
      ) : (
        <button className="btn btn-primary" onClick={() => connect()}>
          Connect Wallet
        </button>
      )}
    </header>
  );
}
