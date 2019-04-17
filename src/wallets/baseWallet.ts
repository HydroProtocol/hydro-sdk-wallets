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

  public abstract signMessage(
    message: string,
    address: string
  ): Promise<string> | null;

  public abstract personalSignMessage(
    message: string,
    address: string
  ): Promise<string>;

  public abstract sendTransaction(
    txParams: txParams
  ): Promise<string | undefined>;

  public abstract getAddresses(): Promise<string[]>;

  public abstract loadBalance(address: string): Promise<any>;

  public abstract getType(): string;

  public abstract isSupported(): boolean;

  public abstract unlock(password: string): void;

  public abstract isLocked(address: string | null): boolean;

  public abstract getTransactionReceipt(txId: string): Promise<any>;

  public abstract loadNetworkId(): Promise<number | undefined>;
}
