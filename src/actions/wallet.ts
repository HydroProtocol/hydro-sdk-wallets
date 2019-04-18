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

export const setTimer = (type: string, timerKey: string, timer: number) => {
  return {
    type: "HYDRO_WALLET_SET_TIMER",
    payload: {
      type,
      timerKey,
      timer
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
    const hydroWallet = getWallet(getState().WalletReducer, type);
    if (hydroWallet) {
      await hydroWallet.unlock(password);
      dispatch(updateWallet(hydroWallet));
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
    const account = getAccount(getState().WalletReducer, type);
    if (account) {
      const timers = account.get("timers");
      timers.forEach(timer => {
        if (timer) {
          window.clearTimeout(timer);
        }
      });
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
    if (!getAccount(getState().WalletReducer, type)) {
      dispatch(initAccount(type, wallet));
    }

    const isInvalidTimer = (timerKey: string, timer: number) => {
      const timers = getState().WalletReducer.getIn([
        "accounts",
        type,
        "timers"
      ]);
      if (timer && timers.get(timerKey) && timer !== timers.get(timerKey)) {
        return true;
      } else {
        return false;
      }
    };

    const watchAddress = async (timer = 0) => {
      const timerKey = TIMER_KEYS.ADDRESS;
      if (isInvalidTimer(timerKey, timer)) {
        return;
      }

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

      if (wallet.isLocked(address)) {
        dispatch(lockAccount(type));
      } else {
        dispatch(unlockAccount(type));
      }

      dispatch(loadAddress(type, address));
      const nextTimer = window.setTimeout(() => watchAddress(nextTimer), 3000);
      dispatch(setTimer(type, timerKey, nextTimer));
    };

    const watchBalance = async (timer = 0) => {
      const timerKey = TIMER_KEYS.BALANCE;
      if (isInvalidTimer(timerKey, timer)) {
        return;
      }

      const address = getState().WalletReducer.getIn([
        "accounts",
        type,
        "address"
      ]);
      if (address) {
        try {
          const balance = await wallet.loadBalance(address);
          dispatch(loadBalance(type, balance));
        } catch (e) {
          if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
            throw e;
          }
        }
      }
      const nextTimer = window.setTimeout(() => watchBalance(nextTimer), 3000);
      dispatch(setTimer(type, timerKey, nextTimer));
    };

    const watchNetwork = async (timer = 0) => {
      const timerKey = TIMER_KEYS.NETWORK;
      if (isInvalidTimer(timerKey, timer)) {
        return;
      }

      try {
        const networkId = await wallet.loadNetworkId();
        dispatch(loadNetwork(type, networkId));
      } catch (e) {
        if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
          throw e;
        }
      }
      const nextTimer = window.setTimeout(() => watchNetwork(nextTimer), 3000);
      dispatch(setTimer(type, timerKey, nextTimer));
    };

    Promise.all([watchAddress(), watchBalance(), watchNetwork()]);
  };
};
