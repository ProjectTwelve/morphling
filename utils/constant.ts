import { chain } from 'wagmi';
import { CHAIN_ID } from './enum';

export const RPC_URL: { [chainId: number]: string } = {
  [CHAIN_ID.P12TEST]: 'https://testnet.p12.games',
  [CHAIN_ID.GOERLI]: chain.goerli.rpcUrls.default,
};

export const BROWSER_URL: { [chainId: number]: string } = {
  [CHAIN_ID.P12TEST]: 'https://blockscout.p12.games',
  [CHAIN_ID.GOERLI]: chain.goerli.blockExplorers!.default.url,
};

export const P12_TOKEN_ADDRESS: { [chainId: number]: string } = {
  [CHAIN_ID.RINKEBY]: '0x2844B158Bcffc0aD7d881a982D464c0ce38d8086',
  [CHAIN_ID.P12TEST]: '0xeAc1F044C4b9B7069eF9F3eC05AC60Df76Fe6Cd0',
  [CHAIN_ID.GOERLI]: '0x2844B158Bcffc0aD7d881a982D464c0ce38d8086',
};

export const SECRET_SHOP_ADDRESS: { [chainId: number]: string } = {
  [CHAIN_ID.RINKEBY]: '0x020bBfBc20283f8528C5f4eeFB4f2F6FAb7d921B',
  [CHAIN_ID.P12TEST]: '0x76eDf742106828B2aDd50829142B84d3B337Fdd5',
};

export const INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
