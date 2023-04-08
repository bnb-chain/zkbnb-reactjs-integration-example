import { Client } from '@bnb-chain/zkbnb-js-sdk';
import { Wallet } from '@bnb-chain/zkbnb-js-l1-sdk';
import { ZkCrypto } from '@bnb-chain/zkbnb-js-sdk/zkCrypto/web';
import { ethers } from 'ethers';

export enum TxType {
  Empty = 0,
  ChangePubKey,
  Deposit,
  DepositNFT,
  Transfer,
  Withdraw,
  CreateCollection,
  MintNFT,
  TransferNFT,
  AtomicMatch,
  CancelOffer,
  WithdrawNft,
  FullExit,
  FullExitNFT,
  Offer,
  UpdateNFT,
}

export default class L2Client {
  static instance: L2Client;
  private zkCrypto: any;
  private seed = '';
  private l1Wallet: any;
  private l1Address = '';
  private client: any;

  async init(l1Wallet: Wallet, network: string) {
    if (this.l1Wallet) {
      return;
    }
    this.l1Wallet = l1Wallet;
    this.seed = await this.getSeed(); // you can save in local storage
    this.l1Address = await this.l1Wallet.address();
    this.zkCrypto = await ZkCrypto();
    if (network === 'bsc') {
      this.client = new Client('https://api.zkbnbchain.org');
    } else if (network === 'bscTestnet') {
      this.client = new Client('https://api-testnet.zkbnbchain.org');
    } else {
      throw new Error(`BSC network ${network} is not supported`);
    }
  }

  isInit() {
    if (!this.l1Wallet) {
      throw new Error('L2Client is not initialized');
    }
  }

  /**
   * Get ZK instance (Lazy singleton pattern)
   * @returns {L2Client}
   */
  static getInstance(): L2Client {
    if (!L2Client.instance) {
      L2Client.instance = new L2Client();
    }
    return L2Client.instance;
  }

  async getSeed(): Promise<string> {
    this.isInit();
    if (!this.seed) {
      let chainID = 1;
      if (this.l1Wallet.ethSigner()) {
        const network: any = await this.l1Wallet.ethSigner().provider.getNetwork();
        chainID = network.chainId;
      }

      let message = 'Access zkbnb account.\n\nOnly sign this message for a trusted client!';
      if (chainID !== 1) {
        message += `\nChain ID: ${chainID}.`;
      }
      const result: any = await this.l1Wallet.ethMessageSigner().getEthMessageSignature(message);
      this.seed = result.signature;
    }
    return this.seed.substring(2);
  }

  /**
   * Get public key from seed
   * @param seed
   */
  async getPublicKey(seed: string) {
    const publicKey = this.zkCrypto.getEddsaPublicKey(seed);
    const compressedPublicKey = this.zkCrypto.getEddsaCompressedPublicKey(seed);

    const x = `0x${publicKey.slice(0, 64)}`;
    const y = `0x${publicKey.slice(64)}`;

    return {
      publicKey,
      compressedPublicKey,
      x,
      y,
    };
  }

  async getAccount() {
    this.isInit();
    const account = await this.client.getAccountByL1Address(this.l1Address);
    console.log(account);
    return account;
  }

  async submitTx(txType: TxType, txInfo: any) {
    const { index: accountIndex } = await this.client.getAccountByL1Address(this.l1Address);
    const { nonce } = await this.client.getNextNonce(accountIndex);
    const gasAccount = await this.client.getGasAccount();
    const pubKey = await this.getPublicKey(this.seed);
    const gasFee = await this.client.getGasFee({ assetId: 0, txType });

    const tx = {
      ...txInfo,
      pub_key: pubKey.compressedPublicKey,
      gas_account_index: gasAccount.index,
      gas_fee_asset_id: 0, // BNB: 0
      gas_fee_asset_amount: gasFee?.gas_fee,
      expired_at: Math.floor(new Date().getTime()) + 7200000,
      nonce,
    };
    console.log(tx, 'tx', txType);
    let transaction = '';
    switch (txType) {
      case TxType.ChangePubKey:
        transaction = await this.zkCrypto.signChangePubKey(this.seed, JSON.stringify(tx));
        break;
      case TxType.Withdraw:
        transaction = await this.zkCrypto.signWithdraw(this.seed, JSON.stringify(tx));
        break;
      case TxType.WithdrawNft:
        transaction = await this.zkCrypto.signWithdrawNft(this.seed, JSON.stringify(tx));
        break;
      default: {
        throw new Error(`TxType ${txType} is not supported`);
      }
    }
    const txMessage = await this.client.getSignatureMessage({ txType, txInfo: transaction } as any);
    const l1Sig = await this.l1Wallet.ethMessageSigner().getEthMessageSignature(txMessage);
    const transactionObj = JSON.parse(transaction);
    transactionObj.L1Sig = l1Sig.signature;

    await this.client.sendRawTx({ txType, txInfo: JSON.stringify(transactionObj) });
  }

  async activateAccount() {
    this.isInit();
    const { index: accountIndex } = await this.client.getAccountByL1Address(this.l1Address);
    const tx = {
      account_index: accountIndex,
      l1_address: this.l1Address,
    };
    await this.submitTx(TxType.ChangePubKey, tx);
  }

  async withdraw(amount: string, assetId: number, toAddress: string) {
    this.isInit();
    const parseAmount = ethers.utils.parseEther(amount).toString();
    const { index: accountIndex } = await this.client.getAccountByL1Address(this.l1Address);
    console.log('accountIndex', accountIndex, this.l1Address, amount, assetId, toAddress, parseAmount);
    const tx = {
      from_account_index: accountIndex,
      asset_id: assetId,
      asset_amount: parseAmount,
      memo: 'withdraw memo',
      to_address: toAddress,
    };
    await this.submitTx(TxType.Withdraw, tx);
  }

  async withdrawNFT(nftId: number, toAddress: string) {
    this.isInit();
    const { index: accountIndex } = await this.client.getAccountByL1Address(this.l1Address);
    console.log('accountIndex', accountIndex, this.l1Address, nftId, toAddress);
    const tx = {
      account_index: accountIndex,
      nft_index: nftId,
      to_address: toAddress,
    };
    await this.submitTx(TxType.WithdrawNft, tx);
  }
}
