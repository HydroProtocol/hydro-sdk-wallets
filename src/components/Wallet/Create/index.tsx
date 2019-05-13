import * as React from "react";
import { HydroWallet } from "../../../wallets";
import { connect } from "react-redux";
import Input from "../Input";
import { setWalletStep, WALLET_STEPS, cacheWallet } from "../../../actions/wallet";

interface Props {
  dispatch: any;
}

interface State {
  password: string;
  confirmation: string;
  isConfirm: boolean;
  processing: boolean;
}

class Create extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      password: "",
      confirmation: "",
      isConfirm: true,
      processing: false
    };
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { password, confirmation } = this.state;
    if ((password && confirmation && password !== prevState.password) || confirmation !== prevState.confirmation) {
      this.setState({ isConfirm: password === confirmation });
    }
  }

  private async submit(e: React.FormEvent) {
    const { password, confirmation } = this.state;
    const { dispatch } = this.props;
    e.preventDefault();
    if (password !== confirmation) {
      return;
    }

    this.setState({ processing: true });
    const wallet = await HydroWallet.createRandom(password);
    await dispatch(cacheWallet(wallet, password));
    this.setState({ processing: false });
    dispatch(setWalletStep(WALLET_STEPS.BACKUP));
  }

  public render() {
    const { password, confirmation, isConfirm, processing } = this.state;
    return (
      <form className="HydroSDK-form" onSubmit={e => this.submit(e)}>
        <Input label="Password" text={password} handleChange={(password: string) => this.setState({ password })} />
        <Input
          label="Confirm"
          errorMsg={isConfirm ? "" : "Confirmation must match"}
          text={confirmation}
          handleChange={(confirmation: string) => this.setState({ confirmation })}
        />
        <div className="HydroSDK-desc">
          Once you click the Next button you will be taken through the wallet creation process. ***Please complete all
          three steps, or your wallet will NOT be created.***
        </div>
        <button
          className="HydroSDK-submitButton HydroSDK-featureButton"
          type="submit"
          disabled={processing || !password || password !== confirmation}>
          {processing ? <i className="HydroSDK-fa fa fa-spinner fa-spin" /> : null} Next
        </button>
      </form>
    );
  }
}

export default connect()(Create);
