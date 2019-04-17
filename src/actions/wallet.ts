import { BigNumber } from "ethers/utils";

export const loadAccount = (type: string, address: string | null) => {
  return {
    type: "HYDRO_WALLET_LOAD_ACCOUNT",
    payload: { type, address }
  };
};

export const loadBalance = (type: string, balance: BigNumber) => {
  return {
    type: "HYDRO_WALLET_LOAD_BALANCE",
    payload: { type, balance }
  };
};

export const selectAccount = (type: string) => {
  return {
    type: "HYDRO_WALLET_SELECT_ACCOUNT",
    payload: { type }
  };
};

export const supportExtensionWallet = () => {
  return {
    type: "HYDRO_WALLET_SUPPORT_EXTENSION_WALLET"
  };
};

export const lockAccount = (type: string) => {
  return {
    type: "HYDRO_WALLET_LOCK_ACCOUNT",
    payload: { type }
  };
};

export const unlockAccount = (type: string) => {
  return {
    type: "HYDRO_WALLET_UNLOCK_ACCOUNT",
    payload: { type }
  };
};

export const showDialog = () => {
  return {
    type: "HYDRO_WALLET_SHOW_DIALOG"
  };
};

export const hideDialog = () => {
  return {
    type: "HYDRO_WALLET_HIDE_DIALOG"
  };
};

export const loadExtensitonWallet = () => {
  // 检查有没有安装extension wallet
  // if yes
  //   dispatch(supportExtensionWallet)
};

export const loadBrowserWallets = () => {
  // load addresses from localStorage
  // if not blank?
  //   foreach dispatch(initAddress)
};

export const removeAddress = () => {
  // clear timer
};
