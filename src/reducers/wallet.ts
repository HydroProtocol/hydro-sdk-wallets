import { Map, fromJS } from "immutable";
import { BigNumber } from "ethers/utils";
import { ImmutableMap } from ".";
import { Wallet } from "../wallets";

export interface AccountProps {
  address: string | null;
  balance: BigNumber;
  isLocked: boolean;
  networkId: number | null;
  wallet: Wallet;
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
  selectedType: string | null;
  extensionWalletSupported: boolean;
  isShowDialog: boolean;
}

export type WalletState = ImmutableMap<WalletProps>;

const initialState: WalletState = fromJS({
  accounts: Map<string, AccountState>(),
  selectedType: null,
  extensionWalletSupported: false,
  isShowDialog: false
});

export default (state = initialState, action: any) => {
  switch (action.type) {
    case "HYDRO_WALLET_INIT_ACCOUNT":
      state = state.setIn(["accounts", action.payload.type], initializeAccount);
      state = state.setIn(
        ["accounts", action.payload.type, "wallet"],
        action.payload.wallet
      );
      return state;
    case "HYDRO_WALLET_UPDATE_WALLET":
      state = state.setIn(
        ["accounts", action.payload.type, "wallet"],
        action.payload.wallet
      );
      return state;
    case "HYDRO_WALLET_SHOW_DIALOG":
      state = state.set("isShowDialog", true);
      return state;
    case "HYDRO_WALLET_HIDE_DIALOG":
      state = state.set("isShowDialog", false);
      return state;
    case "HYDRO_WALLET_LOCK_ACCOUNT":
      state = state.setIn(["accounts", action.payload.type, "isLocked"], true);
      return state;
    case "HYDRO_WALLET_UNLOCK_ACCOUNT":
      state = state.setIn(["accounts", action.payload.type, "isLocked"], false);
      return state;
    case "HYDRO_WALLET_LOAD_ADDRESS":
      state = state.setIn(
        ["accounts", action.payload.type, "address"],
        action.payload.address
      );
      return state;
    case "HYDRO_WALLET_LOAD_BALANCE":
      state = state.setIn(
        ["accounts", action.payload.type, "balance"],
        action.payload.balance
      );
      return state;
    case "HYDRO_WALLET_SELECT_ACCOUNT":
      state = state.set("selectedType", action.payload.type);
      return state;
    case "HYDRO_WALLET_SUPPORT_EXTENSION_WALLET":
      state = state.set("extensionWalletSupported", true);
      return state;
    case "HYDRO_WALLET_LOAD_NETWORK":
      state = state.setIn(
        ["accounts", action.payload.type, "networkId"],
        action.payload.networkId
      );
      return state;
    default:
      return state;
  }
};
