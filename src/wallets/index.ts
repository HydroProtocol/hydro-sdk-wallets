import HydroWallet from "./hydroWallet";
import ExtensionWallet from "./extensionWallet";
import BaseWallet from "./baseWallet";

const { NeedUnlockWalletError, NotSupportedError } = BaseWallet;
export {
  HydroWallet,
  ExtensionWallet,
  NeedUnlockWalletError,
  NotSupportedError
};

export const getWalletName = (type: string | null): string => {
  if (!type) {
    return "Unknown Wallet";
  } else if (type === ExtensionWallet.getType()) {
    return ExtensionWallet.WALLET_NAME;
  } else if (type.indexOf(HydroWallet.TYPE_PREFIX) > -1) {
    return HydroWallet.WALLET_NAME;
  } else {
    return "Unknown Wallet";
  }
};

export const isHydroWallet = (type: string | null): boolean => {
  if (type) {
    return getWalletName(type) === HydroWallet.WALLET_NAME;
  } else {
    return false;
  }
};

export const get64BytesString = (str: string) => {
  str = str.replace("0x", "");
  let prefix = "";
  const prefixLength = 64 - str.length;
  for (let i = 0; i < prefixLength; i++) {
    prefix += "0";
  }
  return `${prefix}${str}`;
};
