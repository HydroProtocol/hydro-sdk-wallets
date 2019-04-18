import * as React from "react";
import { connect } from "react-redux";
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
import { WalletProps, WalletState, AccountState } from "../../reducers/wallet";
import { getSelectedAccount } from "../../selector/wallet";
import {
  hideDialog,
  loadExtensitonWallet,
  loadHydroWallets,
  unlockHydroWallet
} from "../../actions/wallet";

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
  passwordError: boolean;
}

interface Props extends WalletProps {
  dispatch: any;
  nodeUrl: string;
  title?: string;
  hideBanner?: boolean;
  defaultWalletType?: string;
  selectedAccount: AccountState | undefined;
}

class Wallet extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { defaultWalletType, selectedType } = this.props;
    this.state = {
      step: STEPS.SELETE,
      selectedWalletName:
        getWalletName(selectedType) ||
        defaultWalletType ||
        HydroWallet.WALLET_NAME,
      password: "",
      processing: false,
      passwordError: false
    };
  }

  public componentDidMount() {
    const { dispatch, nodeUrl } = this.props;
    HydroWallet.setNodeUrl(nodeUrl);
    dispatch(loadHydroWallets());

    if (document.readyState === "complete") {
      this.loadExtensitonWallet();
    } else {
      window.addEventListener("load", this.loadExtensitonWallet.bind(this));
    }
  }

  private loadExtensitonWallet() {
    this.props.dispatch(loadExtensitonWallet());
  }

  public render() {
    const { selectedWalletName } = this.state;
    const { isShowDialog, title, hideBanner, dispatch } = this.props;

    return (
      <div className="HydroSDK-wallet">
        <div className="HydroSDK-container" hidden={!isShowDialog}>
          <div className="HydroSDK-backdrop" />
          <div className="HydroSDK-dialog">
            <div className="HydroSDK-title">
              {title || "Hydro SDK Wallet"}
              {hideBanner ? null : (
                <span className="HydroSDK-banner">Powered by Hydro</span>
              )}
            </div>
            <div className="HydroSDK-fieldGroup">
              <div className="HydroSDK-label">Select Wallet Type</div>
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
                onClick={() => dispatch(hideDialog())}
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

  private renderStepContent() {
    const { step, selectedWalletName } = this.state;
    const { extensionWalletSupported, selectedType, accounts } = this.props;
    switch (step) {
      case STEPS.SELETE:
        return (
          <WalletSelector
            walletIsSupported={
              selectedWalletName === ExtensionWallet.WALLET_NAME
                ? extensionWalletSupported
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
    const { password, selectedWalletName, passwordError } = this.state;
    const { selectedType, selectedAccount } = this.props;
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
        error={passwordError}
        handleChange={(password: string) => this.setState({ password })}
      />
    );
  }

  private renderHydroWalletButtons(): JSX.Element | null {
    const { step, processing, selectedWalletName } = this.state;
    const { selectedType, selectedAccount } = this.props;

    if (
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
        {selectedType && selectedAccount && selectedAccount.get("isLocked") && (
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
    try {
      const { password } = this.state;
      this.setState({ processing: true });
      await this.props.dispatch(unlockHydroWallet(selectedType, password));
    } catch (e) {
      if (e.message === "invalid passowrd") {
        this.setState({ passwordError: true });
      }
      this.setState({ passwordError: false });
    } finally {
      this.setState({ processing: false });
    }
  }

  private getWalletsOptions(): Option[] {
    return [
      {
        value: HydroWallet.WALLET_NAME,
        text: HydroWallet.WALLET_NAME,
        onSelect: (option: Option) => {
          this.setState({
            selectedWalletName: option.value,
            step: STEPS.SELETE
          });
        }
      },
      {
        value: ExtensionWallet.WALLET_NAME,
        text: ExtensionWallet.WALLET_NAME,
        onSelect: (option: Option) => {
          ExtensionWallet.enableBrowserExtensionWallet();
          this.setState({
            selectedWalletName: option.value,
            step: STEPS.SELETE
          });
        }
      }
    ];
  }
}

export default connect((state: any) => {
  const walletState: WalletState = state.WalletReducer;

  return {
    selectedAccount: getSelectedAccount(state),
    accounts: walletState.get("accounts"),
    selectedType: walletState.get("selectedType"),
    extensionWalletSupported: walletState.get("extensionWalletSupported"),
    isShowDialog: walletState.get("isShowDialog")
  };
})(Wallet);
