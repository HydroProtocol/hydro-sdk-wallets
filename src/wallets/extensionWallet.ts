import BaseWallet, { txParams } from "./baseWallet";
declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

export default class ExtensionWallet extends BaseWallet {
  public static LABEL = "Extension Wallet";
  public static TYPE = "EXTENSION";

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
      window.web3.version.getNetwork((err: Error, networkId: number) => {
        if (err) {
          reject(err);
        } else {
          resolve(networkId);
        }
      });
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
      window.web3.personal.sign(window.web3.toHex(message), window.web3.eth.accounts[0], (err: Error, res: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public sendTransaction(txParams: txParams): Promise<string | undefined> {
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      window.web3.eth.sendTransaction(txParams, (err: Error, res: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public sendCustomRequest(method: string, params?: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      window.web3.currentProvider.sendAsync(
        { method, params, from: window.web3.eth.accounts[0] },
        (err: Error, res: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }

  public getAddresses(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      window.web3.eth.getAccounts((err: Error, accounts: string[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(accounts);
        }
      });
    });
  }

  public static async enableBrowserExtensionWallet(): Promise<void> {
    if (!window.ethereum) {
      return;
    }
    await window.ethereum.enable();
  }

  public isLocked(address: string | null): boolean {
    return !address;
  }

  public isSupported(): boolean {
    return !!window.web3;
  }

  public name(): string {
    if (!this.isSupported()) {
      return "";
    }
    const cp = window.web3.currentProvider;
    if (cp.isMetaMask) {
      return "MetaMask";
    } else if (cp.isCipher) {
      return "Cipher";
    } else if (cp.isTrust) {
      return "Trust";
    } else if (cp.isToshi) {
      return "Coinbase";
    } else {
      return "Extension Wallet";
    }
  }
}
