import { useState } from 'react';
import { Typography } from 'antd';
const { Title } = Typography;
import { ethers } from 'ethers';
import { BridgingProps } from '../Bridge';

const BNB = ({ zkWallet, l2Client, walletAddress }: BridgingProps) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  // deposit bnb
  async function depositBNB() {
    await zkWallet.deposit({
      to: walletAddress,
      tokenAddress: '0x0000000000000000000000000000000000000000',
      amount: ethers.utils.parseEther(depositAmount),
    });
  }

  // withdrawal bnb
  async function withdrawalBNB() {
    await l2Client.withdraw(withdrawalAmount, 0, walletAddress);
  }

  return (
    <div>
      <Title level={5}>BNB:</Title>
      <div>
        Bridge BNB From L1 To L2:
        <br />
        <label>
          Amount (BNB):
          <input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
        </label>
        <button onClick={depositBNB}>Deposit BNB</button>
      </div>
      <br />
      <br />
      <div>
        Withdrawal BNB From L2 To L1:
        <br />
        <label>
          Amount (BNB):
          <input type="text" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} />
        </label>
        <button onClick={withdrawalBNB}>Withdrawal BNB</button>
      </div>
    </div>
  );
};

export default BNB;
