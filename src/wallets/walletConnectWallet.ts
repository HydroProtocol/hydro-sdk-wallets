import WalletConnect from "@walletconnect/browser";

export interface WalletConnectWalletOptions {
  bridge: string;
}

export interface txParams {
  from?: string;
  to: string;
  data?: string;
  value?: number | string | BigNumber;
  gasPrice?: number | BigNumber;
  gasLimit?: number;
}

import { BigNumber } from "ethers/utils";

export default class WalletConnectWallet {
  private _connector: WalletConnect;

  public static WALLET_TYPE = "WalletConnect Wallet";
  public static accountID = "WALLETCONNECT";

  constructor(opts: WalletConnectWalletOptions) {
    const bridge = opts.bridge || "https://bridge.walletconnect.org";
    this._connector = new WalletConnect({ bridge });
  }
  public static NeedUnlockWalletError = new Error("Need Unlock Wallet");

  public static NotSupportedError = new Error("Current Wallet Not Supported");

  public signMessage(message: string, address: string): Promise<string> | null {
    return new Promise((resolve, reject) => {
      this._connector
        .signMessage([address, message])
        .then((signature: string) => resolve(signature))
        .catch((error: Error) => reject(error));
    });
  }

  public personalSignMessage(
    message: string | Uint8Array,
    address: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this._connector
        .signPersonalMessage([address, message])
        .then((signature: string) => resolve(signature))
        .catch((error: Error) => reject(error));
    });
  }

  public sendTransaction(txParams: txParams): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      this._connector
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

  public getAddresses(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      resolve(this._connector.accounts);
    });
  }

  public static unlock(password: string): void {}

  public static isLocked(address: string | null): boolean {
    return false;
  }

  public static loadNetworkId(): Promise<number | undefined> {
    return new Promise((resolve, reject) => resolve(0));
  }

  public static loadBalance(address: string): Promise<any> {
    return new Promise((resolve, reject) => resolve(0));
  }

  public static getAccountID(): string {
    return this.accountID;
  }

  public static isSupported(): boolean {
    return false;
  }

  public static getTransactionReceipt(txId: string): Promise<any> {
    return new Promise((resolve, reject) => resolve(0));
  }
}
