import { AccountState, WalletState } from "../reducers/wallet";
import { Wallet } from "../wallets";

export const getSelectedAccount = (
  state: WalletState
): AccountState | undefined => {
  const selectedType = state.get("selectedType");

  if (!selectedType) {
    return undefined;
  }

  return state.getIn(["accounts", selectedType]);
};

export const getAccount = (
  state: WalletState,
  type: string
): AccountState | undefined => {
  return state.getIn(["accounts", type]);
};

export const getSelectedAccountWallet = (
  state: WalletState
): Wallet | undefined => {
  const selectedAccount = getSelectedAccount(state);
  return selectedAccount && selectedAccount.get("wallet");
};

export const getWallet = (
  state: WalletState,
  type: string
): Wallet | undefined => {
  return state.getIn(["accounts", type, "wallet"]);
};
