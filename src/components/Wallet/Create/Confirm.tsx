import * as React from "react";
import { connect } from "react-redux";
import { setWalletStep, WALLET_STEPS, loadHydroWallet } from "../../../actions/wallet";
import { WalletState } from "../../../reducers/wallet";
import { HydroWallet } from "../../../wallets";

interface Props {
  dispatch: any;
  wallet: HydroWallet;
  password: string;
}

interface State {
  checkbox: boolean[];
  processing: boolean;
}

const mapStateToProps = (state: any) => {
  const walletState: WalletState = state.WalletReducer;
  const walletCache = walletState.get("walletCache");
  return {
    wallet: walletCache.wallet,
    password: walletCache.password
  };
};

class CreateConfirm extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checkbox: [false, false, false, false],
      processing: false
    };
  }

  public render() {
    const { checkbox, processing } = this.state;
    return (
      <div className="HydroSDK-confirm">
        {this.renderConfirmCheckbox()}
        <div className="HydroSDK-desc">
          Please read and confirm the important terms above on using your browser wallet.
        </div>
        <button
          className="HydroSDK-submitButton HydroSDK-featureButton"
          type="submit"
          onClick={() => this.handleSubmit()}
          disabled={checkbox.indexOf(false) !== -1 || processing}>
          {processing ? <i className="HydroSDK-fa fa fa-spinner fa-spin" /> : null} Create
        </button>
      </div>
    );
  }

  public async handleSubmit() {
    const { dispatch, wallet, password } = this.props;
    this.setState({ processing: true });
    await wallet.save(password);
    await dispatch(loadHydroWallet(wallet));
    this.setState({ processing: false });
    dispatch(setWalletStep(WALLET_STEPS.ADD_FUNDS));
  }
  public renderConfirmCheckbox() {
    const { checkbox } = this.state;
    const createConfirm = [
      "I understand that my funds are held securely on this browser and not by Hydro Wallet.",
      "I will make sure to back up this wallet's Password in combination with its Recovery Phrase.",
      "I understand that if I cleared my browsing data (browsing history, cookies, cached images and files, etc.), my local wallet would be deleted.",
      "I understand that if I delete my browser wallet, I will have to import my wallet using this wallet's Recovery Phrase to recover wallet."
    ];
    const nodes = checkbox.map((checked: boolean, index: number) => {
      return (
        <div
          key={index}
          className={`HydroSDK-checkboxDiv ${checked ? "checked" : ""}`}
          onClick={() => this.handleCheck(index)}>
          <div className="HydroSDK-checkbox">
            <i className="fa fa-check" />
          </div>
          {createConfirm[index]}
        </div>
      );
    });
    return <div className="HydroSDK-checkboxGroup">{nodes}</div>;
  }

  public handleCheck(index: number) {
    const { checkbox: oldCheckbox } = this.state;
    let checkbox = oldCheckbox.slice();
    checkbox[index] = !oldCheckbox[index];

    this.setState({ checkbox });
  }
}

export default connect(mapStateToProps)(CreateConfirm);
