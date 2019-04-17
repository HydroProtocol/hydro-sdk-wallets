import * as React from "react";
import { HydroWallet } from "../../wallets";
import { connect } from "react-redux";
import Input from "./Input";
import { loadHydroWallet } from "../../actions/wallet";

interface Props {
  callback: () => any;
  dispatch: any;
}

interface State {
  password: string;
  processing: boolean;
}

class Create extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      password: "",
      processing: false
    };
  }

  private async submit(e: React.FormEvent) {
    const { password } = this.state;
    const { callback, dispatch } = this.props;

    e.preventDefault();

    this.setState({ processing: true });
    const wallet = await HydroWallet.createRandom(password);
    await dispatch(loadHydroWallet(wallet));
    callback();
  }

  public render() {
    const { processing, password } = this.state;
    return (
      <form className="HydroSDK-form" onSubmit={e => this.submit(e)}>
        <Input
          label="Password"
          text={password}
          handleChange={(password: string) => this.setState({ password })}
        />
        <button
          className="HydroSDK-submitButton HydroSDK-featureButton"
          type="submit"
          disabled={processing}
        >
          {processing ? <i className="HydroSDK-fa HydroSDK-loading" /> : null}{" "}
          Create
        </button>
      </form>
    );
  }
}

export default connect()(Create);
