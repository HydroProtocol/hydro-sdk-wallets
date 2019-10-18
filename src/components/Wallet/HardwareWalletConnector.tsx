import * as React from "react";
import { connect } from "react-redux";
import { truncateAddress, getBalance, HardwareWallet } from "../../wallets";
import { getAccount } from "../..";
import { selectAccount } from "../../actions/wallet";
import Select, { Option } from "./Select";
import { BigNumber } from "bignumber.js";
import ReactPaginate from "react-paginate";
import { WalletState } from "../../reducers/wallet";
import NotSupport from "./NotSupport";
import copy from "clipboard-copy";

interface Props {
  dispatch: any;
  wallet: HardwareWallet | null;
  walletClass: typeof HardwareWallet;
  isLocked: boolean;
  walletTranslations: { [key: string]: any };
  copyCallback?: (text: string) => any;
}

interface State {
  loading: boolean;
  addresses: { [key: string]: string };
  balances: { [key: string]: BigNumber };
  pathRule: string;
  path: string;
  index: number;
  currentAddress: string | null;
  currentPage: number;
  gotoPageInputValue: number;
}

const mapStateToProps = (state: { WalletReducer: WalletState }, ownProps: { walletClass: typeof HardwareWallet }) => {
  const account = getAccount(state, ownProps.walletClass.TYPE);
  return {
    wallet: account ? (account.get("wallet") as HardwareWallet) : null,
    isLocked: account ? account.get("isLocked") : true,
    walletTranslations: state.WalletReducer.get("walletTranslations")
  };
};

class HardwareWalletConnector extends React.PureComponent<Props, State> {
  private loadAddressesRequestingCount: number = 0;
  private defaultState = {
    loading: false,
    index: 0,
    currentPage: 0,
    addresses: {},
    balances: {},
    currentAddress: null,
    gotoPageInputValue: 1
  };
  public constructor(props: Props) {
    super(props);
    this.state = { ...this.defaultState, pathRule: "", path: "" };
  }

  public componentDidMount() {
    const { wallet } = this.props;
    const { addresses } = this.state;
    if (wallet && wallet.connected) {
      this.loadAddresses();
    }
    if (addresses) {
      this.loadBalances();
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { wallet } = this.props;
    const { addresses, index, pathRule } = this.state;
    if (wallet && wallet !== prevProps.wallet) {
      if (wallet !== prevProps.wallet) {
        this.setState({ ...this.defaultState, pathRule: wallet.currentPathRule, path: wallet.currentPath });
      }
    } else if (
      wallet &&
      wallet.connected &&
      (Object.values(addresses).length === 0 ||
        wallet !== prevProps.wallet ||
        index !== prevState.index ||
        (wallet.getPathType(pathRule) !== wallet.CUSTOMIZAION_PATH && pathRule !== prevState.pathRule))
    ) {
      this.loadAddresses();
    }

    if (addresses !== prevState.addresses) {
      this.loadBalances();
    }
  }

  public render() {
    return <div className="HydroSDK-ledger">{this.renderContent()}</div>;
  }

  private renderContent() {
    const { isLocked, walletTranslations, copyCallback, wallet, walletClass } = this.props;
    if (isLocked || !wallet) {
      const walletType = walletClass.TYPE.toLocaleLowerCase();
      return (
        <NotSupport
          iconName={walletType}
          title={walletTranslations.connectHardwareWallet[walletType].title}
          desc={walletTranslations.connectHardwareWallet[walletType].desc}
        />
      );
    }
    const { loading, currentAddress, pathRule } = this.state;
    const addressOptions = this.getAddressOptions();
    const pathOptions = this.getPathOptions();

    return (
      <>
        <div className="HydroSDK-fieldGroup">
          <div className="HydroSDK-label">{walletTranslations.selectPath}</div>
          <Select
            options={pathOptions}
            disabled={loading}
            selected={pathRule}
            blank={<div className="HydroSDK-pathItem">Customization</div>}
            onSelect={this.selectPathType}
          />
        </div>
        {wallet.getPathType(pathRule) === wallet.CUSTOMIZAION_PATH && this.renderCustomizedPath()}
        <div className="HydroSDK-fieldGroup">
          <div className="HydroSDK-label">
            {walletTranslations.selectAddress}{" "}
            {currentAddress && (
              <i
                className="HydroSDK-copy HydroSDK-fa fa fa-clipboard"
                onClick={async () => {
                  if (currentAddress) {
                    await copy(currentAddress);
                    if (copyCallback) {
                      copyCallback(currentAddress);
                    } else {
                      alert("Copied to clipboard!");
                    }
                  }
                }}
              />
            )}
          </div>
          <Select
            options={addressOptions}
            selected={!loading && currentAddress}
            noCaret={loading || addressOptions.length === 0}
            disabled={loading || addressOptions.length === 0}
            footer={this.renderFooter()}
            blank={
              loading || addressOptions.length === 0 ? (
                <i className="fa fa-spinner fa-spin" />
              ) : (
                walletTranslations.pleaseSelectAddress
              )
            }
          />
        </div>
      </>
    );
  }

  private renderCustomizedPath() {
    const { loading, pathRule } = this.state;
    const { walletTranslations, wallet } = this.props;
    if (!wallet) {
      return null;
    }
    return (
      <div className="HydroSDK-fieldGroup">
        <div className="HydroSDK-label">{walletTranslations.inputPath}</div>
        <div className="HydroSDK-customizationInputGroup">
          <span>{wallet.PREFIX_ETHEREUM_PATH}</span>
          <input
            className="HydroSDK-input"
            placeholder={"0"}
            defaultValue={
              wallet.getPathType(pathRule) === wallet.CUSTOMIZAION_PATH
                ? pathRule.replace(wallet.PREFIX_ETHEREUM_PATH, "")
                : ""
            }
            onChange={this.handleChangeCustomizedPath.bind(this)}
          />
          <button
            className="HydroSDK-button HydroSDK-featureButton"
            disabled={loading}
            onClick={() => this.loadAddresses()}>
            {loading ? <i className="HydroSDK-fa fa fa-spinner fa-spin" /> : null} {walletTranslations.loadAccounts}
          </button>
        </div>
      </div>
    );
  }

  private handleChangeCustomizedPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { wallet } = this.props;
    if (!wallet) {
      return;
    }
    const pathRule = event.target.value;
    this.setState({ pathRule });
  };

  private selectPathType = (selectedOption: Option) => {
    const pathRule = selectedOption.value;
    this.setState({ pathRule });
  };

  private getPathOptions() {
    const { wallet } = this.props;
    if (!wallet) {
      return [];
    }
    return Object.keys(wallet.PATH_TYPE)
      .map(key => {
        return {
          value: wallet.PATH_TYPE[key],
          component: <div className="HydroSDK-pathItem">{wallet.PATH_TYPE_NAME[key]}</div>
        };
      })
      .concat({
        value: wallet.PREFIX_ETHEREUM_PATH + "0",
        component: <div className="HydroSDK-pathItem">Customization</div>
      });
  }

  private getAddressOptions() {
    const { addresses, balances } = this.state;
    const addressOptions: Option[] = [];
    Object.keys(addresses).map((path: string) => {
      const address = addresses[path];
      const balance = balances[address];
      addressOptions.push({
        value: address,
        component: (
          <div className="HydroSDK-address-option">
            <span>
              <i className="HydroSDK-fa fa fa-check" />
              {truncateAddress(address)}
              <span className="HydroSDK-label">({path})</span>
            </span>
            <span>
              {balance ? balance.div(1e18).toFixed(5) : <i className="HydroSDK-fa fa fa-spinner fa-spin" />} ETH
            </span>
          </div>
        ),
        onSelect: () => {
          this.selectAccount(address, path);
        }
      });
    });
    return addressOptions;
  }

  private renderFooter() {
    const { currentPage, gotoPageInputValue } = this.state;
    const { walletTranslations } = this.props;
    return (
      <>
        <ReactPaginate
          key={currentPage}
          initialPage={currentPage}
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={10000}
          marginPagesDisplayed={0}
          pageRangeDisplayed={2}
          onPageChange={this.changePage.bind(this)}
          containerClassName={"HydroSDK-pagination"}
          breakClassName={"break-me"}
          activeClassName={"active"}
        />
        <div className="HydroSDK-paginationGotoPage">
          {walletTranslations.goToPage}
          <form onSubmit={this.gotoPageSubmit.bind(this)}>
            <input
              className="HydroSDK-input"
              type="number"
              min="1"
              step="1"
              value={gotoPageInputValue}
              onChange={event => this.setState({ gotoPageInputValue: parseInt(event.target.value, 10) })}
            />
          </form>
        </div>
      </>
    );
  }

  private gotoPageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { gotoPageInputValue } = this.state;
    const { wallet } = this.props;
    if (!wallet) {
      return;
    }
    const pageNumber = Number(gotoPageInputValue) - 1;
    this.setState({
      currentPage: pageNumber,
      index: pageNumber * wallet.PER_PAGE
    });
  };

  private changePage = ({ selected }: { [key: string]: any }) => {
    const { wallet } = this.props;
    if (!wallet) {
      return;
    }
    this.setState({
      currentPage: selected,
      index: selected * wallet.PER_PAGE
    });
  };

  private async loadAddresses() {
    const { wallet } = this.props;
    if (!wallet) {
      return;
    }
    const { index } = this.state;
    let addresses: { [key: string]: string } = {};
    try {
      this.setState({ loading: true });
      this.loadAddressesRequestingCount += 1;
      addresses = await wallet.getAddressesWithPath(this.getRealPathRule(), index, wallet.PER_PAGE);
    } catch (e) {
      throw e;
    } finally {
      this.loadAddressesRequestingCount -= 1;
      if (this.loadAddressesRequestingCount === 0) {
        this.setState({ addresses, loading: false });
      }
    }
  }

  private getRealPathRule() {
    const { wallet } = this.props;
    const { pathRule } = this.state;
    if (!wallet) {
      return pathRule;
    }
    return pathRule.includes(wallet.PREFIX_ETHEREUM_PATH) ? pathRule : `${wallet.PREFIX_ETHEREUM_PATH}${pathRule}`;
  }

  public selectAccount(address: string, path: string) {
    const { wallet, dispatch } = this.props;
    if (!wallet) {
      return;
    }
    dispatch(selectAccount(wallet.type(), wallet.type()));
    wallet.setPath(this.getRealPathRule(), path);
    this.setState({ currentAddress: address });
  }

  private loadBalances() {
    const { addresses } = this.state;
    Object.keys(addresses).map(async (path: string) => {
      let { balances } = this.state;
      const address = addresses[path];
      const balance = await getBalance(address);
      balances[address] = new BigNumber(String(balance));
      this.setState({ balances });
      this.forceUpdate();
    });
  }
}

export default connect(mapStateToProps)(HardwareWalletConnector);
