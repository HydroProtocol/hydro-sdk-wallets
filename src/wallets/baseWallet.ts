export interface txParams {
  from?: string;
  to: string;
  data?: string;
  value?: number | string | BigNumber;
  gasPrice?: number | BigNumber;
  gasLimit?: number;
}

import { BigNumber } from "ethers/utils";

export default abstract class baseWallet {
  public static NeedUnlockWalletError = new Error("Need Unlock Wallet");

  public static NotSupportedError = new Error("Current Wallet Not Supported");

  public abstract signMessage(message: string): Promise<string> | null;

  public abstract personalSignMessage(message: string): Promise<string>;

  public abstract sendTransaction(
    txParams: txParams
  ): Promise<string | undefined>;

  public abstract getAccounts(): Promise<string[]>;

  public abstract isLocked(): boolean;

  public abstract loadBalance(): Promise<any>;

  public abstract setAddress(address: string | null): void;

  public abstract getType(): string;

  public abstract getAddress(): string | null;

  public abstract getBalance(): BigNumber;

  public abstract isSupported(): boolean;

  public abstract unlock(password: string): void;

  public abstract getTransactionReceipt(txId: string): Promise<any>;
}
