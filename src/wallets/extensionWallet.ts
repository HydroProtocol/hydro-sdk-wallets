import BaseWallet, { txParams } from "./baseWallet";
declare global {
  interface Window {
    web3: any;
    ethereum?: any;
  }
}

export default class ExtensionWallet extends BaseWallet {
  public static LABEL = "Metamask Wallet";
  public static TYPE = "EXTENSION";

  public type(): string {
    return ExtensionWallet.TYPE;
  }

  public id(): string {
    return ExtensionWallet.TYPE;
  }
}
