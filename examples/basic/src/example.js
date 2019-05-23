import React from "react";
import { connect } from "react-redux";
import { Wallet, getSelectedAccount, WalletButton } from "@gongddex/hydro-sdk-wallet";
import "@gongddex/hydro-sdk-wallet/index.css";
class Example extends React.Component {
  renderAccount(account) {
    return (
      <p>
        Address: {account.get("address")}
        <br />
        IsLock: {account.get("isLocked").toString()}
        <br />
        Eth Balance: {account.get("balance").toString()}
        <br />
        <br />
        <button
          onClick={() =>
            account
              .get("wallet")
              .signPersonalMessage("Test Message")
              .then(alert, alert)
          }>
          Sign "Test Message"
        </button>
      </p>
    );
  }

  render() {
    const { selectedAccount } = this.props;
    return (
      <div>
        <h2>Basic Example</h2>
        <Wallet title="Basic Wallet Demo" />
        <WalletButton />

        <h2>Info</h2>
        <div>{selectedAccount ? this.renderAccount(selectedAccount) : <p>No selected Account</p>}</div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    selectedAccount: getSelectedAccount(state)
  };
})(Example);
