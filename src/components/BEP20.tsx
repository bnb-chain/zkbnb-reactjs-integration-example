import {useState} from 'react';
import { Typography } from 'antd';
const { Title } = Typography;
import {ethers} from 'ethers';
import {BridgingProps} from "../Bridge";

const BEP20 = ({zkWallet, l2Client, walletAddress}: BridgingProps) => {

  const [assetAddress, setAssetAddress] = useState('');
  const [assetId, setAssetId] = useState<number>(1);
  const [bep20Address, setBep20Address] = useState('');
  const [bep20Id, setBep20Id] = useState<number>(1);
  const [depositBEP20Amount, setDepositBEP20Amount] = useState('');
  const [withdrawalBEP20Amount, setWithdrawalBEP20Amount] = useState('');

  // query assetAddress
  async function queryAssetByAssetId() {
    const assetAddr = await zkWallet.resolveTokenAddress(assetId);
    setAssetAddress(assetAddr)
  }

  // deposit BEP20
  async function depositBEP20() {
    if (!bep20Address) {
      alert('Please check the assetAddress first');
      return;
    }
    await zkWallet.deposit({
      to: walletAddress,
      tokenAddress: bep20Address,
      amount: ethers.utils.parseEther(depositBEP20Amount),
    });
  }

  // withdrawal BEP20
  async function withdrawalBEP20() {
    await l2Client.withdraw(withdrawalBEP20Amount, assetId, walletAddress);
  }

  return (
    <div>
      <Title level={5}>BEP20:</Title>
      <div>
        Step 1: Query assetAddress <br/>
        <input type="number" value={assetId} onChange={(e) => setAssetId(Number(e.target.value))}/>
        <label> AssetAddress: {assetAddress}</label><br/>

        <button onClick={queryAssetByAssetId}>Query assetAddress</button>
      </div>
      <br/>
      <br/>
      <div>
        Step 2: Bridge BEP20 From L1 To L2 <br/>
        <br/>
        <label>
          BEP20 Address (BEP20):
          <input type="text" value={bep20Address} onChange={(e) => setBep20Address(e.target.value)}/><br/>

          Amount (BEP20):
          <input type="text" value={depositBEP20Amount} onChange={(e) => setDepositBEP20Amount(e.target.value)}/>
        </label>
        <button onClick={depositBEP20}>Deposit BEP20</button>
      </div>
      <br/>
      <br/>
      <div>
        Step 3: Withdrawal BEP20 From L2 To L1:<br/>
        <br/>
        <label>
          Amount (BEP20):
          <input type="number" value={bep20Id} onChange={(e) => setBep20Id(Number(e.target.value))}/>
          <br/>
          Amount (BEP20):
          <input type="text" value={withdrawalBEP20Amount} onChange={(e) => setWithdrawalBEP20Amount(e.target.value)}/>
        </label>
        <button onClick={withdrawalBEP20}>Withdrawal BEP20</button>
      </div>
    </div>
  );
};

export default BEP20;
