import { Wallet, WalletButton } from "./components";
import { connector, Connector } from "./connector";
import { WalletReducer } from "./reducers";
import "../index.css";
import { WalletTypes } from "./wallets";

export {
  Wallet,
  // connector,
  // Connector,
  WalletReducer,
  WalletButton,
  WalletTypes

  // actions
  // SelectAccount(accountID)
  // UnlockAccount(accountID, password)

  // selector
  // GetAccounts()
  // GetSelectAccount()

  // account.connection
  // connection.PersonalSign(accountID, msg)
  // connection.SendTransaction(account, transaction)
  // connection.GetTransactionReceipt(transactionHash)
  // connection.GetAccountInfo(accountID)
};
