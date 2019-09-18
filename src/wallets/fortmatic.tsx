import BaseWallet, { txParams } from "./baseWallet";
// @ts-ignore
import FortmaticClass from "fortmatic";
import { globalNodeUrl } from ".";

export default class Fortmatic extends BaseWallet {
  public static LABEL = "Fortmatic";
  public static TYPE = "FORTMATIC";
  public provider?: any;
  public fortmatic: any;
  public address?: string;

  public constructor(apiKey: string) {
    super();
    let network;
    if (globalNodeUrl.includes("ropsten")) {
      network = "ropsten";
    } else if (globalNodeUrl.includes("kovan")) {
      network = "kovan";
    }
    this.fortmatic = new FortmaticClass(apiKey, network);
  }

  public type(): string {
    return Fortmatic.TYPE;
  }

  public id(): string {
    return Fortmatic.TYPE;
  }

  public async clearSession() {
    return await this.fortmatic.user.logout();
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
      if (!this.provider) {
        return reject(BaseWallet.NotSupportedError);
      }
      this.provider.sendAsync([{ method, params }], (err: Error | null, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res[0]);
        }
      });
    });
  }

  public getAddresses(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      resolve([this.provider.account]);
    });
  }

  public async enable(): Promise<void> {
    if (!this.fortmatic) {
      return;
    }
    this.provider = this.fortmatic.getProvider();
    await this.provider.enable();
  }

  public isLocked(address: string | null): boolean {
    return !address;
  }

  public isSupported(): boolean {
    return !!this.provider && this.provider.isLoggedIn;
  }

  public name(): string {
    return "Fortmatic";
  }
}
