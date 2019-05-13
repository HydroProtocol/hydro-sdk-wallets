import * as React from "react";
import { connect } from "react-redux";
import { setWalletStep, WALLET_STEPS } from "../../../actions/wallet";
import Svg from "../../Svg";

interface Props {
  dispatch: any;
}

class AddFunds extends React.PureComponent<Props, any> {
  public render() {
    return (
      <div className="HydroSDK-addFunds">
        <div className="HydroSDK-buttonGroup">
          <a href="https://www.coinbase.com" target="_blank" rel="noopener noreferrer">
            <div className="button coinbase">
              <Svg name="Coinbase" />
            </div>
          </a>
          <a href="https://gemini.com/" target="_blank" rel="noopener noreferrer">
            <div className="button gemini">
              <Svg name="Gemini" />
            </div>
          </a>
        </div>
        <div className="HydroSDK-desc">
          There are multiple ways to add funds to your browser wallet. If you already have Ethereum or Wrapped Ethereum,
          simply transfer to your DDEX wallet's public address. If you do not already have Ethereum, you can purchase
          some from a variety of platforms. We've linked a few for your convenience.
        </div>
        <button
          className="HydroSDK-submitButton HydroSDK-featureButton"
          onClick={() => this.props.dispatch(setWalletStep(WALLET_STEPS.SELECT))}>
          Done
        </button>
      </div>
    );
  }
}

export default connect()(AddFunds);
