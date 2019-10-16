import BaseWallet, { txParams } from "./baseWallet";
import WalletLink from "walletlink";
import { globalNodeUrl } from ".";
import { payloadId } from "@walletconnect/utils";

export default class CoinbaseWallet extends BaseWallet {
  public static LABEL = "Coinbase Wallet";
  public static TYPE = "COINBASE_WALLET";
  public ethereum: any;

  public constructor(networkId: number, appName?: string, appLogoUrl?: string) {
    super();
    const walletLink = new WalletLink({ appName: appName || "Hydro", appLogoUrl: appLogoUrl || "" });
    this.ethereum = walletLink.makeWeb3Provider(globalNodeUrl, networkId);
  }

  public type(): string {
    return CoinbaseWallet.TYPE;
  }

  public id(): string {
    return CoinbaseWallet.TYPE;
  }

  public clearSession() {
    this.ethereum._relay.storage.clear();
  }

  public async enable(): Promise<void> {
    if (!this.ethereum) {
      return;
    }
    await this.ethereum.enable();
  }

  public name(): string {
    return "CoinbaseWallet";
  }
}
