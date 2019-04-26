import { BigNumber } from "ethers/utils";
import WalletConnect from "@walletconnect/browser";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";

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

export default class WalletConnectWallet {
  private _bridge: string;
  private _connector: WalletConnect;

  constructor(opts) {
    this._bridge = opts.bridge || "https://bridge.walletconnect.org";
  }

  public static WALLET_TYPE = "WalletConnect Wallet";
  public static accountID = "WALLETCONNECT";

  public NeedUnlockWalletError = new Error(
    "WalletConnect session not established"
  );

  public NotSupportedError = new Error("Current Wallet Not Supported");

  public signMessage(message: string, address: string): Promise<string> | null {
    return new Promise((resolve, reject) => {
      if (!this._connector && !this._connector.connected) {
        reject(this.NeedUnlockWalletError);
        return;
      }
      this._connector
        .signMessage([address, message])
        .then((signature: string) => resolve(signature))
        .catch((error: Error) => reject(error));
    });
  }

  public signPersonalMessage(
    message: string | Uint8Array,
    address: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this._connector && !this._connector.connected) {
        reject(new Error("WalletConnect session not estabslished"));
        return;
      }
      this._connector
        .signPersonalMessage([address, message])
        .then((signature: string) => resolve(signature))
        .catch((error: Error) => reject(error));
    });
  }

  public sendTransaction(txParams: txParams): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      if (!this._connector && !this._connector.connected) {
        reject(this.NeedUnlockWalletError);
        return;
      }
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

  public signTransaction(txParams: txParams): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      if (!this._connector && !this._connector.connected) {
        reject(this.NeedUnlockWalletError);
        return;
      }
      this._connector
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
      if (!this._connector && !this._connector.connected) {
        reject(this.NeedUnlockWalletError);
        return;
      }
      this._connector
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
      if (!this._connector && !this._connector.connected) {
        reject(this.NeedUnlockWalletError);
        return;
      }
      resolve(this._connector.accounts);
    });
  }

  public loadNetworkId(): Promise<number | undefined> {
    return new Promise((resolve, reject) => resolve(0));
  }

  public unlock(): void {
    this._connector = new WalletConnect({ bridge: this._bridge });

    if (!this._connector.connected) {
      this._connector.createSession().then(() => {
        WalletConnectQRCodeModal.open(this._connector.uri, () => {
          console.log("QR Code Modal closed");
        });
      });
    }

    this._connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      WalletConnectQRCodeModal.close();
    });
  }

  public isLocked(): boolean {
    return this._connector || this._connector.connected;
  }

  public static getAccountID(): string {
    return this.accountID;
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

  // TODO: loadBalance and getTransactionReceipt

  public loadBalance(address: string): Promise<any> {
    return new Promise((resolve, reject) => resolve(0));
  }

  public getTransactionReceipt(txId: string): Promise<any> {
    return new Promise((resolve, reject) => resolve(0));
  }
}
