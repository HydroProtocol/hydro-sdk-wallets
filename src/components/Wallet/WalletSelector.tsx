import * as React from "react";
import Select, { Option } from "./Select";
import { truncateAddress } from "../../wallets";
import { AccountState, WalletState } from "../../reducers/wallet";
import { connect } from "react-redux";
import { selectAccount } from "../../actions/wallet";
import { Map } from "immutable";

interface Props {
  walletType: string;
  selectedAccountID: string | null;
  accounts: Map<string, AccountState>;
  dispatch: any;
  walletTranslations: { [key: string]: any };
}

interface State {}

const mapStateToProps = (state: any) => {
  const walletState: WalletState = state.WalletReducer;
  return {
    accounts: walletState.get("accounts"),
    selectedAccountID: walletState.get("selectedAccountID"),
    walletTranslations: walletState.get("walletTranslations")
  };
};

class WalletSelector extends React.PureComponent<Props, State> {
  public render() {
    const { selectedAccountID, walletTranslations } = this.props;

    const options = this.getOptions();

    let blankText;
    if (options.length === 0) {
      blankText = walletTranslations.noAvailableAddress;
    } else {
      blankText = walletTranslations.pleaseSelectAddress;
    }
    return (
      <>
        <div className="HydroSDK-fieldGroup">
          <div className="HydroSDK-label">{walletTranslations.selectAddress}</div>
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
      const wallet = account.get("wallet");

      if (text) {
        options.push({
          value: accountID,
          component: (
            <div className="HydroSDK-address-option">
              <span>
                {isLocked ? <i className="HydroSDK-fa fa fa-lock" /> : <i className="HydroSDK-fa fa fa-check" />}
                {truncateAddress(text)}
              </span>
              <span>{balance.div("1000000000000000000").toFixed(5)} ETH</span>
            </div>
          ),
          onSelect: (option: Option) => {
            dispatch(selectAccount(option.value, wallet.type()));
          }
        });
      }
    });
    return options;
  }

  private getWalletAccounts(walletType: string): Map<string, AccountState> {
    const { accounts } = this.props;
    return accounts.filter((account: AccountState) => {
      return account.get("wallet").type() === walletType;
    });
  }
}

export default connect(mapStateToProps)(WalletSelector);
