import { Map, fromJS } from "immutable";
import { BigNumber } from "ethers/utils";
import { ImmutableMap } from ".";

export interface AccountProps {
  address: string | null;
  balance: BigNumber;
  isLocked: boolean;
  timers: Map<string, number>;
}

export type AccountState = ImmutableMap<AccountProps>;

export const initializeAccount: ImmutableMap<AccountState> = Map({
  address: null,
  balance: new BigNumber("0"),
  isLocked: true,
  timers: Map(),
  networkId: null
});

export interface WalletProps {
  accounts: Map<string, AccountState>;
  selectedType: string | null;
  supportedWallet: Map<string, boolean>;
  isShowDialog: boolean;
  networkId: number | null;
}

export type WalletState = ImmutableMap<WalletProps>;

const initialState: WalletState = fromJS({
  accounts: Map<string, AccountState>(),
  selectedType: null,
  supportedWallet: Map(),
  isShowDialog: false
});

export default (state = initialState, action: any) => {
  switch (action.type) {
    case "HYDRO_WALLET_INIT_ACCOUNT":
      state = state.setIn(["accounts", action.payload.type], initializeAccount);
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
    case "HYDRO_WALLET_LOAD_ACCOUNT":
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
      state = state.set("extensionWalletSuported", true);
      return state;
    case "HYDRO_WALLET_LOAD_NETWORK_ID":
      state = state.setIn(
        ["accounts", action.payload.type, "networkId"],
        action.payload.networkId
      );
      return state;
    default:
      return state;
  }
};
