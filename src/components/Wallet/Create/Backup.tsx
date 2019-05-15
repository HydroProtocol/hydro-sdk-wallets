import * as React from "react";
import { connect } from "react-redux";
import { WalletState } from "../../../reducers/wallet";
import { HydroWallet } from "../../../wallets";
import { setWalletStep, WALLET_STEPS } from "../../../actions/wallet";
import { translations } from "../../../i18n";

interface Props {
  wallet: HydroWallet;
  dispatch: any;
}

interface State {
  indices: Set<number>;
  testing: boolean;
}

const mapStateToProps = (state: any) => {
  const walletState: WalletState = state.WalletReducer;
  const walletCache = walletState.get("walletCache");
  return {
    wallet: walletCache.wallet
  };
};

class Backup extends React.PureComponent<Props, State> {
  private mnemonic: HTMLElement | null;
  public constructor(props: Props) {
    super(props);
    this.state = {
      indices: new Set(),
      testing: false
    };
    this.mnemonic = null;
  }

  public render() {
    const { testing } = this.state;
    const { wallet } = this.props;
    const handleCopy = (e: any) => {
      e.clipboardData.setData("text/plain", wallet.getMnemonic());
      e.preventDefault();
    };
    return (
      <div className="HydroSDK-backup HydroSDK-fieldGroup">
        <div className="HydroSDK-label">{translations.recoveryPhrase}</div>
        <div className="HydroSDK-mnemonic">
          <ol className="HydroSDK-words" onCopy={e => handleCopy(e)} ref={elem => this.setMnemonicElem(elem)}>
            {this.getMnemonicArray().map((word, index) => this.renderWord(word, index))}
          </ol>
        </div>
        <div className="HydroSDK-desc">{testing ? translations.testingDesc : translations.backupDesc}</div>
        <button
          className="HydroSDK-submitButton HydroSDK-featureButton"
          onClick={() => (testing ? this.confirm() : this.test())}>
          {translations.next}
        </button>
      </div>
    );
  }

  private test() {
    const phraseLength = this.getMnemonicArray().length;

    const indices = new Set();
    while (indices.size < 3) {
      const index = Math.floor(Math.random() * phraseLength);
      indices.add(index);
    }

    this.setState({ indices, testing: true });
  }

  private confirm() {
    const { dispatch } = this.props;

    if (!this.mnemonic) {
      return;
    }

    // Find all inputs with values not equal to id, if any left we can't continue
    if (
      [...this.mnemonic.querySelectorAll<HTMLInputElement>("input")].filter(input => input.value !== input.id).length >
      0
    ) {
      return;
    }
    dispatch(setWalletStep(WALLET_STEPS.CREATE_CONFIRM));
  }

  private renderWord(word: any, index: number) {
    const { indices, testing } = this.state;

    if (testing && indices.has(index)) {
      word = <BackupWord word={word} />;
    }
    return (
      <li key={index} className="HydroSDK-word">
        {word}
      </li>
    );
  }

  private setMnemonicElem(elem: any) {
    this.mnemonic = elem;
  }

  private getMnemonicArray() {
    const { wallet } = this.props;

    return wallet.getMnemonic().split(" ");
  }
}

export default connect(mapStateToProps)(Backup);

interface BackupWordProps {
  word: string;
}

interface BackupWordState {
  className: string;
}

class BackupWord extends React.PureComponent<BackupWordProps, BackupWordState> {
  constructor(props: BackupWordProps) {
    super(props);
    this.state = {
      className: ""
    };
  }

  private handleChange(value: string) {
    if (!value) {
      this.setState({
        className: ""
      });
    } else if (value !== this.props.word) {
      this.setState({
        className: "invalid"
      });
    } else {
      this.setState({
        className: "valid"
      });
    }
  }

  public render() {
    const className = ["HydroSDK-input", this.state.className].filter(cls => !!cls).join(" ");
    return <input id={this.props.word} className={className} onChange={e => this.handleChange(e.target.value)} />;
  }
}
