import * as React from "react";
import Select, { Option } from "./Select";
import { truncateAddress } from "../../wallets";
import { AccountState, WalletState } from "../../reducers/wallet";
import { connect } from "react-redux";
import { selectAccount } from "../../actions/wallet";

interface Props {
  walletIsSupported: boolean;
  walletType: string;
  selectedAccountID: string | null;
  accounts: AccountState;
  dispatch: any;
}

interface State {}

const mapStateToProps = (state: any) => {
  const walletState: WalletState = state.WalletReducer;
  return {
    accounts: walletState.get("accounts"),
    selectedAccountID: walletState.get("selectedAccountID")
  };
};

const NOT_SUPPORTED_TEXT = "Current wallet type is not supported";
const NOT_FOUND_ANY_ADDRESSES_TEXT = "No available address";
const PLEASE_SELECT_A_ADDRESS_TEXT = "Please select an address";

class WalletSelector extends React.PureComponent<Props, State> {
  public render() {
    const { selectedAccountID, walletIsSupported } = this.props;

    const options = this.getOptions();

    let blankText;
    if (!walletIsSupported) {
      blankText = NOT_SUPPORTED_TEXT;
    } else if (options.length === 0) {
      blankText = NOT_FOUND_ANY_ADDRESSES_TEXT;
    } else {
      blankText = PLEASE_SELECT_A_ADDRESS_TEXT;
    }
    return (
      <>
        <div className="HydroSDK-fieldGroup">
          <div className="HydroSDK-label">Select Address</div>
          <Select
            blank={blankText}
            noCaret={options.length === 0}
            disabled={options.length === 0}
            options={options}
            selected={selectedAccountID || ""}
          />
        </div>
      </>
    );
  }

  private getOptions(): Option[] {
    const { walletType, dispatch } = this.props;

    const options: Option[] = [];

    this.getWalletAccounts(walletType).forEach((account: AccountState, accountID: string) => {
      const text = account.get("address");
      const isLocked = account.get("isLocked");
      const balance = account.get("balance");

      if (text) {
        options.push({
          value: accountID,
          component: (
            <div className="HydroSDK-address-option">
              <span>
                {" "}
                {isLocked ? <i className="HydroSDK-fa fa fa-lock" /> : <i className="HydroSDK-fa fa fa-check" />}
                {truncateAddress(text)}
              </span>
              <span>{balance.div("1000000000000000000").toFixed(5)} ETH</span>
            </div>
          ),
          onSelect: (option: Option) => {
            dispatch(selectAccount(option.value));
          }
        });
      }
    });
    return options;
  }

  private getWalletAccounts(walletType: string): AccountState {
    const { accounts } = this.props;

    return accounts.filter((account: AccountState) => {
      return account.get("wallet").type() === walletType;
    });
  }
}

export default connect(mapStateToProps)(WalletSelector);
