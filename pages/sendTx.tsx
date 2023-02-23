import { useForm } from '@mantine/form';
import { useSigner } from 'wagmi';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { TransactionRequest } from '@ethersproject/providers';

import { ethers, UnsignedTransaction } from 'ethers';

import { TextInput, Button, Text } from '@mantine/core';

const EcRecover = () => {
  const { data: signer } = useSigner();

  const [formValue, setFormValue] = useLocalStorage<string>('sendTx');

  const form = useForm<UnsignedTransaction>({
    initialValues: {
      to: ethers.constants.AddressZero,
      value: 0,
      data: '',
      gasPrice: 0,
      gasLimit: 0,
    },
  });

  useEffect(() => {
    setFormValue(JSON.stringify(form.values));
  }, [form.values]);

  useEffect(() => {
    if (formValue) {
      try {
        form.setValues(JSON.parse(formValue));
      } catch (e) {
        console.log('Failed to parse stored value');
      }
    }
  }, []);

  const onSubmit = (form: UnsignedTransaction) => {
    console.log(form);
    signer?.sendTransaction(form as TransactionRequest);
  };
  return (
    <div>
      <div className="indicator">SendTx</div>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput label="to" {...form.getInputProps('to')} />
        <TextInput label="value" {...form.getInputProps('value')} />

        <TextInput label="data" {...form.getInputProps('data')} />
        <TextInput label="gasLimit" {...form.getInputProps('gasLimit')} />
        <TextInput label="gasPrice" {...form.getInputProps('gasPrice')} />

        <Button type="submit">Send Transaction</Button>
      </form>
    </div>
  );
};

export default EcRecover;
