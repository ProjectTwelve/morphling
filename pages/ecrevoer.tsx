import { useForm } from '@mantine/form';
import { Select } from '@mantine/core';
import { useAccount, useNetwork, useConnect } from 'wagmi';
import { ecrevoer } from '../utils/asset';
import { useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';

import { ethers } from 'ethers';

import { TextInput, Button, Text } from '@mantine/core';
import { P12_TOKEN_ADDRESS } from '../utils/constant';

const EcRecover = () => {
  const { address } = useAccount({
    // onConnect({ address, connector, isReconnected }) {
    //   console.log('Connected', { address, connector, isReconnected });
    // },
  });

  const [signer, setSigner] = useState('');
  const [hash, setHash] = useState('');
  const [formValue, setFormValue] = useLocalStorage<string>('user-form');
  const { chain } = useNetwork();

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
      sig: '',
    },
  });

  useEffect(() => {
    if (formValue) {
      try {
        form.setValues(JSON.parse(formValue));
      } catch (e) {
        console.log('Failed to parse stored value');
      }
    }
  }, []);

  useEffect(() => {
    setFormValue(JSON.stringify(form.values));
  }, [form.values]);

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

    const [signer, hash] = ecrevoer(signParams, data.sig);
    setHash(hash);
    setSigner(signer);
  };
  return (
    <div>
      <div className="indicator">Ecrecover</div>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput label="salt" {...form.getInputProps('salt')} />
        <TextInput label="user" {...form.getInputProps('user')} />
        <Select
          label="chainId"
          placeholder="chainId"
          {...form.getInputProps('chainId')}
          data={[
            { value: 4, label: 'Rinkeby(4)' },
            { value: 44010, label: 'p12TestNet(44010)' },
          ]}
        />
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

      <Text>Typed Data Hash: {hash}</Text>
      <Text>Signer address: {signer}</Text>
    </div>
  );
};

export default EcRecover;
