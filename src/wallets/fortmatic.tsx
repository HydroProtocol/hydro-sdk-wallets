import BaseWallet, { txParams } from "./baseWallet";
// @ts-ignore
import FortmaticClass from "fortmatic";
import { globalNodeUrl } from ".";

export default class Fortmatic extends BaseWallet {
  public static LABEL = "Fortmatic";
  public static TYPE = "FORTMATIC";
  public fortmatic: any;

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

  public sendCustomRequest(method: string, params?: any): Promise<any> {
    if (!params) {
      params = [];
    }
    return new Promise(async resolve => {
      if (!this.ethereum) {
        return resolve({ error: BaseWallet.NotSupportedError });
      }
      this.ethereum.sendAsync([{ id: 1, method, params }], (error: Error | null, res: any) => {
        if (error) {
          resolve({ error });
        } else {
          resolve(res[0]);
        }
      });
    });
  }

  public async enable(): Promise<void> {
    if (!this.fortmatic) {
      return;
    }
    this.ethereum = this.fortmatic.getethereum();
    await this.ethereum.enable();
  }

  public name(): string {
    return "Fortmatic";
  }
}
