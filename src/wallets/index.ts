import HydroWallet from "./hydroWallet";
import ExtensionWallet from "./extensionWallet";
import BaseWallet from "./baseWallet";

export type Wallet = HydroWallet | typeof ExtensionWallet;
const { NeedUnlockWalletError, NotSupportedError } = BaseWallet;
export {
  HydroWallet,
  ExtensionWallet,
  NeedUnlockWalletError,
  NotSupportedError
};

export const getWalletType = (accountID: string | null): string | null => {
  if (!accountID) {
    return null;
  } else if (accountID === ExtensionWallet.getAccountID()) {
    return ExtensionWallet.WALLET_TYPE;
  } else if (accountID.indexOf(HydroWallet.ACCOUNT_ID_PREFIX) > -1) {
    return HydroWallet.WALLET_TYPE;
  } else {
    return "Unknown Wallet";
  }
};

export const isHydroWallet = (accountID: string | null): boolean => {
  if (accountID) {
    return getWalletType(accountID) === HydroWallet.WALLET_TYPE;
  } else {
    return false;
  }
};

export const WalletTypes = [
  HydroWallet.WALLET_TYPE,
  ExtensionWallet.WALLET_TYPE
];
