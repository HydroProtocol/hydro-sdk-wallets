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
  isHydroWallet,
  WalletTypes
} from "../../wallets";
import { WalletProps, WalletState, AccountState } from "../../reducers/wallet";
import { getSelectedAccount } from "../../selector/wallet";
import {
  hideWalletModal,
  loadExtensitonWallet,
  loadHydroWallets,
  unlockBrowserWalletAccount
} from "../../actions/wallet";
import Svg from "../Svg";

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

interface Props extends WalletProps {
  dispatch: any;
  nodeUrl: string;
  title?: string;
  hideBanner?: boolean;
  defaultWalletType?: string;
  selectedAccount: AccountState | null;
}

class Wallet extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { defaultWalletType, selectedType } = this.props;
    let selectedWalletName: string;
    const selectedTypeWalletName = getWalletName(selectedType);

    if (selectedTypeWalletName) {
      selectedWalletName = selectedTypeWalletName;
    } else if (
      defaultWalletType &&
      WalletTypes.indexOf(defaultWalletType) > -1
    ) {
      selectedWalletName = defaultWalletType;
    } else {
      selectedWalletName = ExtensionWallet.WALLET_NAME;
    }

    this.state = {
      step: STEPS.SELETE,
      selectedWalletName,
      password: "",
      processing: false
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
    const { isShowWalletModal, title, hideBanner, dispatch } = this.props;

    return (
      <div className="HydroSDK-wallet">
        <div className="HydroSDK-container" hidden={!isShowWalletModal}>
          <div
            className="HydroSDK-backdrop"
            onClick={() => dispatch(hideWalletModal())}
          />
          <div className="HydroSDK-dialog">
            <div className="HydroSDK-title">
              {title || "Hydro SDK Wallet"}
              <button
                className="HydroSDK-closeButton"
                onClick={() => dispatch(hideWalletModal())}
              >
                X
              </button>
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
              {hideBanner ? null : (
                <span className="HydroSDK-banner">Powered by Hydro</span>
              )}
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
    const { password, selectedWalletName, step } = this.state;
    const { selectedType, selectedAccount } = this.props;
    if (
      step !== STEPS.SELETE ||
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
    const { selectedType, selectedAccount } = this.props;

    if (
      selectedWalletName !== HydroWallet.WALLET_NAME ||
      step !== STEPS.SELETE ||
      !selectedType ||
      !selectedAccount ||
      !selectedAccount.get("isLocked")
    ) {
      return null;
    }
    return (
      <div className="HydroSDK-hydroWalletButtonGroup">
        <button
          className="HydroSDK-featureButton"
          disabled={processing}
          onClick={async () => await this.handleUnlock(selectedType)}
        >
          {processing ? (
            <i className="HydroSDK-fa fa fa-spinner fa-spin" />
          ) : null}{" "}
          Unlock
        </button>
      </div>
    );
  }

  private async handleUnlock(selectedType: string): Promise<void> {
    try {
      const { password } = this.state;
      this.setState({ processing: true });
      await this.props.dispatch(
        unlockBrowserWalletAccount(selectedType, password)
      );
    } catch (e) {
      alert(e);
    } finally {
      this.setState({ processing: false });
    }
  }

  private getWalletsOptions(): Option[] {
    return [
      {
        value: ExtensionWallet.WALLET_NAME,
        component: (
          <div className="HydroSDK-optionItem">
            <Svg name="extension" />
            {ExtensionWallet.WALLET_NAME}
          </div>
        ),
        onSelect: (option: Option) => {
          ExtensionWallet.enableBrowserExtensionWallet();
          this.setState({
            selectedWalletName: option.value,
            step: STEPS.SELETE
          });
        }
      },
      {
        value: HydroWallet.WALLET_NAME,
        component: (
          <div className="HydroSDK-optionItem">
            <Svg name="logo" />
            {HydroWallet.WALLET_NAME}
          </div>
        ),
        onSelect: (option: Option) => {
          this.setState({
            selectedWalletName: option.value,
            step: STEPS.SELETE
          });
        }
      },
      {
        value: STEPS.IMPORT,
        component: (
          <div className="HydroSDK-optionItem HydroSDK-walletFeature">
            <Svg name="import" />
            Import Wallet
          </div>
        ),
        onSelect: () => {
          this.setState({
            selectedWalletName: HydroWallet.WALLET_NAME,
            step: STEPS.IMPORT
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
    isShowWalletModal: walletState.get("isShowWalletModal")
  };
})(Wallet);
