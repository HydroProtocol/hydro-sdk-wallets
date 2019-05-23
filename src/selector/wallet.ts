import { AccountState, WalletState } from "../reducers/wallet";
import { BaseWallet } from "../wallets";

export const getAccounts = (state: { WalletReducer: WalletState }): Map<string, AccountState> | null => {
  return state.WalletReducer.getIn(["accounts"], null);
};

export const getSelectedAccount = (state: { WalletReducer: WalletState }): AccountState | null => {
  const selectedAccountID = state.WalletReducer.get("selectedAccountID");

  if (!selectedAccountID) {
    return null;
  }

  return state.WalletReducer.getIn(["accounts", selectedAccountID], null);
};

export const getAccount = (
  state: {
    WalletReducer: WalletState;
  },
  accountID: string
): AccountState | null => {
  return state.WalletReducer.getIn(["accounts", accountID], null);
};

export const getSelectedAccountWallet = (state: { WalletReducer: WalletState }): BaseWallet | null => {
  const selectedAccount = getSelectedAccount(state);
  return selectedAccount && selectedAccount.get("wallet", null);
};

export const getWallet = (
  state: {
    WalletReducer: WalletState;
  },
  accountID: string
): BaseWallet | null => {
  return state.WalletReducer.getIn(["accounts", accountID, "wallet"], null);
};
