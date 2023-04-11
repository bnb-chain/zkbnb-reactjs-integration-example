import { useState } from 'react';
import { Wallet } from '@bnb-chain/zkbnb-js-l1-sdk';
import { ethers } from 'ethers';
import L2Client from './l2Client';

interface MarketplaceProps {
  zkWallet: Wallet;
  l2Client: L2Client;
  walletAddress: string;
}

const Marketplace = ({ zkWallet, l2Client, walletAddress }: MarketplaceProps) => {
  // create collection
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  // mint nft
  const [mintNftCollectionId, setMintNftCollectionId] = useState('');
  const [mintNftTo, setMintNftTo] = useState('');
  const [mintNftName, setMintNftName] = useState('');
  const [mintNftDescription, setMintNftDescription] = useState('');
  const [mintNftImageUri, setMintNftImageUri] = useState('');
  // transfer nft
  const [transferTokenId, setTransferTokenId] = useState('');
  const [transferNftTo, setTransferNftTo] = useState('');

  // create collection
  async function createCollection() {
    await l2Client.createCollection(collectionName, collectionDescription);
  }

  // mint nft
  async function mintNft() {
    await l2Client.mintNFT({
      nftCollectionId: Number(mintNftCollectionId),
      to: mintNftTo,
      metadata: JSON.stringify({
        name: mintNftName,
        description: mintNftDescription,
        image: mintNftImageUri,
      }),
    });
  }

  // transfer nft
  async function transferNft() {
    await l2Client.transferNFT(Number(transferTokenId), transferNftTo);
  }

  return (
    <div>
      <div>
        Create Collection:
        <br />
        <label>
          name:
          <input type="text" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
        </label>
        <label>
          description:
          <input type="text" value={collectionDescription} onChange={(e) => setCollectionDescription(e.target.value)} />
        </label>
        <button onClick={createCollection}>Create Collection</button>
      </div>
      <br />
      <br />
      <br />
      <div>
        Mint NFT:
        <br />
        <br />
        <label>
          To Address:
          <input type="text" value={mintNftTo} onChange={(e) => setMintNftTo(e.target.value)} />
        </label>
        <label>
          CollectionId:
          <input type="text" value={mintNftCollectionId} onChange={(e) => setMintNftCollectionId(e.target.value)} />
        </label>
        <br />
        <div>
          Metadata:
          <br />
          <label>
            name:
            <input type="text" value={mintNftName} onChange={(e) => setMintNftName(e.target.value)} />
          </label>
          <label>
            description:
            <input type="text" value={mintNftDescription} onChange={(e) => setMintNftDescription(e.target.value)} />
          </label>
          <label>
            image uri:
            <input type="text" value={mintNftImageUri} onChange={(e) => setMintNftImageUri(e.target.value)} />
          </label>
          <button onClick={mintNft}>Mint NFT</button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div>
        Transfer NFT In L2:
        <br />
        <label>
          Token ID:
          <input type="text" value={transferTokenId} onChange={(e) => setTransferTokenId(e.target.value)} />
        </label>
        <label>
          To Address:
          <input type="text" value={transferNftTo} onChange={(e) => setTransferNftTo(e.target.value)} />
        </label>
        <button onClick={transferNft}>Transfer NFT</button>
      </div>
    </div>
  );
};

export default Marketplace;
