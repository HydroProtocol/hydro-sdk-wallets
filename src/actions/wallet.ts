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

const setTimer = (type: string, timerKey: string, nextTimer: number) => {
  if (!timers[type]) {
    timers[type] = {};
  }

  timers[type][timerKey] = nextTimer;
};

const clearTimer = (type: string) => {
  if (timers[type]) {
    Object.values(timers[type]).forEach(window.clearTimeout);
    timers[type] = {};
  }
};

export const initAccount = (type: string, wallet: Wallet) => {
  return {
    type: "HYDRO_WALLET_INIT_ACCOUNT",
    payload: {
      type,
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

export const loadAddress = (type: string, address: string | null) => {
  return {
    type: "HYDRO_WALLET_LOAD_ADDRESS",
    payload: { type, address }
  };
};

export const loadBalance = (type: string, balance: BigNumber) => {
  return {
    type: "HYDRO_WALLET_LOAD_BALANCE",
    payload: { type, balance }
  };
};

export const loadNetwork = (type: string, networkId: number | undefined) => {
  return {
    type: "HYDRO_WALLET_LOAD_NETWORK",
    payload: {
      type,
      networkId
    }
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

export const unlockHydroWallet = (type: string, password: string) => {
  return async (dispatch: any, getState: any) => {
    const hydroWallet = getWallet(getState(), type);
    if (hydroWallet) {
      await hydroWallet.unlock(password);
      dispatch(updateWallet(hydroWallet));
      dispatch(unlockAccount(type));
    }
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

export const stopWatchers = (type: string) => {
  return (dispatch: any, getState: any) => {
    const account = getAccount(getState(), type);

    if (account) {
      clearTimer(type);
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
    const type = wallet.getType();
    if (!getAccount(getState(), type)) {
      dispatch(initAccount(type, wallet));
    }

    const watchAddress = async (timer = 0) => {
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
        type,
        "isLocked"
      ]);

      if (walletIsLocked !== walletStoreLocked) {
        dispatch(walletIsLocked ? lockAccount(type) : unlockAccount(type));
      }

      const currentAddressInStore = getState().WalletReducer.getIn([
        "accounts",
        type,
        "address"
      ]);

      if (currentAddressInStore !== address) {
        dispatch(loadAddress(type, address));
      }

      const nextTimer = window.setTimeout(() => watchAddress(nextTimer), 3000);
      setTimer(type, timerKey, nextTimer);
    };

    const watchBalance = async (timer = 0) => {
      const timerKey = TIMER_KEYS.BALANCE;

      const address = getState().WalletReducer.getIn([
        "accounts",
        type,
        "address"
      ]);
      if (address) {
        try {
          const balance = await wallet.loadBalance(address);
          const balanceInStore = getState().WalletReducer.getIn([
            "accounts",
            type,
            "balance"
          ]);

          if (balance.toString() !== balanceInStore.toString()) {
            dispatch(loadBalance(type, balance));
          }
        } catch (e) {
          if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
            throw e;
          }
        }
      }
      const nextTimer = window.setTimeout(() => watchBalance(nextTimer), 3000);
      setTimer(type, timerKey, nextTimer);
    };

    const watchNetwork = async (timer = 0) => {
      const timerKey = TIMER_KEYS.NETWORK;

      try {
        const networkId = await wallet.loadNetworkId();
        if (
          networkId &&
          networkId !==
            getState().WalletReducer.getIn(["accounts", type, "networkId"])
        ) {
          dispatch(loadNetwork(type, networkId));
        }
      } catch (e) {
        if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
          throw e;
        }
      }
      const nextTimer = window.setTimeout(() => watchNetwork(nextTimer), 3000);
      setTimer(type, timerKey, nextTimer);
    };

    Promise.all([watchAddress(), watchBalance(), watchNetwork()]);
  };
};
