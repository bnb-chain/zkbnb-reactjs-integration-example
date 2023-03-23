import { useEffect, useState } from 'react';
import { Wallet } from '@qingyang-id/zkbnb-l1-sdk';

interface InventoryProps {
  zkWallet: Wallet,
  wallet: string
}

const Inventory = ({zkWallet, wallet}: InventoryProps) => {
  const [inventory, setInventory] = useState(Object);
  // minting
  const [mintTokenId, setMintTokenId] = useState('');
  const [mintBlueprint, setMintBlueprint] = useState('');

  // buying and selling
  const [sellAmount, setSellAmount] = useState('');
  const [sellTokenId, setSellTokenId] = useState('');
  const [sellTokenAddress, setSellTokenAddress] = useState('');
  const [sellCancelOrder, setSellCancelOrder] = useState('');

  useEffect(() => {
    load()
  }, [])

  async function load(): Promise<void> {
  };

  // sell an asset
  async function sellNFT() {
  };

  // cancel sell order
  async function cancelSell() {
  };

  // the minting function should be on your backend
  async function mint() {
    /**
    //if you want to mint on a back end server you can also provide the private key of your wallet directly to the minter.
    //Please note: you should never share your private key and so ensure this is only done on a server that is not accessible from the internet
    const minterPrivateKey: string = process.env.REACT_APP_MINTER_PK ?? ''; // registered minter for your contract
    const minter = new ethers.Wallet(minterPrivateKey).connect(provider);
    **/
  };

  return (
    <div>
      <div>
        Mint NFT:
        <br/>
        <label>
          Token ID:
          <input type="text" value={mintTokenId} onChange={e => setMintTokenId(e.target.value)} />
        </label>
        <label>
          Blueprint:
          <input type="text" value={mintBlueprint} onChange={e => setMintBlueprint(e.target.value)} />
        </label>
        <button onClick={mint}>Mint</button>
      </div>
      <br/>
      <div>
        Sell asset (create sell order):
        <br/>
        <label>
          Amount (BNB):
          <input type="text" value={sellAmount} onChange={e => setSellAmount(e.target.value)} />
        </label>
        <label>
          Token ID:
          <input type="text" value={sellTokenId} onChange={e => setSellTokenId(e.target.value)} />
        </label>
        <label>
          Token Address:
          <input type="text" value={sellTokenAddress} onChange={e => setSellTokenAddress(e.target.value)} />
        </label>
        <button onClick={sellNFT}>Sell</button>
      </div>
      <br/>
      <div>
        Cancel sell order:
        <br/>
        <label>
          Order ID:
          <input type="text" value={sellCancelOrder} onChange={e => setSellCancelOrder(e.target.value)} />
        </label>
        <button onClick={cancelSell}>Cancel</button>
      </div>
      <br/><br/><br/>
      <div>
        Inventory:
        {JSON.stringify(inventory.result)}
      </div>
    </div>
  );
}

export default Inventory;
