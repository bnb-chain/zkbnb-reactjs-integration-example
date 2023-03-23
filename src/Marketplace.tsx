import { useEffect, useState } from 'react';
import { Wallet } from '@qingyang-id/zkbnb-l1-sdk';

interface MarketplaceProps {
  zkWallet: Wallet,
}

const Marketplace = ({zkWallet}: MarketplaceProps) => {
  const [marketplace, setMarketplace] = useState(Object);
  const [buyOrderId, setBuyOrderId] = useState('');

  useEffect(() => {
    load()
  }, [])

  async function load(): Promise<void> {
  };

  // buy an asset
  async function buyNFT() {
  };

  return (
    <div>
      <div>
        Buy asset:
        <br/>
        <label>
          Order ID:
          <input type="text" value={buyOrderId} onChange={e => setBuyOrderId(e.target.value)} />
        </label>
        <button onClick={buyNFT}>Buy</button>
      </div>
      <br/><br/><br/>
      <div>
        Marketplace (active sell orders):
        <br/>
        {JSON.stringify(marketplace.result)}
      </div>
    </div>
  );
}

export default Marketplace;
