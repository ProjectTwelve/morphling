import { useForm } from '@mantine/form';
import { useSigner } from 'wagmi';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { TransactionRequest } from '@ethersproject/providers';

import { BigNumberish, ethers, UnsignedTransaction } from 'ethers';

import { TextInput, Button, Text } from '@mantine/core';

const EcRecover = () => {
  const { data: signer } = useSigner();

  const [formValue, setFormValue] = useLocalStorage<string>('sendTxWithMsg');

  const form = useForm<{ to?: string; value?: string; message?: string }>({
    initialValues: {
      to: undefined,
      value: undefined,
      message: undefined,
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

  const onSubmit = (form: { to?: string; value?: BigNumberish; message?: string }) => {
    signer?.sendTransaction({
      to: form.to,
      value: ethers.utils.parseEther(form.value || '0'),
      data: ethers.utils.toUtf8Bytes(form.message || ''),
    });
  };
  return (
    <div>
      <div className="indicator">SendTx</div>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput label="to" {...form.getInputProps('to')} />
        <TextInput label="value(ETH)" {...form.getInputProps('value')} />

        <TextInput label="message" {...form.getInputProps('message')} />

        <Button type="submit">Send Transaction</Button>
      </form>
    </div>
  );
};

export default EcRecover;
