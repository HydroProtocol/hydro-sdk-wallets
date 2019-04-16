import { Map, fromJS } from "immutable";
import { BigNumber } from "ethers/utils";
import { ImmutableMap } from ".";

export interface AccountProps {
  address: string | null;
  balance: BigNumber;
  isLocked: boolean;
}

export type AccountState = ImmutableMap<AccountProps>;

export const initializeAccount: ImmutableMap<AccountState> = Map({
  address: null,
  balance: new BigNumber("0"),
  isLocked: true
});

export interface WalletProps {
  accounts: Map<string, AccountState>;
  selectedType: string | null;
  extensionWalletSuported: boolean;
  isShowDialog: boolean;
}

export type WalletState = ImmutableMap<WalletProps>;

const initialState: WalletState = fromJS({
  accounts: Map<string, AccountState>(),
  selectedType: null,
  extensionWalletSuported: false,
  isShowDialog: false
});

export default (state = initialState, action: any) => {
  switch (action.type) {
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
      let account = state.getIn(["accounts", action.payload.type]);
      if (!account) {
        state = state.setIn(
          ["accounts", action.payload.type],
          initializeAccount
        );
      }
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
    default:
      return state;
  }
};
