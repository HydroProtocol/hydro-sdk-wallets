export interface txParams {
  from?: string;
  to: string;
  data?: string;
  value?: number | string | BigNumber;
  gasPrice?: number | BigNumber;
  gasLimit?: number;
  nonce?: number;
}

import { BigNumber } from "ethers/utils";
import { getBalance } from "..";

export default abstract class baseWallet {
  public static NeedUnlockWalletError = new Error("Need Unlock Wallet");

  public static NotSupportedError = new Error("Current Wallet Not Supported");

  public abstract signMessage(message: string): Promise<string> | null;

  public abstract signPersonalMessage(message: string | Uint8Array): Promise<string>;

  public abstract sendTransaction(txParams: txParams): Promise<string | undefined>;

  public abstract type(): string;

  public abstract id(): string;

  public abstract getAddresses(): Promise<string[]>;

  public abstract isSupported(): boolean;

  public abstract isLocked(address: string | null): boolean;

  public abstract loadNetworkId(): Promise<number | undefined>;

  public abstract sendCustomRequest(method: string, params: any): Promise<any>;

  public getBalance(address: string): Promise<BigNumber> {
    return getBalance(address);
  }

  public abstract name(): string;
}
