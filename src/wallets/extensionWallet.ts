import BaseWallet, { txParams } from "./baseWallet";
import { BigNumber } from "ethers/utils";
import { Contract } from "ethers";

export default abstract class ExtensionWallet extends BaseWallet {
  public static WALLET_NAME = "Extension Wallet";
  public static TYPE = "EXTENSION";
  public static _address: string | null = null;
  public static _balance: BigNumber = new BigNumber("0");

  public static setAddress(address: string | null): void {
    this._address = address;
  }

  public static setBalance(balance: BigNumber): void {
    this._balance = balance;
  }

  public static getType(): string {
    return this.TYPE;
  }

  public static getAddress(): string | null {
    return this._address;
  }

  public static getBalance(): BigNumber {
    return this._balance;
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

  public static signMessage(message: string): Promise<string> | null {
    return this.personalSignMessage(message);
  }

  public static personalSignMessage(message: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      if (!this._address) {
        reject(BaseWallet.NeedUnlockWalletError);
      }
      window.web3.personal.sign(
        message,
        this._address,
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
      if (!this._address) {
        reject(BaseWallet.NeedUnlockWalletError);
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
      if (!this._address) {
        reject(BaseWallet.NeedUnlockWalletError);
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

  public static getAccounts(): Promise<string[]> {
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

  public static loadBalance(): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      if (!this._address) {
        reject(BaseWallet.NeedUnlockWalletError);
      }
      window.web3.eth.getBalance(
        this._address,
        (err: Error, res: BigNumber) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }

  public static enableBrowserExtensionWallet(): void {
    if (!this.isSupported()) {
      throw BaseWallet.NotSupportedError;
    }

    if (!window.ethereum) {
      return;
    }

    window.ethereum.enable().then((accounts: string[]) => {
      if (accounts[0]) {
        this._address = accounts[0];
      }
    });
  }

  public static unlock(): void {}

  public static isLocked(): boolean {
    return !this._address;
  }

  public static isSupported(): boolean {
    return !!window.web3;
  }
}
