import * as React from "react";
import { connect } from "react-redux";
import { WalletState, AccountState } from "../../reducers/wallet";
import { getSelectedAccount } from "../../selector/wallet";
import { hideWalletModal, showWalletModal } from "../../actions/wallet";
import { truncateAddress } from "../../wallets";

interface Props {
  selectedAccount: AccountState | null;
  isShowWalletModal: boolean;
  walletTranslations: { [key: string]: any };
  dispatch: any;
  notAllowClick?: boolean;
}
class WalletButton extends React.PureComponent<Props, any> {
  public render() {
    return (
      <button className="HydroSDK-button HydroSDK-toggleButton" onClick={() => this.handleClick()}>
        {this.toggleText()}
      </button>
    );
  }

  private handleClick() {
    const { isShowWalletModal, dispatch, notAllowClick } = this.props;
    if (!notAllowClick) {
      dispatch(isShowWalletModal ? hideWalletModal() : showWalletModal());
    }
  }

  private toggleText() {
    const { selectedAccount, walletTranslations } = this.props;
    if (selectedAccount) {
      const isLocked = selectedAccount.get("isLocked");
      return (
        <span>
          {isLocked ? <i className="HydroSDK-fa fa fa-lock" /> : <i className="HydroSDK-fa fa fa-check" />}
          {selectedAccount.get("address")
            ? truncateAddress(selectedAccount.get("address") || "")
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
