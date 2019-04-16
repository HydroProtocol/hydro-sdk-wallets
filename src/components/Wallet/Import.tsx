import * as React from "react";
import { HydroWallet } from "../../wallets";
import { connector } from "../../connector";
import Input from "./Input";

interface Props {
  callback: () => any;
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
    const { password, privateKey } = this.state;
    const { callback } = this.props;

    e.preventDefault();

    this.setState({ processing: true });
    await HydroWallet.import(privateKey, password);
    await connector.refreshWatchers();
    callback();
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
          {processing ? <i className="HydroSDK-loading" /> : null} Import
        </button>
      </form>
    );
  }
}

export default Import;
