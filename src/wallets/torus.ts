import BaseWallet, { txParams } from "./baseWallet";
import TorusInstance from "@toruslabs/torus-embed";
import { globalNodeUrl } from ".";
import { getNetworkID } from ".";

export default class Torus extends BaseWallet {
  public static LABEL = "Torus";
  public static TYPE = "Torus";
  public provider?: any;
  public address?: string;
  public torus: TorusInstance;

  public constructor() {
    super();
    this.torus = new TorusInstance({});
  }

  public type(): string {
    return Torus.TYPE;
  }

  public id(): string {
    return Torus.TYPE;
  }

  public async clearSession() {
    return await this.torus.logout();
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
      txParams = this.formatTxParams(txParams);
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
    return new Promise(async resolve => {
      if (!this.provider) {
        return resolve({ error: BaseWallet.NotSupportedError });
      }
      this.provider.sendAsync([{ id: 1, method, params }], (error: Error | null, res: any) => {
        if (error) {
          resolve({ error });
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
      if (this.address) {
        resolve([this.address]);
      }
      const res = await this.sendCustomRequest("eth_accounts");
      if (res.error) {
        reject(res.error);
      } else {
        this.address = res.result[0];
        resolve(res.result);
      }
    });
  }

  public async enable(): Promise<void> {
    if (!this.torus) {
      return;
    }
    const networkId = await getNetworkID();
    let network;
    if (networkId === 3) {
      network = {
        host: "ropsten",
        chainId: 3,
        networkName: "Ropsten Test Network"
      };
    } else if (networkId === 42) {
      network = {
        host: "kovan",
        chainId: 42,
        networkName: "Kovan Test Network"
      };
    } else {
      network = {
        host: "mainnet",
        chainId: 1,
        networkName: "Main Ethereum Network"
      };
    }
    await this.torus.init({
      buildEnv: "production", // default: production
      enableLogging: false, // default: false
      network,
      showTorusButton: false // default: true
    });
    // @ts-ignore
    await this.torus.login(); // await torus.ethereum.enable()
    this.provider = this.torus.provider;
  }

  public isLocked(address: string | null): boolean {
    return !address;
  }

  public isSupported(): boolean {
    // @ts-ignore
    return !!this.provider && this.torus.isLoggedIn;
  }

  public name(): string {
    return "Torus";
  }
}
