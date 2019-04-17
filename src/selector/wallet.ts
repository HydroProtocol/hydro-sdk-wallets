import { AccountState, WalletState } from "../reducers/wallet";

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
