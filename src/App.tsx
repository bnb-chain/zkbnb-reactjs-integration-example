import './App.css';
import {Wallet, getZkBNBDefaultProvider, Provider} from '@bnb-chain/zkbnb-js-l1-sdk';
import {useEffect, useState} from 'react';
import Bridge from './Bridge';
import {BigNumber, ethers} from "ethers";
import L2Client from "./l2Client";

const App = () => {
    // initialise SDK
    // general
    const [tab, setTab] = useState('marketplace');
    const [walletAddress, setWalletAddress] = useState('-');
    const [l1Balance, setL1Balance] = useState('-');
    const [l2Balance, setL2Balance] = useState('-');
    const [activated, setActivated] = useState(false);
    const [zkWallet, setZkWallet] = useState<Wallet>(Object);
    const [zkProvider, setZkProvider] = useState<Provider>(Object);
    const [l2Client, setL2Client] = useState<L2Client>(Object);

    // register and/or setup a user
    async function setup(): Promise<void> {
        // initialise a client with the minter for your NFT smart contract
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        window.ethereum.on('disconnect', () => {
            setWalletAddress('-')
            setL1Balance('-')
        });

        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);

        const minter = provider.getSigner(); //get Signature from Metamask wallet
        setWalletAddress(await minter.getAddress())
        const l1Balance = ethers.utils.formatEther(await minter.getBalance())
        setL1Balance(l1Balance.toString())
        // const zkProvider = await getZkBNBDefaultProvider('bscTestnet');
        const zkProvider = await Provider.newHttpProvider('https://devapi-zkbnb.nschail.com');
        const zkWallet = await Wallet.fromZkBNBSigner(minter, zkProvider);
        setZkWallet(zkWallet)
        setZkProvider(zkProvider)

        // init l2 client
        let network = 'bsc'
        if (provider.network.chainId === 97) {
            network = 'bscTestnet'
        } else if (provider.network.chainId === 56) {
            network = 'bsc'
        } else {
            alert('Unsupported network')
            return
        }
        await L2Client.getInstance().init(zkWallet, network)
        await setL2Client(L2Client.getInstance())
        await updateAccountByInterval()
        // query account
        const account = await L2Client.getInstance().getAccount()
        if (!account || account.code !== 100) {
             await checkAccount()
        } else {
            const bnb = account.assets.find((asset: { name: string; }) => asset.name === 'BNB')
            const l1Balance = ethers.utils.formatEther(bnb ? bnb.balance : '0')
            console.log('l1Balance', l1Balance)
            if (Number(l1Balance) < 0.001) {
                await checkAccount();
            } else if (account.status === 0) {
                // activate account
                await activateAccount()
            } else {
                setActivated(true)
            }
        }
    }

    // get account by interval
    async function updateAccountByInterval() {
        const account = await L2Client.getInstance().getAccount()
        if (account && Array.isArray(account.assets)) {
            const bnb = account?.assets.find((asset: { name: string; }) => asset.name === 'BNB')
            const l2Balance = ethers.utils.formatEther(bnb ? bnb.balance : '0')
            console.log('l2Balance', l2Balance)
            setL2Balance(l2Balance)
        }
        setTimeout(updateAccountByInterval, 3000)
    }

    async function checkAccount() {
        alert('Please bridge some BNB to your account fist and wait a few minutes.')
        setTab('bridge')
        // query account by interval
        const interval = setInterval(async () => {
            const account = await L2Client.getInstance().getAccount()
            if (account && account.status === 0) {
                clearInterval(interval)
                // activate account
                await activateAccount()
            }
        }, 1000)
    }

    async function activateAccount() {
        // query account status
        // if there is no balance, bridge first
        await L2Client.getInstance().activateAccount()
        // query account by interval
        const interval = setInterval(async () => {
            const account = await L2Client.getInstance().getAccount()
            if (account && account.status === 1) {
                clearInterval(interval)
                setActivated(true)
                alert('Account activated!')
            }
        }, 1000)
    }

    function handleTabs() {
        if (walletAddress) {
            switch (tab) {
                case 'bridge':
                default:
                    if (walletAddress === '-') return <div>Connect wallet</div>
                    return <Bridge
                        zkWallet={zkWallet}
                        l2Client={l2Client}
                        walletAddress={walletAddress}
                    />
            }
        }
        return null
    }

    return (
        <div className="App">
            {walletAddress === '-' && <button onClick={setup}>Connect wallet</button>}
            <div>
                Active wallet address: {walletAddress}
            </div>
            <div>
                BNB L1 Balance (in wei): {l1Balance}
            </div>
            <div>
                BNB L2 Balance (in wei): {l2Balance}
            </div>
            <button onClick={() => setTab('bridge')}>Bridge</button>
            <br/><br/><br/>
            {handleTabs()}
        </div>
    );
}

export default App;
