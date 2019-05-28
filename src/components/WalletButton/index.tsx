import * as React from "react";
import { connect } from "react-redux";
import { WalletState } from "../../reducers/wallet";
import { getSelectedAccount } from "../../selector/wallet";
import { hideWalletModal, showWalletModal } from "../../actions/wallet";
import { truncateAddress } from "../../wallets";

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
    const { selectedAccount, walletTranslations } = this.props;
    if (selectedAccount) {
      const isLocked = selectedAccount.get("isLocked");
      return (
        <span>
          {isLocked ? <i className="HydroSDK-fa fa fa-lock" /> : <i className="HydroSDK-fa fa fa-check" />}
          {selectedAccount.get("address")
            ? truncateAddress(selectedAccount.get("address"))
            : walletTranslations.toggleButtonText}
        </span>
      );
    } else {
      return <span>{walletTranslations.toggleButtonText}</span>;
    }
  }
}

export default connect((state: any) => {
  const walletState: WalletState = state.WalletReducer;

  return {
    selectedAccount: getSelectedAccount(state),
    isShowWalletModal: walletState.get("isShowWalletModal"),
    walletTranslations: walletState.get("walletTranslations")
  };
})(WalletButton);
