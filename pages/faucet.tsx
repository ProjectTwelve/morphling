import { Button, Select } from '@mantine/core';
import axios from 'axios';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSetState } from 'react-use';
import { useAccount } from 'wagmi';
import { BROWSER_URL, P12_TOKEN_ADDRESS } from '../utils/constant';

const Faucet = () => {
  const { address } = useAccount();
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const [info, setInfo] = useSetState<{ chainId: number; tokenAddr: string }>({
    chainId: 248832,
    tokenAddr: ethers.constants.AddressZero,
  });

  const requestFaucet = async (chainId: number, tokenAddr: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        '/api/faucet',
        {
          address: address,
          chainId: chainId,
          tokenAddr: tokenAddr,
        },
        { timeout: 10000 },
      );
      setTxHash(res?.data?.txHash);
    } catch (e) {
      alert('request fail');
      console.log(e);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (info.tokenAddr !== ethers.constants.AddressZero) {
      setInfo({ tokenAddr: P12_TOKEN_ADDRESS[info.chainId] });
    }
  }, [info.chainId]);

  return (
    <div className="items-center">
      <p>Your Address: {address || 'Please connect metamask'}</p>
      <div className="m-4 flex">
        <div className="m-1">Request</div>
        <Select
          className="mx-4"
          placeholder="Select Token"
          value={info.tokenAddr}
          data={[
            { value: ethers.constants.AddressZero, label: 'Test ETH' },
            { value: P12_TOKEN_ADDRESS[info.chainId], label: 'P12 Token' },
          ]}
          onChange={(v) => {
            setInfo({ tokenAddr: v! });
          }}
        />
        <div className="m-1">on</div>
        <Select
          className="mx-4"
          placeholder="Select Network"
          value={info.chainId.toString()}
          data={[
            { value: '5', label: 'Goerli' },
            { value: '20736', label: 'P12 Chain Pudge' },
            { value: '248832', label: 'P12 Chain Butcher' },
          ]}
          onChange={(v) => {
            setInfo({ chainId: Number(v) });
          }}
        />
        <Button
          onClick={() => {
            requestFaucet(info.chainId, info.tokenAddr);
          }}
          loading={loading}
          className="mx-4"
          disabled={!address}
        >
          Confirm
        </Button>
      </div>

      <div>
        <p>
          Transaction Hash: <Link href={BROWSER_URL[info.chainId] + '/tx/' + txHash}>{txHash}</Link>
        </p>
      </div>
    </div>
  );
};

export default Faucet;
