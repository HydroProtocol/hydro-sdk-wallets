import * as React from "react";
import { connect } from "react-redux";
import { WalletState } from "../../reducers/wallet";
import { getSelectedAccount } from "../../selector/wallet";
import { hideDialog, showDialog } from "../../actions/wallet";

class WalletButton extends React.PureComponent<any, any> {
  public render() {
    const { isShowDialog, dispatch } = this.props;

    return (
      <button
        className="HydroSDK-toggleButton"
        onClick={() => dispatch(isShowDialog ? hideDialog() : showDialog())}
      >
        {this.toggleText()}
      </button>
    );
  }

  private toggleText() {
    const { selectedAccount } = this.props;

    if (selectedAccount) {
      const isLocked = selectedAccount.get("isLocked");
      return (
        <span>
          {isLocked ? (
            <i className="HydroSDK-fa fa fa-lock" />
          ) : (
            <i className="HydroSDK-fa fa fa-check" />
          )}
          {selectedAccount.get("address")
            ? selectedAccount.get("address")
            : "Please Click to Select A Wallet"}
        </span>
      );
    } else {
      return <span>Please Click to Select A Wallet</span>;
    }
  }
}

export default connect((state: any) => {
  const walletState: WalletState = state.WalletReducer;

  return {
    selectedAccount: getSelectedAccount(state),
    isShowDialog: walletState.get("isShowDialog")
  };
})(WalletButton);
