import * as React from "react";
import { HydroWallet } from "../../wallets";
import { connector } from "../../connector";
import Input from "./Input";

interface Props {
  callback: () => any;
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
    const { callback } = this.props;

    e.preventDefault();

    this.setState({ processing: true });
    await HydroWallet.createRandom(password);
    await connector.refreshWatchers();
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
          {processing ? <i className="HydroSDK-loading" /> : null} Create
        </button>
      </form>
    );
  }
}

export default Create;
