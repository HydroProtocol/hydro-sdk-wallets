import BaseWallet, { txParams } from "./baseWallet";
//@ts-ignore
import TrezorConnect from "trezor-connect";
import { getNetworkID, getTransactionCount, sendRawTransaction } from ".";
import EthereumTx from "ethereumjs-tx";

export default class Trezor extends BaseWallet {
  public static LABEL = "Trezor Wallet";
  public static TYPE = "TREZOR";
  public static PATH_RULE = "m/44'/60'/x'/0/0";
  public currentBasePath: string = "";
  public currentIndex: number = 0;
  public connected: boolean = false;
  public addrsses: { [key: string]: string } = {};
  public perPage = 3;

  constructor() {
    super();
    //@ts-ignore
    TrezorConnect.manifest({
      email: "developer@xyz.com",
      appUrl: "http://your.application.com"
    });
    const selectedBasePath = window.localStorage.getItem("Trezor:lastSelectedBasePath") || Trezor.PATH_RULE;
    const selectedIndex = Number(window.localStorage.getItem("Trezor:lastSelectedIndex")) || 0;
    this.setPath(selectedBasePath, selectedIndex);
  }

  public type(): string {
    return Trezor.TYPE;
  }

  public id(): string {
    return Trezor.TYPE;
  }

  public setPath(basePath: string, index: number) {
    this.currentBasePath = basePath;
    this.currentIndex = index;
    window.localStorage.setItem("Ledger:lastSelectedBasePath", basePath);
    window.localStorage.setItem("Ledger:lastSelectedIndex", String(index));
  }

  public currentPath(): string {
    return this.currentBasePath.replace("x", this.currentIndex.toString());
  }

  public signMessage(message: string): Promise<string> | null {
    return this.signPersonalMessage(message);
  }

  public async signPersonalMessage(message: string): Promise<string> {
    try {
      if (message.slice(0, 2) === "0x") {
        message = message.slice(2);
      } else {
        message = Buffer.from(message).toString("hex");
      }

      const res = await TrezorConnect.ethereumSignMessage({ path: this.currentPath(), message, hex: true });
      if (res.success) {
        return "0x" + res.payload.signature;
      } else {
        throw new Error(res.payload.error);
      }
    } catch (e) {
      throw e;
    }
  }

  public async signTransaction(txParams: txParams): Promise<string> {
    try {
      const networkID = await this.loadNetworkId();
      if (!txParams.chainId) {
        txParams.chainId = networkID;
      }

      if (!txParams.nonce) {
        const currentAddress = await this.getAddresses();
        const nonce = await getTransactionCount(currentAddress[0], "pending");
        txParams.nonce = nonce;
      }
      txParams = this.formatTxParams(txParams);
      delete txParams.gas;
      const tx = new EthereumTx(txParams);
      tx.raw[6] = Buffer.from([networkID]); // v
      tx.raw[7] = Buffer.from([]); // r
      tx.raw[8] = Buffer.from([]); // s

      const res = await TrezorConnect.ethereumSignTransaction({ path: this.currentPath(), transaction: txParams });
      tx.v = Buffer.from(res.payload.v.substr(2), "hex");
      tx.r = Buffer.from(res.payload.r.substr(2), "hex");
      tx.s = Buffer.from(res.payload.s.substr(2), "hex");

      return `0x${tx.serialize().toString("hex")}`;
      // return `0x${res.payload.r.replace("0x", "")}${res.payload.s.replace("0x", "")}${res.payload.v.replace("0x", "")}`;
    } catch (e) {
      throw e;
    }
  }

  public async sendTransaction(txParams: txParams): Promise<string> {
    const rawData = await this.signTransaction(txParams);
    return sendRawTransaction(rawData);
  }

  public async getAddressesWithPath(basePath: string, from: number, count: number): Promise<any> {
    try {
      const bundle = [];
      for (let i = from; i < from + count; i++) {
        const path = this.getPath(basePath, i);
        bundle.push({ path, showOnTrezor: false });
      }
      const res = await TrezorConnect.ethereumGetAddress({ bundle });
      if (res.success) {
        this.connected = true;
        return res.payload.map((payload: any) => {
          let { serializedPath, address } = payload;
          address = address.toLowerCase();
          this.addrsses[serializedPath] = address;
          return address;
        });
      } else {
        throw new Error(res.payload.error);
      }
    } catch (e) {
      this.connected = false;
      throw e;
    }
  }

  public async getAddresses(): Promise<string[]> {
    const path = this.getPath(this.currentBasePath, this.currentIndex);
    if (this.addrsses[path]) {
      return [this.addrsses[path]];
    } else {
      const addresses = await this.getAddressesWithPath(
        this.currentBasePath,
        this.getPage(this.currentIndex),
        this.perPage
      );
      return [addresses[this.getPageIndex(this.currentIndex)]];
    }
  }

  public getPageIndex(index: number): number {
    return index % this.perPage;
  }

  public getPage(index: number): number {
    return Math.floor(index / this.perPage);
  }

  public getPath(basePath: string, index: number): string {
    return basePath.replace("x", index.toString());
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
    return "Trezor Wallet";
  }
}
