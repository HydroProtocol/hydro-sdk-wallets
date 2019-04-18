import * as React from "react";
import { HydroWallet } from "../../wallets";
import Input from "./Input";
import { connect } from "react-redux";
import { loadHydroWallet } from "../../actions/wallet";

interface Props {
  callback: () => any;
  dispatch: any;
}

interface State {
  password: string;
  privateKey: string;
  processing: boolean;
}

class Import extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      password: "",
      privateKey: "",
      processing: false
    };
  }

  private async submit(e: React.FormEvent) {
    let { password, privateKey } = this.state;
    const { callback, dispatch } = this.props;

    e.preventDefault();

    this.setState({ processing: true });

    if (privateKey && privateKey.slice(0, 2).toLocaleLowerCase() !== "0x") {
      privateKey = "0x" + privateKey;
    }

    try {
      if (!privateKey) {
        throw "private key is empty";
      }

      if (privateKey.length != 66) {
        throw "private key format is wrong. ";
      }

      if (!password) {
        throw "password is empty";
      }

      const wallet = await HydroWallet.import(privateKey, password);
      await dispatch(loadHydroWallet(wallet));
      callback();
    } catch (e) {
      alert(e);
    } finally {
      this.setState({ processing: false });
    }
  }

  public render() {
    const { password, privateKey, processing } = this.state;
    return (
      <form className="HydroSDK-form" onSubmit={e => this.submit(e)}>
        <Input
          label="Private Key"
          text={privateKey}
          handleChange={(privateKey: string) => this.setState({ privateKey })}
        />
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
          {processing ? (
            <i className="HydroSDK-fa fa fa-spinner fa-spin" />
          ) : null}{" "}
          Import
        </button>
      </form>
    );
  }
}

export default connect()(Import);
