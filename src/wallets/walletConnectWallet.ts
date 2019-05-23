import { BigNumber } from "ethers/utils";
import WalletConnect from "@walletconnect/browser";
import { BaseWallet } from ".";

export interface WalletConnectWalletOptions {
  bridge?: string;
}

export interface txParams {
  from?: string;
  to: string;
  data?: string;
  value?: number | string | BigNumber;
  gasPrice?: number | BigNumber;
  gasLimit?: number;
}

export default class WalletConnectWallet extends BaseWallet {
  public connector: WalletConnect;
  private _bridge: string;

  constructor(opts: { bridge: string }) {
    super();

    this._bridge = opts.bridge || "https://bridge.walletconnect.org";
    this.connector = new WalletConnect({ bridge: this._bridge });
  }

  public static LABEL = "WalletConnect";
  public static TYPE = "WALLETCONNECT";

  public NeedUnlockWalletError = new Error("WalletConnect session not established");

  public NotSupportedError = new Error("Current Wallet Not Supported");

  public signMessage(message: string): Promise<string> | null {
    return new Promise((resolve, reject) => {
      if (!this.connector.connected) {
        reject(this.NeedUnlockWalletError);
        return;
      }
      this.connector
        .signMessage([this.connector.accounts[0], message])
        .then((signature: string) => resolve(signature))
        .catch((error: Error) => reject(error));
    });
  }

  public signPersonalMessage(message: string | Uint8Array): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.connector.connected) {
        reject(new Error("WalletConnect session not estabslished"));
        return;
      }
      this.connector
        .signPersonalMessage([this.connector.accounts[0], message])
        .then((signature: string) => resolve(signature))
        .catch((error: Error) => reject(error));
    });
  }

  public sendTransaction(txParams: txParams): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.connector.connected) {
        reject(this.NeedUnlockWalletError);
        return;
      }
      this.connector
        .sendTransaction({
          from: txParams.from || "",
          to: txParams.to || "",
          data: txParams.data || "",
          value: new BigNumber(`${txParams.value}`).toString() || "",
          gasPrice: new BigNumber(`${txParams.gasPrice}`).toString() || "",
          gasLimit: new BigNumber(`${txParams.gasLimit}`).toString() || ""
        })
        .then((txHash: string) => resolve(txHash))
        .catch((error: Error) => reject(error));
    });
  }

  public signTransaction(txParams: txParams): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.connector.connected) {
        reject(this.NeedUnlockWalletError);
        return;
      }
      this.connector
        .signTransaction({
          from: txParams.from || "",
          to: txParams.to || "",
          data: txParams.data || "",
          value: new BigNumber(`${txParams.value}`).toString() || "",
          gasPrice: new BigNumber(`${txParams.gasPrice}`).toString() || "",
          gasLimit: new BigNumber(`${txParams.gasLimit}`).toString() || ""
        })
        .then((txHash: string) => resolve(txHash))
        .catch((error: Error) => reject(error));
    });
  }

  public sendCustomRequest(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.connector.connected) {
        reject(this.NeedUnlockWalletError);
        return;
      }
      this.connector
        .sendCustomRequest({
          method: method,
          params: params
        })
        .then((txHash: string) => resolve(txHash))
        .catch((error: Error) => reject(error));
    });
  }

  public getAddresses(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!this.connector.connected) {
        resolve([]);
      }
      resolve(this.connector.accounts);
    });
  }

  public loadNetworkId(): Promise<number | undefined> {
    return new Promise((resolve, reject) => resolve(this.connector.chainId));
  }

  public isLocked(): boolean {
    return !this.connector.connected;
  }

  public type(): string {
    return WalletConnectWallet.TYPE;
  }

  public id(): string {
    return WalletConnectWallet.TYPE;
  }

  public isSupported(): boolean {
    const isSupported =
      typeof window !== "undefined" &&
      typeof window.location !== "undefined" &&
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost";
    if (!isSupported) {
      throw this.NotSupportedError;
    }
    return isSupported;
  }

  public name(): string {
    return "WalletConnect";
  }
}
