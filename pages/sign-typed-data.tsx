import { useForm } from '@mantine/form';
import { Select } from '@mantine/core';
import { useAccount, useNetwork, chainId, useSwitchNetwork, useSignTypedData } from 'wagmi';
import { getSignData, TSignParams } from '../utils/asset';
import { useState } from 'react';
import { ethers } from 'ethers';

import { TextInput, Button, Text } from '@mantine/core';
import { P12_TOKEN_ADDRESS } from '../utils/constant';

const Home = () => {
  const { address, isConnected } = useAccount();
  const [sig, setSig] = useState('');
  //   const { client } = useClient();
  const { chain } = useNetwork();
  const { signTypedDataAsync } = useSignTypedData();
  if (!chain || !address) {
    return <Text>Please Connect Your Wallet</Text>;
  }

  const form = useForm({
    initialValues: {
      salt: ethers.BigNumber.from(ethers.utils.randomBytes(32))._hex,
      user: address,
      chainId: chain?.id,
      intent: 1,
      delegateType: 1,
      deadline: Math.round(new Date().getTime() / 1000),
      currency: chain && P12_TOKEN_ADDRESS[chain.id],
      price: '0',
      salt2: ethers.BigNumber.from(ethers.utils.randomBytes(32))._hex,
      token: ethers.constants.AddressZero,
      tokenId: '0',
      amount: 0,
    },
  });

  const onSubmit = (data: TSignParams) => {
    console.log(data);
    const signParams = {
      salt: data.salt,
      user: data.user,
      chainId: data.chainId,
      delegateType: data.delegateType,
      intent: data.intent,
      deadline: data.deadline,
      currency: data.currency,
      token: data.token,
      tokenId: data.tokenId,
      price: data.price,
      amount: data.amount,
    };
    const [itemHash, signData] = getSignData(signParams);

    signTypedDataAsync(signData).then((sig) => {
      setSig(sig);
    });
  };
  return (
    <div>
      <div className="indicator">Sign Typed Data</div>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput label="salt" {...form.getInputProps('salt')} />
        <TextInput label="user" {...form.getInputProps('user')} />
        <TextInput label="chainId" {...form.getInputProps('chainId')} />
        <Select
          label="intent"
          placeholder="intent"
          {...form.getInputProps('intent')}
          data={[
            { value: 1, label: 'Buy' },
            { value: 2, label: 'Sell' },
          ]}
        />
        <Select label="delegateType" {...form.getInputProps('delegateType')} data={[{ value: 1, label: 'ERC1155' }]} />
        <TextInput label="deadline" {...form.getInputProps('deadline')} />
        <TextInput label="currency" {...form.getInputProps('currency')} />
        <TextInput label="price" {...form.getInputProps('price')} />
        <TextInput label="salt2" {...form.getInputProps('salt2')} />
        <TextInput label="token" {...form.getInputProps('token')} />
        <TextInput label="tokenId" {...form.getInputProps('tokenId')} />
        <TextInput label="amount" {...form.getInputProps('amount')} />

        <Button type="submit">Sign</Button>
      </form>

      <Text>Your Signature: {sig}</Text>
    </div>
  );
};

export default Home;
