import * as React from "react";
import { connect } from "react-redux";
import WalletSelector from "./WalletSelector";
import Create from "./Create";
import Confirm from "./Create/Confirm";
import Backup from "./Create/Backup";
import AddFunds from "./Create/AddFunds";
import Input from "./Input";
import Select, { Option } from "./Select";
import * as qrImage from "qr-image";
import {
  ExtensionWallet,
  WalletConnectWallet,
  defaultWalletTypes,
  setGlobalNodeUrl,
  Ledger,
  HydroWallet,
  Dcent,
  CoinbaseWallet,
  Fortmatic,
  Trezor,
  Torus
} from "../../wallets";
import { WalletState, AccountState } from "../../reducers/wallet";
import { getSelectedAccount } from "../../selector/wallet";
import {
  hideWalletModal,
  unlockBrowserWalletAccount,
  WALLET_STEPS,
  setWalletStep,
  deleteBrowserWalletAccount,
  setTranslations,
  loadWallet,
  selectWalletType,
  initCustomLocalWallet,
  setUnit,
  destoryTimer,
  loadCoinbaseWallet,
  loadDcentWallet,
  loadFortmaticWallet,
  loadExtensionWallet,
  loadLedger,
  loadTrezor,
  loadTorus
} from "../../actions/wallet";
import Svg from "../Svg";
import { Map } from "immutable";
import NotSupport from "./NotSupport";
import defaultTranslations from "../../i18n";
import HardwareWalletConnector from "./HardwareWalletConnector";

interface State {
  password: string;
  processing: boolean;
  checkbox: boolean;
}

interface Props {
  dispatch: any;
  nodeUrl?: string;
  defaultWalletType?: string;
  translations?: { [key: string]: any };
  walletTranslations: { [key: string]: any };
  selectedAccount: AccountState | null;
  accounts: Map<string, AccountState>;
  extensionWalletSupported: boolean;
  isShowWalletModal: boolean;
  step: string;
  walletTypes?: string[];
  loadWalletActions?: { [key: string]: any };
  menuOptions?: Option[];
  selectedWalletType: string;
  customLocalWallet?: any;
  LocalWallet: any;
  hideLocalWallet?: boolean;
  unit?: string;
  decimals?: number;
  copyCallback?: (text: string) => any;
  dcent?: any;
  fortmaticApiKey?: string;
  appName?: string;
  appLogoUrl?: string;
  connecting: Map<string, boolean>;
  email?: string;
  host?: string;
}

class Wallet extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { defaultWalletType, translations, dispatch, customLocalWallet, unit, decimals } = this.props;
    dispatch(setTranslations(translations || defaultTranslations));
    if (customLocalWallet) {
      dispatch(initCustomLocalWallet(customLocalWallet));
    }
    if (unit && typeof decimals === "number") {
      dispatch(setUnit(unit, decimals));
    }

    let selectedWalletType: string;
    const lastSelectedWalletType = window.localStorage.getItem("HydroWallet:lastSelectedWalletType");

    if (defaultWalletType) {
      selectedWalletType = defaultWalletType;
    } else if (lastSelectedWalletType) {
      selectedWalletType = lastSelectedWalletType;
    } else {
      selectedWalletType = defaultWalletTypes[0];
    }
    dispatch(selectWalletType(selectedWalletType));

    this.state = {
      password: "",
      processing: false,
      checkbox: false
    };
  }

  public componentDidMount() {
    const { nodeUrl, email, host } = this.props;
    if (typeof window !== "undefined") {
      const TrezorConnect = require("trezor-connect").default;
      TrezorConnect.manifest({
        email: email || "developer@xyz.com",
        appUrl: host || "http://your.application.com"
      });
    }

    if (nodeUrl) {
      setGlobalNodeUrl(nodeUrl);
    }
    this.loadWallets();
  }

  public componentDidUpdate(prevProps: Props) {
    const { selectedAccount, isShowWalletModal, dispatch, translations } = this.props;
    if (!isShowWalletModal && isShowWalletModal !== prevProps.isShowWalletModal && selectedAccount) {
      const wallet = selectedAccount.get("wallet");
      dispatch(selectWalletType(wallet.type()));
    }

    if (translations && translations !== prevProps.translations) {
      dispatch(setTranslations(translations));
    }
  }

  public componentWillUnmount() {
    destoryTimer();
  }

  private loadWallets() {
    const { dispatch, walletTypes, loadWalletActions } = this.props;
    const types = walletTypes ? walletTypes : defaultWalletTypes;
    types.map(type => {
      const loadWalletAction = loadWalletActions ? loadWalletActions[type] : null;
      dispatch(loadWallet(type, loadWalletAction));
    });
  }

  public render() {
    const { isShowWalletModal, dispatch, walletTranslations, selectedWalletType } = this.props;

    return (
      <div className="HydroSDK-wallet">
        <div className="HydroSDK-container" hidden={!isShowWalletModal}>
          <div className="HydroSDK-backdrop" onClick={() => dispatch(hideWalletModal())} />
          <div className="HydroSDK-dialog">
            <div className="HydroSDK-title">{walletTranslations.dialogTitle}</div>
            {walletTranslations.dialogSubtitle && (
              <div className="HydroSDK-desc">{walletTranslations.dialogSubtitle}</div>
            )}
            <div className="HydroSDK-fieldGroup">
              <div className="HydroSDK-label">{walletTranslations.selectWallet}</div>
              <Select options={this.getWalletsOptions()} selected={selectedWalletType} />
            </div>
            {this.renderStepContent()}
            {this.renderUnlockForm()}
            {this.renderDeleteForm()}
            {this.renderFeatureButton()}
            {this.renderDesc()}
            <button className="HydroSDK-button HydroSDK-closeButton" onClick={() => dispatch(hideWalletModal())}>
              {walletTranslations.close}
            </button>
          </div>
        </div>
      </div>
    );
  }

  private renderDesc() {
    const { selectedWalletType, walletTranslations, selectedAccount } = this.props;
    let title = "",
      desc = "";
    if (selectedWalletType) {
      let statusKey = "notConnect";
      const wallet = selectedAccount ? selectedAccount.get("wallet") : null;
      if (wallet && wallet.type() === selectedWalletType) {
        statusKey = "connected";
      }
      const key = selectedWalletType.toLowerCase();
      const walletDesc = walletTranslations.walletDesc[statusKey][key];
      if (walletDesc) {
        title = walletDesc.title;
        desc = walletDesc.desc;
      }
    }
    return (
      <div className="HydroSDK-walletDesc">
        <div className="HydroSDK-walletDescTitle">{title}</div>
        <div className="HydroSDK-walletDescDesc" dangerouslySetInnerHTML={{ __html: desc }} />
      </div>
    );
  }

  private renderFeatureButton() {
    const { selectedWalletType, walletTranslations, accounts, connecting } = this.props;
    const account = accounts.get(selectedWalletType);
    const address = account ? account.get("address") : null;
    const isLocked = account ? account.get("isLocked") : true;
    if (address && !isLocked) {
      return null;
    }

    if (
      selectedWalletType === Dcent.TYPE ||
      selectedWalletType === CoinbaseWallet.TYPE ||
      selectedWalletType === Fortmatic.TYPE ||
      selectedWalletType === ExtensionWallet.TYPE ||
      selectedWalletType === Ledger.TYPE ||
      selectedWalletType === Trezor.TYPE ||
      selectedWalletType === Torus.TYPE
    ) {
      const isConnecting = connecting.get(selectedWalletType, false);
      return (
        <button
          className="HydroSDK-button HydroSDK-featureButton HydroSDK-submitButton"
          onClick={() => this.connectBridge()}
          disabled={isConnecting}>
          {isConnecting ? <i className="HydroSDK-fa fa fa-spinner fa-spin" /> : null} {walletTranslations.connect}
        </button>
      );
    }

    return null;
  }

  private connectBridge() {
    const { selectedWalletType, dispatch, dcent, appName, appLogoUrl, fortmaticApiKey } = this.props;

    if (selectedWalletType === CoinbaseWallet.TYPE) {
      dispatch(loadCoinbaseWallet(appName, appLogoUrl));
    } else if (selectedWalletType === Dcent.TYPE && dcent) {
      dispatch(loadDcentWallet(dcent));
    } else if (selectedWalletType === Fortmatic.TYPE && fortmaticApiKey) {
      dispatch(loadFortmaticWallet(fortmaticApiKey));
    } else if (selectedWalletType === ExtensionWallet.TYPE && window.ethereum) {
      dispatch(loadExtensionWallet());
    } else if (selectedWalletType === Ledger.TYPE) {
      dispatch(loadLedger());
    } else if (selectedWalletType === Trezor.TYPE) {
      dispatch(loadTrezor());
    } else if (selectedWalletType === Torus.TYPE) {
      dispatch(loadTorus());
    }
  }

  private renderStepContent() {
    const {
      extensionWalletSupported,
      accounts,
      step,
      walletTranslations,
      selectedWalletType,
      copyCallback
    } = this.props;
    switch (step) {
      case WALLET_STEPS.SELECT:
      case WALLET_STEPS.DELETE:
        if (selectedWalletType === WalletConnectWallet.TYPE) {
          const account = accounts.get(WalletConnectWallet.TYPE);
          if (account && account.get("isLocked")) return this.renderQrImage();
        } else if (selectedWalletType === Ledger.TYPE) {
          return <HardwareWalletConnector copyCallback={copyCallback} walletClass={Ledger} />;
        } else if (selectedWalletType === Trezor.TYPE) {
          return <HardwareWalletConnector copyCallback={copyCallback} walletClass={Trezor} />;
        } else if (selectedWalletType === ExtensionWallet.TYPE && !extensionWalletSupported) {
          return (
            <NotSupport
              iconName="metamask"
              title={walletTranslations.installMetamask}
              desc={walletTranslations.installMetamaskDesc}
            />
          );
        } else if (
          selectedWalletType === Dcent.TYPE ||
          selectedWalletType === CoinbaseWallet.TYPE ||
          selectedWalletType === Fortmatic.TYPE ||
          selectedWalletType === Torus.TYPE
        ) {
          const selectedAccount = accounts.get(selectedWalletType);
          const selectedAddress = selectedAccount ? selectedAccount.get("address") : null;
          if (!selectedAddress) {
            return null;
          }
        }
        return <WalletSelector walletType={selectedWalletType} copyCallback={copyCallback} />;
      case WALLET_STEPS.CREATE:
        return <Create />;
      case WALLET_STEPS.CREATE_CONFIRM:
        return <Confirm />;
      case WALLET_STEPS.BACKUP:
        return <Backup />;
      case WALLET_STEPS.ADD_FUNDS:
        return <AddFunds />;
      case WALLET_STEPS.IMPORT:
        return <Create isRecovery={true} />;
      default:
        return null;
    }
  }

  private renderQrImage() {
    const { accounts } = this.props;
    const wallet = accounts.get(WalletConnectWallet.TYPE)!.get("wallet");
    const connector = (wallet as any).connector;

    return (
      <div className="HydroSDK-qr-image">
        <div
          className="HydroSDK-qr-image-bg"
          dangerouslySetInnerHTML={{
            __html: qrImage.imageSync(connector.uri, { type: "svg", ec_level: "L" }).toString()
          }}
        />
      </div>
    );
  }

  private renderUnlockForm() {
    const { password, processing } = this.state;
    const { selectedAccount, step, walletTranslations, selectedWalletType, LocalWallet } = this.props;
    if (
      selectedWalletType !== LocalWallet.TYPE ||
      (step !== WALLET_STEPS.SELECT && step !== WALLET_STEPS.DELETE) ||
      !selectedAccount ||
      !selectedAccount.get("isLocked")
    ) {
      return null;
    }

    return (
      <>
        <Input
          label={walletTranslations.password}
          text={password}
          handleChange={(password: string) => this.setState({ password })}
        />
        <button
          className="HydroSDK-button HydroSDK-submitButton HydroSDK-featureButton"
          disabled={processing}
          onClick={() => this.handleUnlock(selectedAccount)}>
          {processing ? <i className="HydroSDK-fa fa fa-spinner fa-spin" /> : null} {walletTranslations.unlock}
        </button>
      </>
    );
  }

  private renderDeleteForm() {
    const { checkbox, processing } = this.state;
    const { selectedAccount, step, walletTranslations, selectedWalletType, LocalWallet } = this.props;
    if (
      !selectedAccount ||
      selectedAccount.get("isLocked") ||
      selectedAccount.get("wallet").type() !== LocalWallet.TYPE ||
      step !== WALLET_STEPS.DELETE ||
      selectedWalletType !== LocalWallet.TYPE
    ) {
      return null;
    }
    return (
      <>
        <div className="HydroSDK-hint">
          <div className="HydroSDK-hintTitle">
            <i className="HydroSDK-fa fa fa-bullhorn" />
            {walletTranslations.headsUp}
          </div>
          <span>{walletTranslations.deleteTip}</span>
          <div
            className={`HydroSDK-checkboxDiv ${checkbox ? "checked" : ""}`}
            onClick={() => this.setState({ checkbox: !checkbox })}>
            <div className="HydroSDK-checkbox">
              <i className="fa fa-check" />
            </div>
            {walletTranslations.deleteConfirm}
          </div>
        </div>
        <button
          className="HydroSDK-button HydroSDK-submitButton HydroSDK-featureButton"
          disabled={processing || !checkbox}
          onClick={() => this.handleDelete(selectedAccount)}>
          {processing ? <i className="HydroSDK-fa fa fa-spinner fa-spin" /> : null} {walletTranslations.delete}
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
    let { menuOptions, dcent, fortmaticApiKey, accounts, walletTranslations } = this.props;
    if (!menuOptions) {
      const wallet = accounts.getIn([ExtensionWallet.TYPE, "wallet"]);
      const extensionWalletLabel = wallet ? wallet.name() : ExtensionWallet.LABEL;
      menuOptions = [
        {
          value: ExtensionWallet.TYPE,
          component: (
            <div className="HydroSDK-optionItem HydroSDK-noGroup">
              <Svg name="metamask" />
              {extensionWalletLabel}
            </div>
          ),
          onSelect: (option: Option) => this.onSelect(option)
        }
      ];
      if (fortmaticApiKey) {
        menuOptions = menuOptions.concat([
          {
            value: Fortmatic.TYPE,
            component: (
              <div className="HydroSDK-optionItem HydroSDK-noGroup">
                <Svg name="fortmatic" />
                {walletTranslations.usePhoneOrEmail}
                <span className="HydroSDK-text-secondary">
                  {" "}
                  ({walletTranslations.poweredBy} {Fortmatic.LABEL})
                </span>
              </div>
            ),
            onSelect: (option: Option) => this.onSelect(option)
          }
        ]);
      }
      menuOptions = menuOptions.concat([
        {
          value: "hardwareWallets",
          component: <div className="HydroSDK-optionItem HydroSDK-optionType">{walletTranslations.hardwareWallets}</div>
        },
        {
          value: Ledger.TYPE,
          component: (
            <div className="HydroSDK-optionItem">
              <Svg name="ledger" />
              {Ledger.LABEL}
            </div>
          ),
          onSelect: (option: Option) => this.onSelect(option)
        },
        {
          value: Trezor.TYPE,
          component: (
            <div className="HydroSDK-optionItem">
              <Svg name="trezor" />
              {Trezor.LABEL}
            </div>
          ),
          onSelect: (option: Option) => this.onSelect(option)
        }
      ]);
      if (dcent) {
        menuOptions.push({
          value: Dcent.TYPE,
          component: (
            <div className="HydroSDK-optionItem">
              <Svg name="dcent" />
              {Dcent.LABEL}
            </div>
          ),
          onSelect: (option: Option) => this.onSelect(option)
        });
      }
      menuOptions = menuOptions.concat([
        {
          value: "mobileWallets",
          component: <div className="HydroSDK-optionItem HydroSDK-optionType">{walletTranslations.mobileWallets}</div>
        },
        {
          value: WalletConnectWallet.TYPE,
          component: (
            <div className="HydroSDK-optionItem">
              <Svg name="WalletConnect" />
              {WalletConnectWallet.LABEL}
            </div>
          ),
          onSelect: (option: Option) => this.onSelect(option)
        },
        {
          value: CoinbaseWallet.TYPE,
          component: (
            <div className="HydroSDK-optionItem">
              <Svg name="coinbase" />
              {CoinbaseWallet.LABEL}
            </div>
          ),
          onSelect: (option: Option) => this.onSelect(option)
        }
      ]);

      menuOptions = menuOptions.concat([
        {
          value: "oauth",
          component: <div className="HydroSDK-optionItem HydroSDK-optionType">{walletTranslations.oauth}</div>
        },
        {
          value: Torus.TYPE,
          component: (
            <div className="HydroSDK-optionItem">
              <Svg name="torus" />
              {Torus.LABEL}
            </div>
          ),
          onSelect: (option: Option) => this.onSelect(option)
        }
      ]);
    }
    return menuOptions.concat(this.localWalletOptions());
  }

  private onSelect(option: Option) {
    this.props.dispatch(setWalletStep(WALLET_STEPS.SELECT));
    this.props.dispatch(selectWalletType(option.value));
  }

  private localWalletOptions() {
    const { dispatch, walletTranslations, LocalWallet, hideLocalWallet } = this.props;
    if (hideLocalWallet) {
      return [];
    }
    const hydroWalletsCount = LocalWallet.list().length;
    const isEmptyHydroWallet = hydroWalletsCount === 0;
    return [
      {
        value: "localWallets",
        component: <div className="HydroSDK-optionItem HydroSDK-optionType">{walletTranslations.localWallets}</div>
      },
      {
        value: LocalWallet.TYPE,
        component: (
          <div className={`HydroSDK-optionItem${isEmptyHydroWallet ? " disabled" : ""}`}>
            <Svg name="logo" />
            {LocalWallet.LABEL} ({hydroWalletsCount})
          </div>
        ),
        onSelect: (option: Option) => {
          dispatch(setWalletStep(isEmptyHydroWallet ? WALLET_STEPS.CREATE : WALLET_STEPS.SELECT));
          dispatch(selectWalletType(option.value));
        }
      },
      {
        value: WALLET_STEPS.CREATE,
        component: (
          <div className="HydroSDK-optionItem HydroSDK-walletFeature">
            <Svg name="create" />
            {walletTranslations.createWallet}
          </div>
        ),
        onSelect: () => {
          dispatch(setWalletStep(WALLET_STEPS.CREATE));
          dispatch(selectWalletType(LocalWallet.TYPE));
        }
      },
      {
        value: WALLET_STEPS.IMPORT,
        component: (
          <div className="HydroSDK-optionItem HydroSDK-walletFeature">
            <Svg name="import" />
            {walletTranslations.importWallet}
          </div>
        ),
        onSelect: () => {
          dispatch(setWalletStep(WALLET_STEPS.IMPORT));
          dispatch(selectWalletType(LocalWallet.TYPE));
        }
      },
      {
        value: WALLET_STEPS.DELETE,
        component: (
          <div className="HydroSDK-optionItem HydroSDK-walletFeature">
            <Svg name="delete" />
            {walletTranslations.deleteWallet}
          </div>
        ),
        onSelect: () => {
          dispatch(setWalletStep(WALLET_STEPS.DELETE));
          dispatch(selectWalletType(LocalWallet.TYPE));
        }
      }
    ];
  }
}

export default connect((state: any) => {
  const walletState: WalletState = state.WalletReducer;

  return {
    walletTranslations: walletState.get("walletTranslations"),
    selectedAccount: getSelectedAccount(state),
    accounts: walletState.get("accounts"),
    extensionWalletSupported: walletState.get("extensionWalletSupported"),
    isShowWalletModal: walletState.get("isShowWalletModal"),
    step: walletState.get("step"),
    selectedWalletType: walletState.get("selectedWalletType"),
    LocalWallet: walletState.get("LocalWallet") || HydroWallet,
    connecting: walletState.get("connecting")
  };
})(Wallet);
