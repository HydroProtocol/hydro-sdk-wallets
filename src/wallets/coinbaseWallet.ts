import BaseWallet, { txParams } from "./baseWallet";
import WalletLink, { WalletLinkProvider } from "walletlink";
import { globalNodeUrl } from ".";
import { payloadId } from "@walletconnect/utils";

export default class CoinbaseWallet extends BaseWallet {
  public static LABEL = "Coinbase Wallet";
  public static TYPE = "COINBASE_WALLET";
  public ethereum: WalletLinkProvider;

  public constructor(appName?: string, appLogoUrl?: string) {
    super();
    const walletLink = new WalletLink({ appName: appName || "Hydro", appLogoUrl: appLogoUrl || "" });
    this.ethereum = walletLink.makeWeb3Provider(globalNodeUrl);
  }

  public type(): string {
    return CoinbaseWallet.TYPE;
  }

  public id(): string {
    return CoinbaseWallet.TYPE;
  }

  public loadNetworkId(): Promise<number | undefined> {
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      const res = await this.sendCustomRequest("net_version");
      if (res.error) {
        reject(res.error);
      } else {
        resolve(Number(res.result));
      }
    });
  }

  public signMessage(message: string | Uint8Array): Promise<string> | null {
    return this.signPersonalMessage(message);
  }

  public signPersonalMessage(message: string | Uint8Array): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      const address = await this.getAddresses();
      const res = await this.sendCustomRequest("personal_sign", [message, address[0]]);
      if (res.error) {
        reject(res.error);
      } else {
        resolve(res.result);
      }
    });
  }

  public sendTransaction(txParams: txParams): Promise<string | undefined> {
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      const res = await this.sendCustomRequest("eth_sendTransaction", [txParams]);
      if (res.error) {
        reject(res.error);
      } else {
        resolve(res.result);
      }
    });
  }

  public sendCustomRequest(method: string, params?: any): Promise<any> {
    if (!params) {
      params = [];
    }
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      this.ethereum.sendAsync([{ jsonrpc: "2.0", id: payloadId(), method, params }], (err: Error | null, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res[0]);
        }
      });
    });
  }

  public getAddresses(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      const res = await this.sendCustomRequest("eth_accounts");
      resolve(res.result);
    });
  }

  public async enable(): Promise<void> {
    if (!this.ethereum) {
      return;
    }
    await this.ethereum.enable();
  }

  public isLocked(address: string | null): boolean {
    return !address;
  }

  public isSupported(): boolean {
    return !!this.ethereum && !!this.ethereum.isWalletLink;
  }

  public name(): string {
    return "CoinbaseWallet";
  }
}
