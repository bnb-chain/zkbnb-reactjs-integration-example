import './App.css';
import {Wallet, getZkBNBDefaultProvider} from '@qingyang-id/zkbnb-l1-sdk';
import {useEffect, useState} from 'react';
import Marketplace from './Marketplace';
import Inventory from './Inventory';
import Bridge from './Bridge';
import {ethers} from "ethers";

const App = () => {
    // initialise SDK
    // general
    const [tab, setTab] = useState('marketplace');
    const [wallet, setWallet] = useState('-');
    const [balance, setBalance] = useState('-');
    const [zkWallet, setZkWallet] = useState<Wallet>(Object);


    useEffect(() => {
        setup()
    }, [])

    // register and/or setup a user
    async function setup(): Promise<void> {
        // initialise a client with the minter for your NFT smart contract
        const provider = new ethers.providers.Web3Provider(window.ethereum);


        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);

        const minter = provider.getSigner(); //get Signature from Metamask wallet
        setWallet(await minter.getAddress())
        const balance = ethers.utils.formatEther(await minter.getBalance())
        setBalance(balance.toString())
        const zkBNBProvider = await getZkBNBDefaultProvider('bscTestnet');
        const zkWallet = await Wallet.fromZkBNBSigner(minter, zkBNBProvider);
        setZkWallet(zkWallet)
    }

    function handleTabs() {
        if (wallet) {
            switch (tab) {
                case 'inventory':
                    if (wallet === '-') return <div>Connect wallet</div>
                    return <Inventory
                        zkWallet={zkWallet}
                        wallet={wallet}/>
                case 'bridge':
                    if (wallet === '-') return <div>Connect wallet</div>
                    return <Bridge
                        zkWallet={zkWallet}
                        wallet={wallet}
                    />
                default:
                    return <Marketplace
                        zkWallet={zkWallet}
                    />
            }
        }
        return null
    }

    return (
        <div className="App">
            {wallet === '-' && <button onClick={setup}>Connect wallet</button>}
            <div>
                Active wallet: {wallet}
            </div>
            <div>
                BNB balance (in wei): {balance}
            </div>
            <button onClick={() => setTab('bridge')}>Bridge</button>
            <button onClick={() => setTab('marketplace')}>Marketplace</button>
            <button onClick={() => setTab('inventory')}>Inventory</button>
            <br/><br/><br/>
            {handleTabs()}
        </div>
    );
}

export default App;
