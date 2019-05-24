import { BigNumber } from "ethers/utils";
import { getAccount } from "../selector/wallet";
import {
  BaseWallet,
  HydroWallet,
  ExtensionWallet,
  NeedUnlockWalletError,
  NotSupportedError,
  WalletConnectWallet,
  getBalance,
  Ledger
} from "../wallets";
import { AccountState } from "../reducers/wallet";
export const WALLET_STEPS = {
  SELECT: "SELECT",
  CREATE: "CREATE",
  CREATE_CONFIRM: "CREATE_CONFIRM",
  BACKUP: "BACKUP",
  TEST_MNEMONIC: "TEST_MNEMONIC",
  ADD_FUNDS: "ADD_FUNDS",
  IMPORT: "IMPORT",
  DELETE: "DELETE"
};

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

const isTimerExist = (accountID: string) => {
  return !!timers[accountID];
};

export const cacheWallet = (wallet: HydroWallet, password: string) => {
  return {
    type: "HYDRO_WALLET_CACHE_WALLET",
    payload: { wallet, password }
  };
};

export const setWalletStep = (step: string) => {
  return {
    type: "HYDRO_WALLET_SET_STEP",
    payload: { step }
  };
};

export const initAccount = (accountID: string, wallet: BaseWallet) => {
  return {
    type: "HYDRO_WALLET_INIT_ACCOUNT",
    payload: {
      accountID,
      wallet
    }
  };
};

export const updateWallet = (wallet: BaseWallet) => {
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

export const loadNetwork = (accountID: string, networkId: number | undefined) => {
  return {
    type: "HYDRO_WALLET_LOAD_NETWORK",
    payload: {
      accountID,
      networkId
    }
  };
};

export const selectAccount = (accountID: string, type: string) => {
  window.localStorage.setItem("HydroWallet:lastSelectedWalletType", type);
  window.localStorage.setItem("HydroWallet:lastSelectedAccountID", accountID);
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

export const unlockBrowserWalletAccount = (account: AccountState, password: string) => {
  return async (dispatch: any) => {
    const hydroWallet = account.get("wallet") as HydroWallet;
    if (hydroWallet) {
      await hydroWallet.unlock(password);
      dispatch(updateWallet(hydroWallet));
      dispatch(unlockAccount(hydroWallet.id()));
    }
  };
};

export const deleteBrowserWalletAccount = (account: AccountState) => {
  return async (dispatch: any) => {
    const hydroWallet = account.get("wallet") as HydroWallet;
    const isLocked = account.get("isLocked");
    if (hydroWallet && !isLocked) {
      const accountID = hydroWallet.id();
      clearTimer(accountID);
      dispatch({ type: "HYDRO_WALLET_DELETE_ACCOUNT", payload: { accountID } });
      await hydroWallet.delete();
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

export const loadExtensitonWallet = () => {
  return (dispatch: any) => {
    const wallet = new ExtensionWallet();
    if (wallet.isSupported()) {
      dispatch(supportExtensionWallet());
      dispatch(watchWallet(wallet));
    }
  };
};

export const loadWalletConnectWallet = () => {
  return async (dispatch: any) => {
    const wallet = new WalletConnectWallet({ bridge: "" });

    if (wallet.connector.connected) {
      await wallet.connector.killSession();
    }

    await wallet.connector.createSession();

    dispatch(watchWallet(wallet));
    const accountID = wallet.id();

    wallet.connector.on("connect", async (error, payload) => {
      if (error) {
        throw error;
      }

      const addresses = await wallet.getAddresses();

      dispatch(unlockAccount(accountID));
      dispatch(selectAccount(accountID, wallet.type()));
      dispatch(loadAddress(accountID, addresses[0]));
      dispatch(loadNetwork(accountID, payload.params[0].chainId));
    });

    wallet.connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      // get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];

      dispatch(loadAddress(accountID, accounts[0]));
      dispatch(loadNetwork(accountID, chainId));
    });

    wallet.connector.on("disconnect", async (error, payload) => {
      if (error) {
        throw error;
      }

      window.location.reload();
    });
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

export const loadLedger = () => {
  return async (dispatch: any) => {
    const wallet = new Ledger();
    await wallet.initTransport();
    dispatch(watchWallet(wallet));
    dispatch(connectLedger());
  };
};

export const connectLedger = () => {
  return {
    type: "HYDRO_WALLET_CONNECT_LEDGER"
  };
};

export const disconnectLedger = () => {
  return {
    type: "HYDRO_WALLET_DISCONNECT_LEDGER"
  };
};

const watchWallet = (wallet: BaseWallet) => {
  return async (dispatch: any, getState: any) => {
    const accountID = wallet.id();
    const type = wallet.type();

    if (isTimerExist(accountID)) {
      clearTimer(accountID);
    }

    if (!getAccount(getState(), accountID)) {
      await dispatch(initAccount(accountID, wallet));
    } else {
      await dispatch(updateWallet(wallet));
    }

    const lastSelectedAccountID = window.localStorage.getItem("HydroWallet:lastSelectedAccountID");
    const currentSelectedAccountID = getState().WalletReducer.get("selectedAccountID");
    if (!currentSelectedAccountID && lastSelectedAccountID === accountID) {
      dispatch(selectAccount(accountID, type));
    }
    if (type === ExtensionWallet.TYPE) {
      ExtensionWallet.enableBrowserExtensionWallet();
    }

    const watchAddress = async () => {
      const timerKey = TIMER_KEYS.ADDRESS;

      let address;
      try {
        const addresses: string[] = await wallet.getAddresses();
        address = addresses.length > 0 ? addresses[0].toLowerCase() : null;
      } catch (e) {
        if (type === Ledger.TYPE) {
          dispatch(disconnectLedger());
          clearTimer(accountID);
        } else if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
          throw e;
        }
        address = null;
      }

      const walletIsLocked = wallet.isLocked(address);
      const walletStoreLocked = getState().WalletReducer.getIn(["accounts", accountID, "isLocked"]);

      if (walletIsLocked !== walletStoreLocked) {
        dispatch(walletIsLocked ? lockAccount(accountID) : unlockAccount(accountID));
      }

      const currentAddressInStore = getState().WalletReducer.getIn(["accounts", accountID, "address"]);

      if (currentAddressInStore !== address) {
        dispatch(loadAddress(accountID, address));
      }

      const nextTimer = window.setTimeout(() => watchAddress(), 3000);
      setTimer(accountID, timerKey, nextTimer);
    };

    const watchBalance = async () => {
      const timerKey = TIMER_KEYS.BALANCE;

      const address = getState().WalletReducer.getIn(["accounts", accountID, "address"]);
      if (address) {
        try {
          const balance = await getBalance(address);
          const balanceInStore = getState().WalletReducer.getIn(["accounts", accountID, "balance"]);

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
        if (networkId && networkId !== getState().WalletReducer.getIn(["accounts", accountID, "networkId"])) {
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
