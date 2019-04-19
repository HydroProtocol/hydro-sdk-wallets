import { BigNumber } from "ethers/utils";
import { getAccount, getWallet } from "../selector/wallet";
import { Wallet } from "../wallets";
import {
  HydroWallet,
  ExtensionWallet,
  NeedUnlockWalletError,
  NotSupportedError
} from "../wallets";

const TIMER_KEYS = {
  ADDRESS: "ADDRESS",
  STATUS: "STATUS",
  BALANCE: "BALANCE",
  NETWORK: "NETWORK"
};

const timers: { [key: string]: { [key: string]: number } } = {};

const setTimer = (accountID: string, timerKey: string, nextTimer: number) => {
  if (!timers[accountID]) {
    timers[accountID] = {};
  }

  timers[accountID][timerKey] = nextTimer;
};

const clearTimer = (accountID: string) => {
  if (timers[accountID]) {
    Object.values(timers[accountID]).forEach(window.clearTimeout);
    timers[accountID] = {};
  }
};

export const initAccount = (accountID: string, wallet: Wallet) => {
  return {
    type: "HYDRO_WALLET_INIT_ACCOUNT",
    payload: {
      accountID,
      wallet
    }
  };
};

export const updateWallet = (wallet: Wallet) => {
  return {
    type: "HYDRO_WALLET_UPDATE_WALLET",
    payload: {
      wallet
    }
  };
};

export const loadAddress = (accountID: string, address: string | null) => {
  return {
    type: "HYDRO_WALLET_LOAD_ADDRESS",
    payload: { accountID, address }
  };
};

export const loadBalance = (accountID: string, balance: BigNumber) => {
  return {
    type: "HYDRO_WALLET_LOAD_BALANCE",
    payload: { accountID, balance }
  };
};

export const loadNetwork = (
  accountID: string,
  networkId: number | undefined
) => {
  return {
    type: "HYDRO_WALLET_LOAD_NETWORK",
    payload: {
      accountID,
      networkId
    }
  };
};

export const selectAccount = (accountID: string) => {
  return {
    type: "HYDRO_WALLET_SELECT_ACCOUNT",
    payload: { accountID }
  };
};

export const supportExtensionWallet = () => {
  return {
    type: "HYDRO_WALLET_SUPPORT_EXTENSION_WALLET"
  };
};

export const lockAccount = (accountID: string) => {
  return {
    type: "HYDRO_WALLET_LOCK_ACCOUNT",
    payload: { accountID }
  };
};

export const unlockAccount = (accountID: string) => {
  return {
    type: "HYDRO_WALLET_UNLOCK_ACCOUNT",
    payload: { accountID }
  };
};

export const unlockBrowserWalletAccount = (
  accountID: string,
  password: string
) => {
  return async (dispatch: any, getState: any) => {
    const hydroWallet = getWallet(getState(), accountID);
    if (hydroWallet) {
      await hydroWallet.unlock(password);
      dispatch(updateWallet(hydroWallet));
      dispatch(unlockAccount(accountID));
    }
  };
};

export const showWalletModal = () => {
  return {
    type: "HYDRO_WALLET_SHOW_DIALOG"
  };
};

export const hideWalletModal = () => {
  return {
    type: "HYDRO_WALLET_HIDE_DIALOG"
  };
};

export const stopWatchers = (accountID: string) => {
  return (dispatch: any, getState: any) => {
    const account = getAccount(getState(), accountID);

    if (account) {
      clearTimer(accountID);
    }
  };
};

export const loadExtensitonWallet = () => {
  return (dispatch: any) => {
    if (ExtensionWallet.isSupported()) {
      dispatch(supportExtensionWallet());
      dispatch(watchWallet(ExtensionWallet));
    }
  };
};

export const loadHydroWallets = () => {
  return (dispatch: any) => {
    HydroWallet.list().map(wallet => {
      dispatch(loadHydroWallet(wallet));
    });
  };
};

export const loadHydroWallet = (wallet: HydroWallet) => {
  return (dispatch: any) => {
    dispatch(watchWallet(wallet));
  };
};

const watchWallet = (wallet: Wallet) => {
  return (dispatch: any, getState: any) => {
    const accountID = wallet.getAccountID();
    if (!getAccount(getState(), accountID)) {
      dispatch(initAccount(accountID, wallet));
    }

    const watchAddress = async () => {
      const timerKey = TIMER_KEYS.ADDRESS;

      let address;
      try {
        const addresses: string[] = await wallet.getAddresses();
        address = addresses.length > 0 ? addresses[0].toLowerCase() : null;
      } catch (e) {
        if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
          throw e;
        }
        address = null;
      }

      const walletIsLocked = wallet.isLocked(address);
      const walletStoreLocked = getState().WalletReducer.getIn([
        "accounts",
        accountID,
        "isLocked"
      ]);

      if (walletIsLocked !== walletStoreLocked) {
        dispatch(
          walletIsLocked ? lockAccount(accountID) : unlockAccount(accountID)
        );
      }

      const currentAddressInStore = getState().WalletReducer.getIn([
        "accounts",
        accountID,
        "address"
      ]);

      if (currentAddressInStore !== address) {
        dispatch(loadAddress(accountID, address));
      }

      const nextTimer = window.setTimeout(() => watchAddress(), 3000);
      setTimer(accountID, timerKey, nextTimer);
    };

    const watchBalance = async () => {
      const timerKey = TIMER_KEYS.BALANCE;

      const address = getState().WalletReducer.getIn([
        "accounts",
        accountID,
        "address"
      ]);
      if (address) {
        try {
          const balance = await wallet.loadBalance(address);
          const balanceInStore = getState().WalletReducer.getIn([
            "accounts",
            accountID,
            "balance"
          ]);

          if (balance.toString() !== balanceInStore.toString()) {
            dispatch(loadBalance(accountID, balance));
          }
        } catch (e) {
          if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
            throw e;
          }
        }
      }
      const nextTimer = window.setTimeout(() => watchBalance(), 3000);
      setTimer(accountID, timerKey, nextTimer);
    };

    const watchNetwork = async () => {
      const timerKey = TIMER_KEYS.NETWORK;

      try {
        const networkId = await wallet.loadNetworkId();
        if (
          networkId &&
          networkId !==
            getState().WalletReducer.getIn(["accounts", accountID, "networkId"])
        ) {
          dispatch(loadNetwork(accountID, networkId));
        }
      } catch (e) {
        if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
          throw e;
        }
      }
      const nextTimer = window.setTimeout(() => watchNetwork(), 3000);
      setTimer(accountID, timerKey, nextTimer);
    };

    Promise.all([watchAddress(), watchBalance(), watchNetwork()]);
  };
};
