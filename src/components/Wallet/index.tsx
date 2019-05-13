import * as React from "react";
import { connect } from "react-redux";
import WalletSelector from "./WalletSelector";
import Create from "./Create";
import Confirm from "./Create/Confirm";
import Backup from "./Create/Backup";
import AddFunds from "./Create/AddFunds";
import Import from "./Import";
import Input from "./Input";
import Select, { Option } from "./Select";
import * as qrImage from "qr-image";
import { HydroWallet, ExtensionWallet, WalletConnectWallet, WalletTypes, setNodeUrl } from "../../wallets";
import { WalletProps, WalletState, AccountState } from "../../reducers/wallet";
import { getSelectedAccount } from "../../selector/wallet";
import {
  hideWalletModal,
  loadExtensitonWallet,
  loadHydroWallets,
  loadWalletConnectWallet,
  unlockBrowserWalletAccount,
  WALLET_STEPS,
  setWalletStep,
  deleteBrowserWalletAccount
} from "../../actions/wallet";
import Svg from "../Svg";

interface State {
  password: string;
  processing: boolean;
  selectedWalletType: string;
  checkbox: boolean;
}

interface Props extends WalletProps {
  dispatch: any;
  nodeUrl: string;
  title?: string;
  desc?: string;
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
    } else if (defaultWalletType && WalletTypes.indexOf(defaultWalletType) > -1) {
      selectedWalletType = defaultWalletType;
    } else {
      selectedWalletType = ExtensionWallet.TYPE;
    }

    this.state = {
      selectedWalletType,
      password: "",
      processing: false,
      checkbox: false
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
    const { isShowWalletModal, title, dispatch, desc } = this.props;

    return (
      <div className="HydroSDK-wallet">
        <div className="HydroSDK-container" hidden={!isShowWalletModal}>
          <div className="HydroSDK-backdrop" onClick={() => dispatch(hideWalletModal())} />
          <div className="HydroSDK-dialog">
            <div className="HydroSDK-title">{title || "Hydro SDK Wallet"}</div>
            {desc && <div className="HydroSDK-desc">{desc}</div>}
            <div className="HydroSDK-fieldGroup">
              <div className="HydroSDK-label">Select Wallet Type</div>
              <Select options={this.getWalletsOptions()} selected={selectedWalletType} />
            </div>
            {this.renderStepContent()}
            {this.renderUnlockForm()}
            {this.renderDeleteForm()}
            <button className="HydroSDK-closeButton" onClick={() => dispatch(hideWalletModal())}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  private renderStepContent() {
    const { selectedWalletType } = this.state;
    const { extensionWalletSupported, accounts, step } = this.props;
    switch (step) {
      case WALLET_STEPS.SELECT:
      case WALLET_STEPS.DELETE:
        if (selectedWalletType === WalletConnectWallet.TYPE) {
          const account = accounts.get(WalletConnectWallet.TYPE)!;
          if (account.get("isLocked")) return this.renderQrImage();
        }

        return (
          <WalletSelector
            walletIsSupported={selectedWalletType === ExtensionWallet.TYPE ? extensionWalletSupported : true}
            walletType={selectedWalletType}
          />
        );
      case WALLET_STEPS.CREATE:
        return <Create />;
      case WALLET_STEPS.CREATE_CONFIRM:
        return <Confirm />;
      case WALLET_STEPS.BACKUP:
        return <Backup />;
      case WALLET_STEPS.ADD_FUNDS:
        return <AddFunds />;
      case WALLET_STEPS.IMPORT:
        return <Import />;
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
    const { password, selectedWalletType, processing } = this.state;
    const { selectedAccount, step } = this.props;
    if (
      selectedWalletType !== HydroWallet.TYPE ||
      (step !== WALLET_STEPS.SELECT && step !== WALLET_STEPS.DELETE) ||
      !selectedAccount ||
      !selectedAccount.get("isLocked")
    ) {
      return null;
    }

    return (
      <>
        <Input label="Password" text={password} handleChange={(password: string) => this.setState({ password })} />
        <button
          className="HydroSDK-submitButton HydroSDK-featureButton"
          disabled={processing}
          onClick={() => this.handleUnlock(selectedAccount)}>
          {processing ? <i className="HydroSDK-fa fa fa-spinner fa-spin" /> : null} Unlock
        </button>
      </>
    );
  }

  private renderDeleteForm() {
    const { checkbox, processing, selectedWalletType } = this.state;
    const { selectedAccount, step } = this.props;
    if (
      !selectedAccount ||
      selectedAccount.get("isLocked") ||
      step !== WALLET_STEPS.DELETE ||
      selectedWalletType !== HydroWallet.TYPE
    ) {
      return null;
    }
    return (
      <>
        <div className="HydroSDK-hint">
          <div className="HydroSDK-hintTitle">
            <i className="HydroSDK-fa fa fa-bullhorn" />
            Heads up!
          </div>
          <span>
            Before you proceed, please make sure you have backed up your wallet. If you haven’t, you will permanently
            lose access to this wallet and all funds within it. Once you click Delete, the deletion will occur.
          </span>
          <div
            className={`HydroSDK-checkboxDiv ${checkbox ? "checked" : ""}`}
            onClick={() => this.setState({ checkbox: !checkbox })}>
            <div className="HydroSDK-checkbox">
              <i className="fa fa-check" />
            </div>
            I understand that I will lose all my assets in my wallet if I haven’t backed up this wallet.
          </div>
        </div>
        <button
          className="HydroSDK-submitButton HydroSDK-featureButton"
          disabled={processing || !checkbox}
          onClick={() => this.handleDelete(selectedAccount)}>
          {processing ? <i className="HydroSDK-fa fa fa-spinner fa-spin" /> : null} Delete
        </button>
      </>
    );
  }

  private async handleDelete(selectedAccount: AccountState): Promise<void> {
    try {
      this.setState({ processing: true });
      await this.props.dispatch(deleteBrowserWalletAccount(selectedAccount));
    } catch (e) {
      alert(e);
    } finally {
      this.setState({ processing: false });
    }
  }

  private async handleUnlock(selectedAccount: AccountState): Promise<void> {
    try {
      const { password } = this.state;
      this.setState({ processing: true });
      await this.props.dispatch(unlockBrowserWalletAccount(selectedAccount, password));
    } catch (e) {
      alert(e);
    } finally {
      this.setState({ processing: false });
    }
  }

  private getWalletsOptions(): Option[] {
    const { dispatch } = this.props;
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
          dispatch(setWalletStep(WALLET_STEPS.SELECT));
          this.setState({
            selectedWalletType: option.value
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
          dispatch(setWalletStep(WALLET_STEPS.SELECT));
          this.setState({
            selectedWalletType: option.value
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
          dispatch(setWalletStep(WALLET_STEPS.SELECT));
          this.setState({
            selectedWalletType: option.value
          });
        }
      },
      {
        value: WALLET_STEPS.CREATE,
        component: (
          <div className="HydroSDK-optionItem HydroSDK-walletFeature">
            <Svg name="create" />
            Create Wallet
          </div>
        ),
        onSelect: () => {
          dispatch(setWalletStep(WALLET_STEPS.CREATE));
          this.setState({
            selectedWalletType: HydroWallet.TYPE
          });
        }
      },
      {
        value: WALLET_STEPS.IMPORT,
        component: (
          <div className="HydroSDK-optionItem HydroSDK-walletFeature">
            <Svg name="import" />
            Import Wallet
          </div>
        ),
        onSelect: () => {
          dispatch(setWalletStep(WALLET_STEPS.IMPORT));
          this.setState({
            selectedWalletType: HydroWallet.TYPE
          });
        }
      },
      {
        value: WALLET_STEPS.DELETE,
        component: (
          <div className="HydroSDK-optionItem HydroSDK-walletFeature">
            <Svg name="delete" />
            Delete Wallet
          </div>
        ),
        onSelect: () => {
          dispatch(setWalletStep(WALLET_STEPS.DELETE));
          this.setState({
            selectedWalletType: HydroWallet.TYPE
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
    isShowWalletModal: walletState.get("isShowWalletModal"),
    step: walletState.get("step")
  };
})(Wallet);
