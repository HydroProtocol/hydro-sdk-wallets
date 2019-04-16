import { WalletProps, AccountState } from "../reducers/wallet";
export const getSelectedAccount = (state: WalletProps): AccountState | null => {
  const selectedType = state.selectedType;
  if (!selectedType) {
    return null;
  }
  return state.accounts.get(selectedType)!;
};
