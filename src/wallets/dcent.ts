import { BaseWallet, getNetworkID, sendRawTransaction, getTransactionCount } from ".";
import { txParams } from "./baseWallet";
import AwaitLock from "await-lock";
import { BigNumber } from "ethers/utils";
import * as ethUtil from "ethereumjs-util";
declare global {
  interface Window {
    dcent: any;
  }
}
export default class Dcent extends BaseWallet {
  public static LABEL = "D'CENT";
  public static TYPE = "DCENT";
  private awaitLock = new AwaitLock();
  private PATH = "m/44'/60'/0'/0/0";
  public dcent: any;
  public address?: string;

  public constructor(dcent: any) {
    super();
    this.dcent = dcent;
  }

  public async reconnect() {
    await this.disconnect();
    // hack await disconnect
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        this.connect();
        resolve();
      }, 100);
    });
  }

  public async connect() {
    await this.dcent.dcentPopupWindow();
  }

  public async disconnect() {
    await this.dcent.popupWindowClose();
  }

  public type(): string {
    return Dcent.TYPE;
  }

  public id(): string {
    return Dcent.TYPE;
  }

  public signMessage(message: string): Promise<string> | null {
    return this.signPersonalMessage(message);
  }

  public async signPersonalMessage(message: string): Promise<string> {
    try {
      await this.awaitLock.acquireAsync();
      const res = await this.dcent.getEthereumSignedMessage(ethUtil.toBuffer(message), this.PATH);
      return res.body.parameter.sign;
    } catch (e) {
      throw e;
    } finally {
      this.awaitLock.release();
    }
  }

  public async signTransaction(txParams: txParams): Promise<string> {
    try {
      await this.awaitLock.acquireAsync();
      const networkID = await this.loadNetworkId();
      const nonce = typeof txParams.nonce === "number" ? new BigNumber(txParams.nonce).toString() : txParams.nonce;
      const gasPrice =
        typeof txParams.gasPrice === "number" ? new BigNumber(txParams.gasPrice).toString() : txParams.gasPrice;
      const gasLimit =
        typeof txParams.gasLimit === "number" ? new BigNumber(txParams.gasLimit).toString() : txParams.gasLimit;
      const res = await this.dcent.getEthereumSignedTransaction(
        this.dcent.coinType.ETHEREUM,
        nonce,
        gasPrice,
        gasLimit,
        txParams.to,
        new BigNumber(txParams.value as number).toString(),
        txParams.data,
        this.PATH,
        networkID
      );

      return `0x${res.body.parameter.signed}`;
    } catch (e) {
      throw e;
    } finally {
      this.awaitLock.release();
    }
  }

  public async sendTransaction(txParams: txParams): Promise<string> {
    if (!txParams.nonce) {
      const currentAddress = await this.getAddresses();
      const nonce = await getTransactionCount(currentAddress[0], "pending");
      txParams.nonce = nonce;
    }
    const rawData = await this.signTransaction(txParams);
    return sendRawTransaction(rawData);
  }

  public async getAddresses(): Promise<string[]> {
    if (this.address) {
      return [this.address];
    }

    try {
      await this.awaitLock.acquireAsync();
      const res = await this.dcent.getAddress(this.dcent.coinType.ETHEREUM, this.PATH);
      const address = res.body.parameter.address;
      this.address = address;
      if (address) {
        return [address];
      } else {
        return [];
      }
    } catch (e) {
      throw e;
    } finally {
      this.awaitLock.release();
    }
  }

  public isSupported(): boolean {
    return !this.address;
  }

  public isLocked(): boolean {
    return !this.address;
  }

  public async loadNetworkId(): Promise<number> {
    return getNetworkID();
  }

  public async sendCustomRequest(method: string, params: any): Promise<any> {
    return null;
  }

  public name(): string {
    return "Dcent";
  }
}
