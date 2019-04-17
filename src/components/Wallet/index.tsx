import * as React from "react";
import { connect } from "react-redux";
import { connector } from "../../connector";
import WalletSelector from "./WalletSelector";
import Create from "./Create";
import Import from "./Import";
import Input from "./Input";
import Select, { Option } from "./Select";
import {
  HydroWallet,
  getWalletName,
  ExtensionWallet,
  isHydroWallet
} from "../../wallets";
import { WalletProps, WalletState } from "../../reducers/wallet";
import { getSelectedAccount } from "../../selector/wallet";
import { hideDialog, showDialog } from "../../actions/wallet";
import { ImmutableMap } from "../../reducers";

const STEPS = {
  SELETE: "SELETE",
  CREATE: "CREATE",
  IMPORT: "IMPORT"
};

interface State {
  selectedWalletName: string;
  step: string;
  password: string;
  processing: boolean;
}

interface Props extends WalletProps {}

class Wallet extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      step: STEPS.SELETE,
      selectedWalletName: getWalletName(this.props.selectedType),
      password: "",
      processing: false
    };
  }

  public render() {
    const { selectedWalletName } = this.state;
    const { isShowDialog } = this.props;

    return (
      <div className="HydroSDK-wallet">
        <button
          className="HydroSDK-toggleButton"
          onClick={() =>
            connector.dispatch(isShowDialog ? hideDialog() : showDialog())
          }
        >
          {this.toggleText()}
        </button>
        <div className="HydroSDK-container" hidden={!isShowDialog}>
          <div className="HydroSDK-backdrop" />
          <div className="HydroSDK-dialog">
            <div className="HydroSDK-title">Hydro SDK Wallet</div>
            <div className="HydroSDK-fieldGroup">
              <div className="HydroSDK-label">Select Wallet</div>
              <Select
                options={this.getWalletsOptions()}
                selected={selectedWalletName}
              />
            </div>
            {this.renderStepContent()}
            {this.renderUnlockForm()}
            <div className="HydroSDK-footer">
              <button
                className="HydroSDK-closeButton"
                onClick={() => connector.dispatch(hideDialog())}
              >
                Close
              </button>
              {this.renderHydroWalletButtons()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private toggleText() {
    const selectedAccount = getSelectedAccount(this.props);
    if (selectedAccount) {
      const isLocked = selectedAccount.get("isLocked");
      return (
        <span>
          {isLocked ? (
            <i className="HydroSDK-fa HydroSDK-lock" />
          ) : (
            <i className="HydroSDK-fa HydroSDK-check" />
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

  private renderStepContent() {
    const { step, selectedWalletName } = this.state;
    const { extensionWalletSuported, selectedType, accounts } = this.props;
    switch (step) {
      case STEPS.SELETE:
        return (
          <WalletSelector
            walletIsSupported={
              selectedWalletName === ExtensionWallet.WALLET_NAME
                ? extensionWalletSuported
                : true
            }
            accounts={accounts}
            selectedType={selectedType}
            walletName={selectedWalletName}
          />
        );
      case STEPS.CREATE:
        return (
          <Create callback={() => this.setState({ step: STEPS.SELETE })} />
        );
      case STEPS.IMPORT:
        return (
          <Import callback={() => this.setState({ step: STEPS.SELETE })} />
        );
      default:
        return null;
    }
  }

  private renderUnlockForm() {
    const { password, selectedWalletName } = this.state;
    const { selectedType } = this.props;
    const selectedAccount = getSelectedAccount(this.props);
    if (
      selectedWalletName !== HydroWallet.WALLET_NAME ||
      !isHydroWallet(selectedType) ||
      !selectedAccount ||
      !selectedAccount.get("isLocked")
    ) {
      return null;
    }

    return (
      <Input
        label="Password"
        text={password}
        handleChange={(password: string) => this.setState({ password })}
      />
    );
  }

  private renderHydroWalletButtons(): JSX.Element | null {
    const { step, processing, selectedWalletName } = this.state;
    const { selectedType } = this.props;
    const selectedAccount = getSelectedAccount(this.props);
    if (
      !selectedType ||
      selectedWalletName !== HydroWallet.WALLET_NAME ||
      step !== STEPS.SELETE
    ) {
      return null;
    }
    return (
      <div className="HydroSDK-hydroWalletButtonGroup">
        <button
          className="HydroSDK-featureButton"
          onClick={() => this.setState({ step: STEPS.CREATE })}
        >
          Create Wallet
        </button>
        <button
          className="HydroSDK-featureButton"
          onClick={() => this.setState({ step: STEPS.IMPORT })}
        >
          Import Wallet
        </button>
        {selectedAccount && selectedAccount.get("isLocked") && (
          <button
            className="HydroSDK-featureButton"
            disabled={processing}
            onClick={async () => await this.handleUnlock(selectedType)}
          >
            {processing ? <i className="HydroSDK-fa HydroSDK-loading" /> : null}{" "}
            Unlock
          </button>
        )}
      </div>
    );
  }

  private async handleUnlock(selectedType: string): Promise<void> {
    const { password } = this.state;
    this.setState({ processing: true });
    await connector.unlock(selectedType, password);
    this.setState({ processing: false });
  }

  private getWalletsOptions(): Option[] {
    const onSelect = (option: Option) => {
      this.setState({ selectedWalletName: option.value, step: STEPS.SELETE });
    };
    return [
      {
        value: HydroWallet.WALLET_NAME,
        text: HydroWallet.WALLET_NAME,
        onSelect
      },
      {
        value: ExtensionWallet.WALLET_NAME,
        text: ExtensionWallet.WALLET_NAME,
        onSelect
      }
    ];
  }
}

export default connect(
  (state: any) => {
    const walletState: WalletState = state.WalletReducer;

    return {
      accounts: walletState.get("accounts"),
      selectedType: walletState.get("selectedType"),
      extensionWalletSuported: walletState.get("extensionWalletSuported"),
      isShowDialog: walletState.get("isShowDialog")
    };
  },
  dispatch => {
    // hack
    connector.setDispatch(dispatch);
    return {};
  }
)(Wallet);
