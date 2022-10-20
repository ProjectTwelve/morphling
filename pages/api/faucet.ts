import { ethers, providers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { erc20ABI } from 'wagmi';
import { P12_TOKEN_ADDRESS, RPC_URL } from '../../utils/constant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address, chainId, tokenAddr } = req.body;

    if (!address || !chainId || !tokenAddr) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    const provider = new providers.JsonRpcProvider(RPC_URL[chainId]);
    const wallet = new ethers.Wallet(process.env.privateKey!, provider);

    try {
      if (tokenAddr === P12_TOKEN_ADDRESS[chainId]) {
        const p12Token = new ethers.Contract(P12_TOKEN_ADDRESS[chainId], erc20ABI, wallet);
        const tx = await p12Token.transfer(address, parseEther('100'));

        res.status(200).json({ txHash: tx.hash });
        return;
      } else if (tokenAddr === ethers.constants.AddressZero) {
        const tx = await wallet.sendTransaction({ to: address, value: parseEther('0.1') });

        res.status(200).json({ txHash: tx.hash });
        return;
      }
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
    res.status(400).json({ error: 'Invalid request' });
    return;
  } else {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }
}
