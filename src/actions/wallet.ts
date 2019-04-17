import { BigNumber } from "ethers/utils";
import {
  HydroWallet,
  ExtensionWallet,
  NeedUnlockWalletError,
  NotSupportedError
} from "../wallets";
import { Map } from "immutable";

const watchers = Map();

export const loadAddress = (type: string, address: string | null) => {
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
  return (dispatch: any) => {
    dispatch(watchWallet(ExtensionWallet));
  };
};

export const loadBrowserWallets = () => {
  return (dispatch: any) => {
    HydroWallet.list().map(wallet => {
      dispatch(watchWallet(wallet));
    });
  };
};

const watchWallet = (wallet: HydroWallet | typeof ExtensionWallet) => {
  return (dispatch: any, getState: any) => {
    const type = wallet.getType();
    const account = getState().wallet.getIn(["accounts", type]);
    const selectedType = getState().wallet.get("selectedType");
    if (!account) {
      dispatch({ type: "HYDRO_WALLET_INIT_ACCOUNT" });
    }

    const watchAddress = async (timer = 0) => {
      const timerKey = `${type}-address`;
      if (timer && watchers.get(timerKey) && timer !== watchers.get(timerKey)) {
        return;
      }

      let address;

      try {
        const addresses: string[] = await wallet.getAddresses();
        address = addresses.length > 0 ? addresses[0].toLowerCase() : null;
      } catch (e) {
        address = null;
      }

      dispatch(loadAddress(type, address));

      const nextTimer = window.setTimeout(() => watchAddress(nextTimer), 3000);
      watchers.set(timerKey, nextTimer);
    };

    const watchLockedStatus = async (timer = 0) => {
      const timerKey = `${type}-lockedStatus`;
      if (timer && watchers.get(timerKey) && timer !== watchers.get(timerKey)) {
        return;
      }

      if (wallet.isLocked()) {
        dispatch(lockAccount(type));
      } else {
        dispatch(unlockAccount(type));
      }
    };

    const watchBalance = async (timer = 0) => {
      const timerKey = `${type}-balance`;
      if (timer && watchers.get(timerKey) && timer !== watchers.get(timerKey)) {
        return;
      }

      try {
        const balance = await wallet.loadBalance();
        dispatch(loadBalance(type, balance));
      } catch (e) {
        if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
          throw e;
        }
      }
      const watcherRate = getWatcherRate(selectedType, type);
      const nextTimer = window.setTimeout(
        () => watchBalance(nextTimer),
        watcherRate
      );
      watchers.set(timerKey, nextTimer);
    };

    Promise.all([watchAddress(), watchLockedStatus(), watchBalance()]);
  };
};

const getWatcherRate = (selectedType: string, type: string): number => {
  return selectedType === type && window.document.visibilityState !== "hidden"
    ? 3000
    : 300000;
};
