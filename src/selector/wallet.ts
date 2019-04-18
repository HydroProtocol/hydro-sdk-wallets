import { AccountState, WalletState } from "../reducers/wallet";
import { Wallet } from "../wallets";

export const getSelectedAccount = (state: {
  WalletReducer: WalletState;
}): AccountState | undefined => {
  const selectedType = state.WalletReducer.get("selectedType");

  if (!selectedType) {
    return undefined;
  }

  return state.WalletReducer.getIn(["accounts", selectedType]);
};

export const getAccount = (
  state: {
    WalletReducer: WalletState;
  },
  type: string
): AccountState | undefined => {
  return state.WalletReducer.getIn(["accounts", type]);
};

export const getSelectedAccountWallet = (state: {
  WalletReducer: WalletState;
}): Wallet | undefined => {
  const selectedAccount = getSelectedAccount(state);
  return selectedAccount && selectedAccount.get("wallet");
};

export const getWallet = (
  state: {
    WalletReducer: WalletState;
  },
  type: string
): Wallet | undefined => {
  return state.WalletReducer.getIn(["accounts", type, "wallet"]);
};
