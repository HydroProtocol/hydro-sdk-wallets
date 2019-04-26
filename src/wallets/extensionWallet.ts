import BaseWallet, { txParams } from "./baseWallet";
import { BigNumber } from "ethers/utils";
import { Contract } from "ethers";
declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

export default abstract class ExtensionWallet extends BaseWallet {
  public static WALLET_TYPE = "Extension Wallet";
  public static accountID = "EXTENSION";

  public static getAccountID(): string {
    return this.accountID;
  }

  public static loadNetworkId(): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
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

  public static getContract(contractAddress: string, abi: any): Contract {
    if (!this.isSupported()) {
      throw BaseWallet.NotSupportedError;
    }
    return window.web3.eth.contract(abi).at(contractAddress);
  }

  public static contractCall(
    contract: Contract,
    method: string,
    ...args: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      contract[method](...args, (err: Error, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public static signMessage(
    message: string | Uint8Array,
    address: string
  ): Promise<string> | null {
    return this.signPersonalMessage(message, address);
  }

  public static signPersonalMessage(
    message: string | Uint8Array,
    address: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      window.web3.personal.sign(
        window.web3.toHex(message),
        address,
        (err: Error, res: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }

  public static sendTransaction(
    txParams: txParams
  ): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
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

  public static getTransactionReceipt(txId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      window.web3.eth.getTransactionReceipt(txId, (err: Error, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public static sendCustomRequest(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }

      window.web3.currentProvider.sendAsync(
        { method, params },
        (err: Error, res: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.result);
          }
        }
      );
    });
  }

  public static getAddresses(): Promise<string[]> {
    return new Promise((resolve, reject) => {
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

  public static loadBalance(address: string): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      window.web3.eth.getBalance(address, (err: Error, res: BigNumber) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public static enableBrowserExtensionWallet(): void {
    if (!this.isSupported()) {
      throw BaseWallet.NotSupportedError;
    }

    if (!window.ethereum) {
      return;
    }

    window.ethereum.enable();
  }

  public static unlock(): void {}

  public static isLocked(address: string | null): boolean {
    return !address;
  }

  public static isSupported(): boolean {
    return !!window.web3;
  }
}
