import Wallet from "./Wallet";
import { WalletState, WalletProps } from "../reducers/wallet";
export const formatProps = (state: WalletState): WalletProps => {
  return {
    accounts: state.get("accounts"),
    selectedType: state.get("selectedType"),
    extensionWalletSuported: state.get("extensionWalletSuported"),
    isShowDialog: state.get("isShowDialog"),
    networkId: state.get("networkId")
  };
};

export { Wallet };
