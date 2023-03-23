import { useState } from 'react';
import {Wallet} from "@qingyang-id/zkbnb-l1-sdk";
import {ethers} from "ethers";

interface BridgingProps {
  zkWallet: Wallet,
  wallet: string
}

const Bridge = ({zkWallet, wallet}: BridgingProps) => {
  // withdrawals
  const [preparingWithdrawals, setPreparingWithdrawals] = useState(Object);
  const [readyWithdrawals, setReadyWithdrawals] = useState(Object);
  const [completedWithdrawals, setCompletedWithdrawals] = useState(Object);
  // eth
  const [depositAmount, setDepositAmount] = useState('');
  const [prepareAmount, setPrepareAmount] = useState('');
  // nft
  const [depositTokenId, setDepositTokenId] = useState('');
  const [depositTokenAddress, setDepositTokenAddress] = useState('');
  const [prepareTokenId, setPrepareTokenId] = useState('');
  const [prepareTokenAddress, setPrepareTokenAddress] = useState('');
  const [completeTokenId, setCompleteTokenId] = useState('');
  const [completeTokenAddress, setCompleteTokenAddress] = useState('');

  // deposit an NFT
  async function depositNFT() {
    await zkWallet.depositNFT({
      to: wallet,
      tokenId: depositTokenId,
      tokenAddress: depositTokenAddress
    })
  };

  // deposit eth
  async function depositBNB() {
    await zkWallet.deposit({
      to: wallet,
      tokenAddress: '0x0000000000000000000000000000000000000000',
      amount: ethers.utils.parseEther(depositAmount),
    })
  };

  // prepare an NFT withdrawal
  async function prepareWithdrawalNFT() {
  };

  // prepare an eth withdrawal
  async function prepareWithdrawalBNB() {
  };

  // complete an NFT withdrawal
  async function completeWithdrawalNFT() {
  };

  // complete an eth withdrawal
  async function completeWithdrawalBNB() {
  };

  return (
    <div>
      <div>
        BNB:
        <br/><br/>
        <div>
          Deposit BNB:
          <br/>
          <label>
            Amount (BNB):
            <input type="text" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
          </label>
          <button onClick={depositBNB}>Deposit BNB</button>
        </div>
        <br/><br/>
        <div>
          Prepare BNB for withdrawal (submit to be rolled up and confirmed on chain in the next batch):
          <br/>
          <label>
            Amount (BNB):
            <input type="text" value={prepareAmount} onChange={e => setPrepareAmount(e.target.value)} />
          </label>
          <button onClick={prepareWithdrawalBNB}>Prepare BNB Withdrawal</button>
        </div>
        <br/><br/>
        <div>
          Complete BNB withdrawal (withdraws entire eth balance that is ready for withdrawal to L1 wallet):
          <br/>
          <button onClick={completeWithdrawalBNB}>Complete BNB Withdrawal</button>
        </div>
      </div>
      <br/>
      <div>
        ERC721:
        <br/><br/>
        <div>
          Deposit NFT:
          <br/>
          <label>
            Token ID:
            <input type="text" value={depositTokenId} onChange={e => setDepositTokenId(e.target.value)} />
          </label>
          <label>
            Token Address:
            <input type="text" value={depositTokenAddress} onChange={e => setDepositTokenAddress(e.target.value)} />
          </label>
          <button onClick={depositNFT}>Deposit NFT</button>
        </div>
        <br/><br/>
        <div>
          Prepare NFT for withdrawal (submit to be rolled up and confirmed on chain in the next batch):
          <br/>
          <label>
            Token ID:
            <input type="text" value={prepareTokenId} onChange={e => setPrepareTokenId(e.target.value)} />
          </label>
          <label>
            Token Address:
            <input type="text" value={prepareTokenAddress} onChange={e => setPrepareTokenAddress(e.target.value)} />
          </label>
          <button onClick={prepareWithdrawalNFT}>Prepare NFT Withdrawal</button>
        </div>
        <br/><br/>
        <div>
          Complete NFT withdrawal (withdraws single NFT that is ready for withdrawal to L1 wallet):
          <br/>
          <label>
            Token ID:
            <input type="text" value={completeTokenId} onChange={e => setCompleteTokenId(e.target.value)} />
          </label>
          <label>
            Token Address:
            <input type="text" value={completeTokenAddress} onChange={e => setCompleteTokenAddress(e.target.value)} />
          </label>
          <button onClick={completeWithdrawalNFT}>Complete NFT Withdrawal</button>
        </div>
      </div>
      <br/><br/><br/>
      <div>
        Withdrawals being prepared:
        {JSON.stringify(preparingWithdrawals)}
      </div>
      <br/><br/>
      <div>
        Ready for withdrawal:
        {JSON.stringify(readyWithdrawals)}
      </div>
      <br/><br/>
      <div>
        Withdrawn to wallet:
        {JSON.stringify(completedWithdrawals)}
      </div>
    </div>
  );
}

export default Bridge;
