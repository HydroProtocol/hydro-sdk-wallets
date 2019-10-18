export interface txParams {
  from?: string;
  to: string;
  data?: string;
  value?: number | string | BigNumber;
  gasPrice?: number | string | BigNumber;
  gasLimit?: number | string | BigNumber;
  gas?: number | string | BigNumber;
  nonce?: number | string;
  chainId?: number;
}

import { BigNumber } from "ethers/utils";
import { getBalance } from "..";

export default abstract class baseWallet {
  public static NeedUnlockWalletError = new Error("Need Unlock Wallet");

  public static NotSupportedError = new Error("Current Wallet Not Supported");

  public abstract signMessage(message: string): Promise<string> | null;

  public async signPersonalMessage(message: string | Uint8Array): Promise<string> {
    return "";
  }

  public async sendTransaction(txParams: txParams): Promise<string | undefined> {
    return;
  }

  public abstract type(): string;

  public abstract id(): string;

  public async getAddresses(): Promise<string[]> {
    return [];
  }

  public abstract isSupported(): boolean;

  public abstract isLocked(address: string | null): boolean;

  public abstract loadNetworkId(): Promise<number | undefined>;

  public abstract sendCustomRequest(method: string, params: any): Promise<any>;

  public getBalance(address: string): Promise<BigNumber> {
    return getBalance(address);
  }

  public abstract name(): string;

  public clearSession() {}

  public formatHex(str: string | number | BigNumber): string {
    return "0x" + str.toString(16).replace("0x", "");
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
}
