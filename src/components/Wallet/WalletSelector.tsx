import * as React from "react";
import Select, { Option } from "./Select";
import { getWalletName } from "../../wallets";
import { AccountState } from "../../reducers/wallet";
import { connect } from "react-redux";
import { selectAccount } from "../../actions/wallet";

interface Props {
  walletIsSupported: boolean;
  walletName: string;
  selectedType: string | null;
  accounts: AccountState;
  dispatch: any;
}

interface State {}

const NOT_SUPPORTED_TEXT = "Current wallet type is not supported";
const NOT_FOUND_ANY_ADDRESSES_TEXT = "No available address";
const PLEASE_SELECT_A_ADDRESS_TEXT = "Please select an address";

class SelectWallet extends React.PureComponent<Props, State> {
  public render() {
    const { selectedType, walletIsSupported } = this.props;
    const typesOptions = this.getTypesOptions();
    let blankText;
    if (!walletIsSupported) {
      blankText = NOT_SUPPORTED_TEXT;
    } else if (typesOptions.length === 0) {
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
            noCaret={typesOptions.length === 0}
            disabled={typesOptions.length === 0}
            options={typesOptions}
            selected={selectedType}
          />
        </div>
      </>
    );
  }

  private getTypesOptions(): Option[] {
    const { walletName, dispatch } = this.props;
    const options: Option[] = [];
    this.getWalletTypes(walletName).forEach((account, type) => {
      let text = account.get("address");
      const isLocked = account.get("isLocked");
      if (text) {
        options.push({
          value: type,
          component: (
            <span>
              {" "}
              {isLocked ? (
                <i className="HydroSDK-fa HydroSDK-lock" />
              ) : (
                <i className="HydroSDK-fa HydroSDK-check" />
              )}
              {text}
            </span>
          ),
          onSelect: (option: Option) => {
            dispatch(selectAccount(option.value));
          }
        });
      }
    });
    return options;
  }

  private getWalletTypes(walletName: string): AccountState {
    const { accounts } = this.props;
    return accounts.filter((account, type) => {
      return getWalletName(type) === walletName;
    });
  }
}

export default connect()(SelectWallet);
