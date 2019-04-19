# Hydro SDK wallet

**important:** this project is under very active development, and it is not ready for production usage. This warnning will be removed when it is reliable.

## Introduction

Nearly every dapp needs to connect to a crypto wallet.There are many options such as metamask, ledger. Hydro sdk wallet makes it easier to integrate different kinds of wallets together, and give an uniform interfaces to interative with them.

Hydro SDK wallet also support browser local wallets. Secrets are saved in browser localstorage under your domain.

There is a default ui in this package. You can also implement another ui as you wish.

![web-screen-shot](./assets/example.png)

### Support wallets:

- Metamask
- Browser Local Wallet

### Will support:

- Ledger Wallet
- Wallet Connect Protocol
- Trust Wallet
- Coinbase Wallet
- Imtoken Wallet

## Basic Usage Guide

This package requires `React` and `Redux`.

### Step1: install npm package

`npm i @gongddex/hydro-sdk-wallet`

### Step2: Wallet Reducer

The store should know how to handle actions coming from the wallet components. To enable this, we need to pass the `walletReducer` to your store.

```javascript
import { createStore, combineReducers } from "redux";
import { walletReducer } from "@gongddex/hydro-sdk-wallet";

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass walletReducer under 'walletReducer' key
  walletReducer
});

const store = createStore(rootReducer);
```

### Step3: Wallet Component

To make the wallet logic work. We need to mount the `Wallet` and `WalletButton` components into your app. They should be mount into `Provider`(see more details about Provider in [react-redux](https://github.com/reduxjs/react-redux)). When the components is initialized, some monitors will start to work as well. They are monitoring the web3 wallet status(not installed, locking, account changed), ledger status(locked or not), and balances of all available addresses. You can config wallet through props. See more datials are in the api section below.

```javascript
import React from "react";
import { Provider } from "react-redux";
import { Wallet, WalletButton } from "@gongddex/hydro-sdk-wallet";
import { store } from "./store";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        // ... your components
        <Wallet nodeURL="https://mainnet.infura.io" />
        <WalletButton />
      </Provider>
    );
  }
}
```

### Step4: Use Account

We can get the current selected account by using selector functions.

```javascript
import React from "react";
import { connect } from "react-redux";

class App extends React.Component {
  signMessage = async () => {
    const { currentAccount } = this.props;
    const signature = await currentAccount.wallet.personalSign("test message");
    console.log(signature);
  };

  render() {
    return (
      <div>
        <button onClick={this.signMessage} />
      </div>
    );
  }
}
export default connect(state => {
  return {
    currentAccount: getSelectedAccount(state)
  };
})(App);
```

## API

### Wallet Component Props

| Name              | Type   | Default                   | Desc                                                                           |
| ----------------- | ------ | ------------------------- | ------------------------------------------------------------------------------ |
| nodeURL           | string | `https://mainnet.ddex.io` | Ethereum JSON RPC Endpoint                                                     |
| defaultWalletType | string | `Extension Wallet`        | default selected wallet type. Options are `Extension Wallet`, `Browser Wallet` |

### Selectors

Methods to get data from redux store.

- `getAccount(state, accountID)` Return the corresponding account
- `getSelectedAccount(state)` Return the selected account
- `getAccounts(state)` Return all available accounts
- `getSelectedAccountWallet(state)` Return the wallet of selected account
- `getWallet(state, type)` Return the wallet of corresponding account

### Action creators

These functions are redux action creators. You need to dispatch the result to store.

- `selectAccount(accountID)` Change Selected Account
- `unlockBrowserWalletAccount(accountID, password)` Unlock a browser local wallet
- `showWalletModal()` Show the wallets modal
- `hideWalletModal()` Hide the wallets modal

### Account functions

When we get an account from redux store, we can call some functions of `account.wallet` object.

- `personalSignMessage(message: string | Uint8Array, address: string)` Sign message
- `sendTransaction({ to: "0x0123..3410", value: "0x123", data: "", gasPrice: "0x312", gasLimit: 190000, nonce: "0x3"})` Sign and send the transaction, return value is the transaction hash.
- `getTransactionReceipt(transactionHash: string)` Get the receipt of a transaction.

## Try the examples

There are some examples projects. You can find commands to start these examples in package.json and source code in examples dir.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details
