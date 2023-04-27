import {Network} from '@bnb-chain/zkbnb-js-l1-sdk/dist/types';
import {Account} from "@bnb-chain/zkbnb-js-sdk/dist/web/zk";
import {Wallet, getZkBNBDefaultProvider, Provider} from '@bnb-chain/zkbnb-js-l1-sdk';
import {Tabs, Descriptions} from 'antd';
import type {TabsProps} from 'antd';
import {useState} from 'react';
import {ethers} from 'ethers';
import './App.css';
import L2Client from './l2Client';
import Bridge from './Bridge';
import Marketplace from './Marketplace';

/**
 * Here is mainly responsible for connecting to the browser wallet,
 * when it does not exist on L2 or in an inactive state,
 * you need to ensure that the account exists on L2 and is active through a timing task.
 * The page will also update the balance on L1 and L2 through a timing task.
 */
const App = () => {
  // initialise SDK
  // general
  const [tab, setTab] = useState('bridge');
  const [walletAddress, setWalletAddress] = useState('-');
  const [isConnected, setIsConnected] = useState(false);
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
      setWalletAddress('-');
      setL1Balance('-');
    });

    // MetaMask requires requesting permission to connect users accounts
    await provider.send('eth_requestAccounts', []);

    const minter = provider.getSigner(); //get Signature from Metamask wallet
    setWalletAddress(await minter.getAddress());
    setIsConnected(true);

    const l1Balance = ethers.utils.formatEther(await minter.getBalance());
    setL1Balance(l1Balance.toString());

    let network: Network = 'bsc';
    if (provider.network.chainId === 97) {
      // bsc testnet
      network = 'bscTestnet';
    } else if (provider.network.chainId === 56) {
      // bsc mainnet
      network = 'bsc';
    } else {
      alert('Unsupported network');
      return;
    }

    const zkProvider = await getZkBNBDefaultProvider(network);
    setZkProvider(zkProvider);

    const zkWallet = await Wallet.fromZkBNBSigner(minter, zkProvider);
    setZkWallet(zkWallet);

    // init l2 client
    await L2Client.getInstance().init(zkWallet, network);
    await setL2Client(L2Client.getInstance());
    await updateAccountByInterval();

    // query L2 account by L1Address
    const account = await getAccount();
    if (!account || account.code !== 100) {
      await checkAccount();
    } else {
      const l1Balance = getBalanceByAccount(account);
      console.log('l1 balance', l1Balance);
      if (Number(l1Balance) < 0.001) {
        await checkAccount();
      } else if (account.status === 0) {
        // activate account
        await activateAccount();
      } else {
        setActivated(true);
      }
    }
  }

  //=================================================================
  //                           Timed tasks
  //=================================================================
  /**
   * Get account by interval
   */
  async function updateAccountByInterval() {
    const account = await getAccount();
    if (account && Array.isArray(account.assets)) {
      const l2Balance = getBalanceByAccount(account);
      console.log('updateAccountByInterval l2 balance', l2Balance);
      setL2Balance(l2Balance);
    }
    setTimeout(updateAccountByInterval, 3000);
  }

  /**
   * Check the account information on L2
   */
  async function checkAccount() {
    alert('Please bridge some BNB to your account fist and wait a few minutes.');
    setTab('bridge');
    // query account by interval
    const interval = setInterval(async () => {
      const account = await getAccount();
      if (account && account.status === 0) {
        clearInterval(interval);
        // activate account
        await activateAccount();
      }
    }, 1000);
  }

  /**
   * Activate L2 account
   * If unsuccessful then perform timed activation
   */
  async function activateAccount() {
    // query account status
    // if there is no balance, bridge first
    await L2Client.getInstance().activateAccount();
    // query account by interval
    const interval = setInterval(async () => {
      const account = await getAccount();
      if (account && account.status === 1) {
        clearInterval(interval);
        setActivated(true);
        alert('Account activated!');
      }
    }, 1000);
  }

  //=================================================================
  //                      Common function
  //=================================================================

  /**
   * Query account
   */
  async function getAccount() {
    return L2Client.getInstance().getAccount();
  }

  /**
   * Check the corresponding bnb balance by account
   * @param account Pending account inquiries
   */
  function getBalanceByAccount(account: Account): string {
    let balance = '0';

    if (account && Array.isArray(account.assets)) {
      const bnb = account.assets.find((asset: { name: string }) => asset.name === 'BNB');
      balance = (bnb && bnb.balance) ? ethers.utils.formatEther(bnb.balance) : balance;
    }

    return balance;
  }

  function handleTabs() {
    if (walletAddress) {
      switch (tab) {
        case 'marketplace':
          if (walletAddress === '-') return <div>Connect wallet</div>;
          return <Marketplace zkWallet={zkWallet} l2Client={l2Client} walletAddress={walletAddress}/>;
        case 'bridge':
        default:
          if (walletAddress === '-') return <div>Connect wallet</div>;
          return <Bridge zkWallet={zkWallet} l2Client={l2Client} walletAddress={walletAddress}/>;
      }
    }
    return null;
  }

  const items: TabsProps['items'] = [
    {
      key: 'bridge',
      label: `Bridge`,
      children: <Bridge zkWallet={zkWallet} l2Client={l2Client} walletAddress={walletAddress}/>,
    },
    {
      key: 'marketplace',
      label: `Marketplace`,
      children: <Marketplace zkWallet={zkWallet} l2Client={l2Client} walletAddress={walletAddress}/>,
    },
  ];

  return (
    <div className="App">
      {walletAddress === '-' ? <button onClick={setup}>Connect wallet</button> :
        <Descriptions title="Base Info" layout="vertical">
          <Descriptions.Item label="Active wallet address:">{walletAddress}</Descriptions.Item>
          <Descriptions.Item label="BNB L1 Balance (in wei):">{l1Balance}</Descriptions.Item>
          <Descriptions.Item label="BNB L2 Balance (in wei):">{l2Balance}</Descriptions.Item>
        </Descriptions>
      }

      {isConnected ? <Tabs defaultActiveKey="bridge" items={items}/> : <div>Please link your wallet first</div>}

    </div>
  );
};

export default App;
