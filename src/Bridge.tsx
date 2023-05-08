import { Wallet } from '@bnb-chain/zkbnb-js-l1-sdk';
import { DatePicker, Divider } from 'antd';

import L2Client from './l2Client';
import BNB from './components/BNB';
import BEP20 from './components/BEP20';
import ERC721 from './components/ERC721';

export interface BridgingProps {
  zkWallet: Wallet;
  l2Client: L2Client;
  walletAddress: string;
}

const Bridge = ({ zkWallet, l2Client, walletAddress }: BridgingProps) => {
  return (
    <div>
      <section>
        <BNB zkWallet={zkWallet} l2Client={l2Client} walletAddress={walletAddress} />
        <Divider />
        <BEP20 zkWallet={zkWallet} l2Client={l2Client} walletAddress={walletAddress} />
        <Divider />
        <ERC721 zkWallet={zkWallet} l2Client={l2Client} walletAddress={walletAddress} />
      </section>
    </div>
  );
};

export default Bridge;
