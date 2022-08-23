import { useForm } from '@mantine/form';
import { Select } from '@mantine/core';
import { useAccount, useNetwork } from 'wagmi';
import { ecrevoer  } from '../utils/asset';
import { useState } from 'react';
import { ethers } from 'ethers';

import { TextInput, Button, Text } from '@mantine/core';
import { P12_TOKEN_ADDRESS } from '../utils/constant';

const EcRecover = () => {
  const { address } = useAccount();
  const [signer, setSigner] = useState('');
  const { chain } = useNetwork();
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

  const onSubmit = (data: any) => {
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

    const signer = ecrevoer(signParams, data.sig);

    setSigner(signer);
  };
  return (
    <div>
      <div className="indicator">Ecrecover</div>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput label="salt" {...form.getInputProps('salt')} />
        <TextInput label="user" {...form.getInputProps('user')} />
        <TextInput label="chainId" {...form.getInputProps('chainId')} />
        <Select
          label="intent"
          placeholder="intent"
          {...form.getInputProps('intent')}
          data={[
            { value: 1, label: 'Sell' },
            { value: 2, label: 'Buy' },
          ]}
        />
        <Select
          label="delegateType"
          {...form.getInputProps('delegateType')}
          data={[
            { value: 1, label: 'ERC1155' },
            { value: 2, label: 'ERC721' },
          ]}
        />
        <TextInput label="deadline" {...form.getInputProps('deadline')} />
        <TextInput label="currency" {...form.getInputProps('currency')} />
        <TextInput label="price" {...form.getInputProps('price')} />
        <TextInput label="salt2" {...form.getInputProps('salt2')} />
        <TextInput label="token" {...form.getInputProps('token')} />
        <TextInput label="tokenId" {...form.getInputProps('tokenId')} />
        <TextInput label="amount" {...form.getInputProps('amount')} />
        <TextInput label="sig" {...form.getInputProps('sig')} />

        <Button type="submit">EcRecover</Button>
      </form>

      <Text>Signer address: {signer}</Text>
    </div>
  );
};

export default EcRecover;
