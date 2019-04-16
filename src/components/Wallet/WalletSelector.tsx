import * as React from "react";
import Select, { Option } from "./Select";
import { getWalletName } from "../../wallets";
import { connector } from "../../connector";
import { AccountState } from "../../reducers/wallet";

interface Props {
  walletIsSupported: boolean;
  walletName: string;
  selectedType: string | null;
  accounts: AccountState;
}

interface State {}

const NOT_SUPPORTED_TEXT = "Current Wallet Type Is Not Supported";
const NOT_FOUND_ANY_ADDRESSES_TEXT = "Not Found Any Addresses";
const PLEASE_SELECT_A_ADDRESS_TEXT = "Please Select A Address";

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
          <div className="HydroSDK-label">Select Type</div>
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
    const options: Option[] = [];
    this.getWalletTypes(this.props.walletName).forEach((account, type) => {
      let text = account.get("address");
      if (text) {
        options.push({
          value: type,
          text,
          onSelect: (option: Option) => {
            connector.selectConnection(option.value);
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

export default SelectWallet;
