import { useState } from 'react';
import { Typography } from 'antd';
const { Title } = Typography;
import { BridgingProps } from '../Bridge';

const ERC721 = ({ zkWallet, l2Client, walletAddress }: BridgingProps) => {
  const [depositTokenId, setDepositTokenId] = useState('');
  const [depositTokenAddress, setDepositTokenAddress] = useState('');
  const [withdrawalTokenId, setWithdrawalTokenId] = useState('');

  // deposit an NFT
  async function depositNFT() {
    await zkWallet.depositNFT({
      to: walletAddress,
      tokenId: depositTokenId,
      tokenAddress: depositTokenAddress,
    });
  }

  async function withdrawalNFT() {
    await l2Client.withdrawNFT(Number(withdrawalTokenId), walletAddress);
  }

  return (
    <div>
      <Title level={5}>ERC721:</Title>
      <div>
        Deposit NFT From L1 To L2:
        <br />
        <label>
          Token Address:
          <input type="text" value={depositTokenAddress} onChange={(e) => setDepositTokenAddress(e.target.value)} />
        </label>
        <label>
          Token ID:
          <input type="text" value={depositTokenId} onChange={(e) => setDepositTokenId(e.target.value)} />
        </label>
        <button onClick={depositNFT}>Deposit NFT</button>
      </div>
      <br />
      <br />
      <div>
        Withdrawal NFT From L2 To L1:
        <br />
        <label>
          Token ID:
          <input type="text" value={withdrawalTokenId} onChange={(e) => setWithdrawalTokenId(e.target.value)} />
        </label>
        <button onClick={withdrawalNFT}>Withdrawal NFT</button>
      </div>
    </div>
  );
};

export default ERC721;
