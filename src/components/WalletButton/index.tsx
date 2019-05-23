import * as React from "react";
import { connect } from "react-redux";
import { WalletState } from "../../reducers/wallet";
import { getSelectedAccount } from "../../selector/wallet";
import { hideWalletModal, showWalletModal } from "../../actions/wallet";
import { truncateAddress } from "../../wallets";
import { translations } from "../../i18n";

class WalletButton extends React.PureComponent<any, any> {
  public render() {
    const { isShowWalletModal, dispatch } = this.props;

    return (
      <button
        className="HydroSDK-button HydroSDK-toggleButton"
        onClick={() => dispatch(isShowWalletModal ? hideWalletModal() : showWalletModal())}>
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
          {isLocked ? <i className="HydroSDK-fa fa fa-lock" /> : <i className="HydroSDK-fa fa fa-check" />}
          {selectedAccount.get("address")
            ? truncateAddress(selectedAccount.get("address"))
            : translations.toggleButtonText}
        </span>
      );
    } else {
      return <span>{translations.toggleButtonText}</span>;
    }
  }
}

export default connect((state: any) => {
  const walletState: WalletState = state.WalletReducer;

  return {
    selectedAccount: getSelectedAccount(state),
    isShowWalletModal: walletState.get("isShowWalletModal")
  };
})(WalletButton);
