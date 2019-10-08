import BaseWallet, { txParams } from "./baseWallet";
declare global {
  interface Window {
    web3: any;
    ethereum?: any;
  }
}

export default class ExtensionWallet extends BaseWallet {
  public static LABEL = "Extension Wallet";
  public static TYPE = "EXTENSION";
  public ethereum: any;

  public type(): string {
    return ExtensionWallet.TYPE;
  }

  public id(): string {
    return ExtensionWallet.TYPE;
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
      if (txParams.gasLimit) {
        txParams.gas = txParams.gasLimit.toString();
      }
      if (txParams.gasPrice) {
        txParams.gasPrice = txParams.gasPrice.toString();
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
    return new Promise(async resolve => {
      if (!this.isSupported()) {
        resolve({ error: BaseWallet.NotSupportedError });
      }
      this.ethereum.sendAsync({ method, params }, (error: Error, res: any) => {
        if (error) {
          resolve({ error });
        } else {
          resolve(res);
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
    if (window.ethereum) {
      this.ethereum = window.ethereum;
      await this.ethereum.enable();
    } else if (window.web3) {
      this.ethereum = window.web3.currentProvider;
    }
  }

  public isLocked(address: string | null): boolean {
    return !address;
  }

  public isSupported(): boolean {
    return !!this.ethereum;
  }

  public name(): string {
    if (!this.isSupported()) {
      return "";
    }
    if (this.ethereum.isMetaMask) {
      return "MetaMask";
    } else if (this.ethereum.isCipher) {
      return "Cipher";
    } else if (this.ethereum.isTrust) {
      return "Trust";
    } else if (this.ethereum.isToshi) {
      return "Coinbase";
    } else if (this.ethereum.isImtoken) {
      return "imToken";
    } else {
      return "Extension Wallet";
    }
  }
}
