import { BigNumber } from "ethers/utils";
import { getBalance } from "..";
import { payloadId } from "@walletconnect/utils";

export interface txParams {
  from?: string;
  to: string;
  data?: string;
  value?: number | string | BigNumber;
  gasPrice?: number | string | BigNumber;
  gasLimit?: number | string | BigNumber;
  gas?: string | BigNumber;
  nonce?: number | string;
  chainId?: number;
}

export default abstract class BaseWallet {
  public static LABEL = "Wallet";
  public static TYPE = "WALLET";
  public ethereum: any;
  public static NeedUnlockWalletError = new Error("Need Unlock Wallet");
  public static NotSupportedError = new Error("Current Wallet Not Supported");

  public signMessage(message: string): Promise<string> | null {
    return this.signPersonalMessage(message);
  }

  public signPersonalMessage(message: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(BaseWallet.NotSupportedError);
      }
      if (message.slice(0, 2) !== "0x") {
        message = "0x" + Buffer.from(message).toString("hex");
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

  public formatTxParams(txParams: txParams): txParams {
    if (txParams.gasLimit) {
      const gasLimit = this.formatHex(txParams.gasLimit);
      txParams.gas = gasLimit;
      txParams.gasLimit = gasLimit;
    }
    if (txParams.gasPrice) {
      txParams.gasPrice = this.formatHex(txParams.gasPrice);
    }
    if (txParams.value) {
      txParams.value = this.formatHex(txParams.value);
    }
    if (txParams.nonce || txParams.nonce === 0) {
      txParams.nonce = this.formatHex(txParams.nonce);
    }
    return txParams;
  }

  public formatHex(str: string | number | BigNumber): string {
    return "0x" + str.toString(16).replace("0x", "");
  }

  public type(): string {
    return BaseWallet.TYPE;
  }

  public id(): string {
    return BaseWallet.TYPE;
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

  public isLocked(address: string | null): boolean {
    return !address;
  }

  public isSupported(): boolean {
    return !!this.ethereum;
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

  public sendCustomRequest(method: string, params?: any): Promise<any> {
    return new Promise(async resolve => {
      if (!this.isSupported()) {
        resolve({ error: BaseWallet.NotSupportedError });
      }
      this.ethereum.sendAsync({ jsonrpc: "2.0", id: payloadId(), method, params }, (error: Error, res: any) => {
        if (error) {
          resolve({ error });
        } else {
          resolve(res);
        }
      });
    });
  }

  public getBalance(address: string): Promise<BigNumber> {
    return getBalance(address);
  }

  public async enable(): Promise<void> {
    if (window.ethereum) {
      this.ethereum = window.ethereum;
      await this.ethereum.enable();
    } else if (window.web3) {
      this.ethereum = window.web3.currentProvider;
    }
  }

  public name(): string {
    if (!this.isSupported()) {
      return "";
    }
    if (this.ethereum.isMetaMask) {
      return "MetaMask Wallet";
    } else if (this.ethereum.isCipher) {
      return "Coinbase Wallet";
    } else if (this.ethereum.isTrust) {
      return "Trust Wallet";
    } else if (this.ethereum.isToshi) {
      return "Coinbase Wallet";
    } else if (this.ethereum.isImtoken) {
      return "ImToken Wallet";
    } else {
      return "Wallet";
    }
  }

  public clearSession() {}
}
