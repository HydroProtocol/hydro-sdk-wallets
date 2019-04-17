import { AccountState, WalletState } from "../reducers/wallet";

export const getSelectedAccount = (
  state: WalletState
): AccountState | undefined => {
  const selectedType = state.get("selectedType");

  if (!selectedType) {
    return undefined;
  }

  return state.get("accounts").get(selectedType);
};
