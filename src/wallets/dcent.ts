import { BaseWallet, getNetworkID, sendRawTransaction, getTransactionCount } from ".";
import { txParams } from "./baseWallet";
import AwaitLock from "await-lock";
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
  public connected: boolean = false;

  public constructor(dcent: any) {
    super();
    this.dcent = dcent;
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
      const res = await this.dcent.getEthereumSignedMessage(message, this.PATH);
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
      // const tx = new EthereumTx(txParams);

      // // Set the EIP155 bits
      // tx.raw[6] = Buffer.from([networkID]); // v
      // tx.raw[7] = Buffer.from([]); // r
      // tx.raw[8] = Buffer.from([]); // s

      // Pass hex-rlp to ledger for signing
      const res = await this.dcent.getEthereumSignedTransaction(
        this.dcent.coinType.ETHEREUM,
        txParams.nonce,
        txParams.gasPrice,
        txParams.gasLimit,
        txParams.to,
        txParams.value,
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
    try {
      await this.awaitLock.acquireAsync();
      const res = await this.dcent.getAddress(this.dcent.coinType.ETHEREUM, this.PATH);
      const address = res.body.parameter.address;
      this.connected = !!address;
      if (address) {
        return [address.toLowerCase()];
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
    return !this.connected;
  }

  public isLocked(): boolean {
    return !this.connected;
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
