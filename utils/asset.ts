import { SignTypedDataArgs } from '@wagmi/core';
import { parseEther } from '@ethersproject/units';
import { defaultAbiCoder, ParamType } from '@ethersproject/abi';
import { SECRET_SHOP_ADDRESS, P12_TOKEN_ADDRESS } from '../utils/constant';
import { keccak256 } from '@ethersproject/keccak256';
import { hexConcat, verifyTypedData, _TypedDataEncoder } from 'ethers/lib/utils';

export interface TSignParams {
  salt: string;
  user: string;
  chainId: number;
  intent: number;
  delegateType: number;
  deadline: number;
  currency: string;
  salt2: string;
  token: string;
  tokenId: string;
  price: string;
  amount: number;
  sig: string;
}

export const EIP712Type = {
  Order: [
    { name: 'salt', type: 'uint256' },
    { name: 'user', type: 'address' },
    { name: 'network', type: 'uint256' },
    { name: 'intent', type: 'uint256' },
    { name: 'delegateType', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
    { name: 'currency', type: 'address' },
    { name: 'length', type: 'uint256' },
    { name: 'items', type: 'OrderItem[]' },
  ],
  OrderItem: [
    { name: 'price', type: 'uint256' },
    { name: 'data', type: 'bytes' },
  ],
};

export function ecrecover(params: TSignParams): [string, string] {
  const [, signData] = getSignData(params);

  const hash = _TypedDataEncoder.hash(signData.domain, signData.types, signData.value);

  const signer = verifyTypedData(signData.domain, signData.types, signData.value, params.sig);

  return [signer, hash];
}

/**
 *
 * @param params
 */
export const getSignData = (params: TSignParams): [string, SignTypedDataArgs] => {
  const itemData = [
    {
      salt: params.salt,
      token: params.token,
      tokenId: parseInt(params.tokenId, 10),
      amount: params.amount,
    },
  ];
  const item = {
    price: parseEther(params.price).toString(),
    data: defaultAbiCoder.encode(['tuple(uint256 salt, address token, uint256 tokenId, uint256 amount)[]'], [itemData]),
  };
  const domain = {
    name: 'P12 SecretShop',
    version: '1.0.0',
    chainId: params.chainId,
    verifyingContract: SECRET_SHOP_ADDRESS[params.chainId],
  };

  const orderPreInfo = {
    salt: params.salt,
    user: params.user,
    network: params.chainId,
    intent: params.intent,
    delegateType: params.delegateType,
    deadline: params.deadline,
    currency: P12_TOKEN_ADDRESS[params.chainId],
  };
  const signData: SignTypedDataArgs = {
    types: EIP712Type,
    domain,
    value: { ...orderPreInfo, length: 1, items: [item] },
  };
  const itemHash = getItemHash({ ...orderPreInfo, item });
  return [itemHash, signData];
};

/**
 *
 * @param data
 */
export const getItemHash = (data: any) => {
  return keccak256(
    '0x' +
      defaultAbiCoder
        .encode(
          [
            ParamType.from({
              type: 'tuple',
              name: 'order',
              components: [
                { name: 'salt', type: 'uint256' },
                { name: 'user', type: 'address' },
                { name: 'network', type: 'uint256' },
                { name: 'intent', type: 'uint256' },
                { name: 'delegateType', type: 'uint256' },
                { name: 'deadline', type: 'uint256' },
                { name: 'currency', type: 'address' },
                {
                  name: 'item',
                  type: 'tuple',
                  components: [
                    { name: 'price', type: 'uint256' },
                    { name: 'data', type: 'bytes' },
                  ],
                },
              ],
            }),
          ],
          [data],
        )
        .slice(66),
  );
};
