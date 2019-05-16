import { Map, fromJS } from "immutable";
import { BigNumber } from "bignumber.js";
import { ImmutableMap } from ".";
import { BaseWallet, HydroWallet } from "../wallets";
import { WALLET_STEPS } from "../actions/wallet";

export interface AccountProps {
  address: string | null;
  balance: BigNumber;
  isLocked: boolean;
  networkId: number | null;
  wallet: BaseWallet;
}

export type AccountState = ImmutableMap<AccountProps>;

export const initializeAccount: ImmutableMap<AccountState> = Map({
  address: null,
  balance: new BigNumber("0"),
  isLocked: true,
  networkId: null,
  wallet: null
});

export interface WalletProps {
  accounts: Map<string, AccountState>;
  selectedAccountID: string | null;
  extensionWalletSupported: boolean;
  ledgerConnecting: boolean;
  isShowWalletModal: boolean;
  step: string;
  walletCache: {
    wallet: HydroWallet;
    password: string;
  };
}

export type WalletState = ImmutableMap<WalletProps>;

const initialState: WalletState = fromJS({
  accounts: Map<string, AccountState>(),
  selectedAccountID: null,
  extensionWalletSupported: false,
  ledgerConnecting: false,
  isShowWalletModal: false,
  step: WALLET_STEPS.SELECT,
  walletCache: null
});

export default (state = initialState, action: any) => {
  switch (action.type) {
    case "HYDRO_WALLET_DISCONNECT_LEDGER":
      state = state.set("ledgerConnecting", false);
      return state;
    case "HYDRO_WALLET_CONNECT_LEDGER":
      state = state.set("ledgerConnecting", true);
      return state;
    case "HYDRO_WALLET_DELETE_ACCOUNT":
      state = state.removeIn(["accounts", action.payload.accountID]);
      return state;
    case "HYDRO_WALLET_CACHE_WALLET":
      state = state.set("walletCache", action.payload);
      return state;
    case "HYDRO_WALLET_SET_STEP":
      state = state.set("step", action.payload.step);
      return state;
    case "HYDRO_WALLET_INIT_ACCOUNT":
      state = state.setIn(["accounts", action.payload.accountID], initializeAccount);
      state = state.setIn(["accounts", action.payload.accountID, "wallet"], action.payload.wallet);
      return state;
    case "HYDRO_WALLET_UPDATE_WALLET":
      const wallet = action.payload.wallet;
      state = state.setIn(["accounts", wallet.id(), "wallet"], wallet);
      return state;
    case "HYDRO_WALLET_SHOW_DIALOG":
      state = state.set("isShowWalletModal", true);
      return state;
    case "HYDRO_WALLET_HIDE_DIALOG":
      state = state.set("isShowWalletModal", false);
      return state;
    case "HYDRO_WALLET_LOCK_ACCOUNT":
      state = state.setIn(["accounts", action.payload.accountID, "isLocked"], true);
      return state;
    case "HYDRO_WALLET_UNLOCK_ACCOUNT":
      state = state.setIn(["accounts", action.payload.accountID, "isLocked"], false);
      return state;
    case "HYDRO_WALLET_LOAD_ADDRESS":
      state = state.setIn(["accounts", action.payload.accountID, "address"], action.payload.address);
      return state;
    case "HYDRO_WALLET_LOAD_BALANCE":
      state = state.setIn(
        ["accounts", action.payload.accountID, "balance"],
        new BigNumber(String(action.payload.balance))
      );
      return state;
    case "HYDRO_WALLET_SELECT_ACCOUNT":
      state = state.set("selectedAccountID", action.payload.accountID);
      return state;
    case "HYDRO_WALLET_SUPPORT_EXTENSION_WALLET":
      state = state.set("extensionWalletSupported", true);
      return state;
    case "HYDRO_WALLET_LOAD_NETWORK":
      state = state.setIn(["accounts", action.payload.accountID, "networkId"], action.payload.networkId);
      return state;
    default:
      return state;
  }
};
