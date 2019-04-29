import HydroWallet from "./hydroWallet";
import ExtensionWallet from "./extensionWallet";
import BaseWallet from "./baseWallet";
import WalletConnectWallet from "./WalletConnectWallet";

const { NeedUnlockWalletError, NotSupportedError } = BaseWallet;
export {
  BaseWallet,
  HydroWallet,
  ExtensionWallet,
  NeedUnlockWalletError,
  NotSupportedError,
  WalletConnectWallet
};

export const truncateAddress = (address: string): string => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const WalletTypes = [
  HydroWallet.TYPE,
  ExtensionWallet.TYPE,
  WalletConnectWallet.TYPE
];
