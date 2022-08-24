import { useForm } from '@mantine/form';
import { Code, JsonInput, Select } from '@mantine/core';
import { useAccount, useNetwork, chainId, useSwitchNetwork, useSignTypedData } from 'wagmi';
import { ecrecover, getSignData, TSignParams } from '../utils/asset';
import { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';

import { TextInput, Button, Text } from '@mantine/core';
import { P12_TOKEN_ADDRESS } from '../utils/constant';
import { randomBytes } from 'crypto';
import { useLocalStorage } from 'react-use';

const SignTypedData = () => {
  const { address, isConnected } = useAccount();
  const [sig, setSig] = useState('');
  const [signer, setSigner] = useState('');
  const [hash, setHash] = useState('');
  //   const { client } = useClient();
  const { chain } = useNetwork();
  const { signTypedDataAsync } = useSignTypedData();
  const [formValue, setFormValue] = useLocalStorage<string>('user-form');

  const form = useForm<TSignParams>({
    initialValues: {
      salt: ethers.BigNumber.from(ethers.utils.randomBytes(32))._hex,
      user: address || '',
      chainId: chain?.id || 0,
      intent: 1,
      delegateType: 1,
      deadline: Math.round(new Date().getTime() / 1000),
      currency: (chain && P12_TOKEN_ADDRESS[chain.id]) || '',
      price: '0',
      salt2: ethers.BigNumber.from(ethers.utils.randomBytes(32))._hex,
      token: ethers.constants.AddressZero,
      tokenId: '0',
      amount: 0,
      sig: BigNumber.from(randomBytes(64))._hex + '1c',
    },
  });

  useEffect(() => {
    form.setFieldValue('user', address || '');
  }, [address]);

  useEffect(() => {
    form.setFieldValue('chainId', chain?.id || 0);
  }, [chain]);

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

  const sign = (data: TSignParams) => {
    const [itemHash, signData] = getSignData(data);

    signTypedDataAsync(signData).then((sig) => {
      setSig(sig);
    });
  };

  const recover = (form: TSignParams) => {
    console.log('hh');

    const [signer, hash] = ecrecover(form);
    setHash(hash);
    setSigner(signer);
  };
  return (
    <div>
      <div className="indicator">Sign Typed Data</div>
      <form onSubmit={form.onSubmit(sign)}>
        <TextInput label="salt" {...form.getInputProps('salt')} />
        <TextInput label="user" {...form.getInputProps('user')} />
        <Select
          className="inline-block"
          label="chainId"
          placeholder="chainId"
          {...form.getInputProps('chainId')}
          data={[
            { value: 4, label: 'Rinkeby(4)' },
            { value: 44010, label: 'p12TestNet(44010)' },
          ]}
        />
        <Select
          className="inline-block"
          label="intent"
          placeholder="intent"
          {...form.getInputProps('intent')}
          data={[
            { value: 1, label: 'Sell' },
            { value: 2, label: 'Buy' },
          ]}
        />
        <Select
          className="inline-block"
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

        <Button type="submit">Sign</Button>
        <Button
          onClick={() => {
            recover(form.values);
          }}
        >
          Recover
        </Button>
      </form>

      <Text size="sm" weight={500} mt="xl">
        Form values:
      </Text>
      <JsonInput
        mt={5}
        value={JSON.stringify(form.values, null, 2)}
        autosize
        formatOnBlur
        onChange={(data) => {
          form.setValues(JSON.parse(data));
        }}
      />

      <Text>Typed Data Hash: {hash}</Text>
      <Text>Signer address: {signer}</Text>
    </div>
  );
};

export default SignTypedData;
