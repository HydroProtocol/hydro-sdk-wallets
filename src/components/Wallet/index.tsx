import * as React from "react";
import { connect } from "react-redux";
import WalletSelector from "./WalletSelector";
import Create from "./Create";
import Import from "./Import";
import Input from "./Input";
import Select, { Option } from "./Select";
import * as qrImage from "qr-image";

import {
  HydroWallet,
  ExtensionWallet,
  WalletConnectWallet,
  WalletTypes,
  setNodeUrl
} from "../../wallets";
import { WalletProps, WalletState, AccountState } from "../../reducers/wallet";
import { getSelectedAccount } from "../../selector/wallet";
import {
  hideWalletModal,
  loadExtensitonWallet,
  loadHydroWallets,
  loadWalletConnectWallet,
  unlockBrowserWalletAccount
} from "../../actions/wallet";
import Svg from "../Svg";

const STEPS = {
  SELECT: "SELECT",
  CREATE: "CREATE",
  IMPORT: "IMPORT"
};

interface State {
  step: string;
  password: string;
  processing: boolean;
  selectedWalletType: string;
}

interface Props extends WalletProps {
  dispatch: any;
  nodeUrl: string;
  title?: string;
  defaultWalletType?: string;
  selectedAccount: AccountState | null;
}

class Wallet extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { defaultWalletType, selectedAccount } = this.props;

    let selectedWalletType: string;

    if (selectedAccount) {
      selectedWalletType = selectedAccount.get("wallet").type();
    } else if (
      defaultWalletType &&
      WalletTypes.indexOf(defaultWalletType) > -1
    ) {
      selectedWalletType = defaultWalletType;
    } else {
      selectedWalletType = ExtensionWallet.TYPE;
    }

    this.state = {
      step: STEPS.SELECT,
      selectedWalletType,
      password: "",
      processing: false
    };
  }

  public componentDidMount() {
    const { dispatch, nodeUrl } = this.props;
    setNodeUrl(nodeUrl);
    dispatch(loadHydroWallets());
    dispatch(loadWalletConnectWallet());

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
    const { selectedWalletType } = this.state;
    const { isShowWalletModal, title, dispatch } = this.props;

    return (
      <div className="HydroSDK-wallet">
        <div className="HydroSDK-container" hidden={!isShowWalletModal}>
          <div
            className="HydroSDK-backdrop"
            onClick={() => dispatch(hideWalletModal())}
          />
          <div className="HydroSDK-dialog">
            <div className="HydroSDK-title">{title || "Hydro SDK Wallet"}</div>
            <div className="HydroSDK-fieldGroup">
              <div className="HydroSDK-label">Select Wallet Type</div>
              <Select
                options={this.getWalletsOptions()}
                selected={selectedWalletType}
              />
            </div>
            {this.renderStepContent()}
            {this.renderUnlockForm()}
            <div className="HydroSDK-footer">
              <button
                className="HydroSDK-closeButton"
                onClick={() => dispatch(hideWalletModal())}
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
    const { step, selectedWalletType } = this.state;
    const { extensionWalletSupported, accounts, selectedAccount } = this.props;
    switch (step) {
      case STEPS.SELECT:
        if (selectedWalletType === WalletConnectWallet.TYPE) {
          const account = accounts.get(WalletConnectWallet.TYPE)!;
          if (account.get("isLocked")) return this.renderQrImage();
        }

        return (
          <WalletSelector
            walletIsSupported={
              selectedWalletType === ExtensionWallet.TYPE
                ? extensionWalletSupported
                : true
            }
            accounts={accounts}
            selectedAccount={selectedAccount}
            walletType={selectedWalletType}
          />
        );
      case STEPS.CREATE:
        return (
          <Create callback={() => this.setState({ step: STEPS.SELECT })} />
        );
      case STEPS.IMPORT:
        return (
          <Import callback={() => this.setState({ step: STEPS.SELECT })} />
        );
      default:
        return null;
    }
  }

  private renderQrImage() {
    const { accounts } = this.props;
    const wallet = accounts.get(WalletConnectWallet.TYPE)!.get("wallet");
    const connector = (wallet as any).connector;

    return (
      <div
        className="HydroSDK-qr-image"
        dangerouslySetInnerHTML={{
          __html: qrImage.imageSync(connector.uri, { type: "svg" }).toString()
        }}
      />
    );
  }

  private renderUnlockForm() {
    const { password, selectedWalletType, step } = this.state;
    const { selectedAccount } = this.props;
    if (
      step !== STEPS.SELECT ||
      selectedWalletType !== HydroWallet.TYPE ||
      !selectedAccount ||
      !selectedAccount.get("isLocked") ||
      selectedAccount.get("wallet").type() !== HydroWallet.TYPE
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
    const { step, processing, selectedWalletType } = this.state;
    const { selectedAccount } = this.props;

    if (
      selectedWalletType !== HydroWallet.TYPE ||
      step !== STEPS.SELECT ||
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
          onClick={async () => await this.handleUnlock(selectedAccount)}
        >
          {processing ? (
            <i className="HydroSDK-fa fa fa-spinner fa-spin" />
          ) : null}{" "}
          Unlock
        </button>
      </div>
    );
  }

  private async handleUnlock(selectedAccount: AccountState): Promise<void> {
    try {
      const { password } = this.state;
      this.setState({ processing: true });
      await this.props.dispatch(
        unlockBrowserWalletAccount(selectedAccount, password)
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
        value: ExtensionWallet.TYPE,
        component: (
          <div className="HydroSDK-optionItem">
            <Svg name="extension" />
            {ExtensionWallet.LABEL}
          </div>
        ),
        onSelect: (option: Option) => {
          ExtensionWallet.enableBrowserExtensionWallet();
          this.setState({
            selectedWalletType: option.value,
            step: STEPS.SELECT
          });
        }
      },
      {
        value: WalletConnectWallet.TYPE,
        component: (
          <div className="HydroSDK-optionItem">
            <Svg name="WalletConnect" />
            {WalletConnectWallet.LABEL}
          </div>
        ),
        onSelect: (option: Option) => {
          this.setState({
            selectedWalletType: option.value,
            step: STEPS.SELECT
          });
        }
      },
      {
        value: HydroWallet.TYPE,
        component: (
          <div className="HydroSDK-optionItem">
            <Svg name="logo" />
            {HydroWallet.LABEL}
          </div>
        ),
        onSelect: (option: Option) => {
          this.setState({
            selectedWalletType: option.value,
            step: STEPS.SELECT
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
            selectedWalletType: HydroWallet.TYPE,
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
    extensionWalletSupported: walletState.get("extensionWalletSupported"),
    isShowWalletModal: walletState.get("isShowWalletModal")
  };
})(Wallet);
