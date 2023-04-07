import {useState} from 'react';
import {Wallet} from "@bnb-chain/zkbnb-js-l1-sdk";
import {ethers} from "ethers";
import L2Client from "./l2Client";

interface BridgingProps {
    zkWallet: Wallet,
    l2Client: L2Client,
    walletAddress: string
}

const Bridge = ({zkWallet, l2Client, walletAddress}: BridgingProps) => {
    // bnb
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    // nft
    const [depositCollectionId, setDepositCollectionId] = useState('');
    const [depositTokenId, setDepositTokenId] = useState('');
    const [depositTokenAddress, setDepositTokenAddress] = useState('');
    const [withdrawalCollectionId, setWithdrawalCollectionId] = useState('');
    const [withdrawalTokenId, setWithdrawalTokenId] = useState('');
    const [withdrawalTokenAddress, setWithdrawalTokenAddress] = useState('');

    // deposit bnb
    async function depositBNB() {
        await zkWallet.deposit({
            to: walletAddress,
            tokenAddress: '0x0000000000000000000000000000000000000000',
            amount: ethers.utils.parseEther(depositAmount),
        })
    };

    // withdrawal bnb
    async function withdrawalBNB() {
        await l2Client.withdraw(withdrawalAmount, 0, walletAddress)
    };

    // deposit an NFT
    async function depositNFT() {
        await zkWallet.depositNFT({
            to: walletAddress,
            tokenId: depositTokenId,
            tokenAddress: depositTokenAddress
        })
    };

    async function withdrawalNFT() {
        await l2Client.withdrawNFT(Number(withdrawalTokenId), walletAddress)
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
                        <input type="text" value={depositAmount} onChange={e => setDepositAmount(e.target.value)}/>
                    </label>
                    <button onClick={depositBNB}>Deposit BNB</button>
                </div>
                <br/><br/>
                <div>
                    Withdrawal BNB:
                    <br/>
                    <label>
                        Amount (BNB):
                        <input type="text" value={withdrawalAmount}
                               onChange={e => setWithdrawalAmount(e.target.value)}/>
                    </label>
                    <button onClick={withdrawalBNB}>Withdrawal BNB</button>
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
                        Collection ID:
                        <input type="text" value={depositCollectionId} onChange={e => setDepositCollectionId(e.target.value)}/>
                    </label>
                    <label>
                        Token ID:
                        <input type="text" value={depositTokenId} onChange={e => setDepositTokenId(e.target.value)}/>
                    </label>
                    <label>
                        Token Address:
                        <input type="text" value={depositTokenAddress}
                               onChange={e => setDepositTokenAddress(e.target.value)}/>
                    </label>
                    <button onClick={depositNFT}>Deposit NFT</button>
                </div>
                <br/><br/>
                <div>
                    Withdrawal NFT:
                    <br/>
                    <label>
                        Collection ID:
                        <input type="text" value={withdrawalCollectionId} onChange={e => setWithdrawalCollectionId(e.target.value)}/>
                    </label>
                    <label>
                        Token ID:
                        <input type="text" value={withdrawalTokenId}
                               onChange={e => setWithdrawalTokenId(e.target.value)}/>
                    </label>
                    <button onClick={withdrawalNFT}>Withdrawal NFT</button>
                </div>
            </div>
        </div>
    );
}

export default Bridge;