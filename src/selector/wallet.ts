import { AccountState, WalletState } from "../reducers/wallet";
import { Wallet } from "../wallets";

export const getAccounts = (state: {
  WalletReducer: WalletState;
}): Map<string, AccountState> | null => {
  return state.WalletReducer.getIn(["accounts"], null);
};

export const getSelectedAccount = (state: {
  WalletReducer: WalletState;
}): AccountState | null => {
  const selectedType = state.WalletReducer.get("selectedType");

  if (!selectedType) {
    return null;
  }

  return state.WalletReducer.getIn(["accounts", selectedType], null);
};

export const getAccount = (
  state: {
    WalletReducer: WalletState;
  },
  type: string
): AccountState | null => {
  return state.WalletReducer.getIn(["accounts", type], null);
};

export const getSelectedAccountWallet = (state: {
  WalletReducer: WalletState;
}): Wallet | null => {
  const selectedAccount = getSelectedAccount(state);
  return selectedAccount && selectedAccount.get("wallet", null);
};

export const getWallet = (
  state: {
    WalletReducer: WalletState;
  },
  type: string
): Wallet | null => {
  return state.WalletReducer.getIn(["accounts", type, "wallet"], null);
};
