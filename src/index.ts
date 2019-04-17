import { Wallet, WalletButton } from "./components";
import { WalletReducer } from "./reducers";
import "../index.css";

declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

export { Wallet, WalletReducer, WalletButton };
