# Hydro SDK wallet

**important:** this project is under very active development, and it is not ready for production usage. This warnning will be removed when it is reliable. 

## Introduction

Nearly every dapp needs to connect to a crypto wallet.There are many options such as metamask, ledger. Hydro sdk wallet makes it easier to integrate different kinds of wallets together, and give an uniform interfaces to interative with them.

Hydro SDK wallet also support browser local wallets. Secrets are saved in browser localstorage under your domain.

There is a default ui in this package. You can also implement another ui as you wish.

### Support wallets:

- Metamask
- Trust Wallet
- Coinbase Wallet
- Browser Local Wallet
- ImtokenWallet

### Will support:

- Ledger Wallet
- Wallet Connect Protocol

## Basic Usage Guide

This package requires `React` and `Redux`.

### Step1: install npm package

`npm i @hydroprotocol/hydro-sdk-wallet`

### Step2: Wallet Reducer

The store should know how to handle actions coming from the wallet components. To enable this, we need to pass the `walletReducer` to your store. 

```javascript
import { createStore, combineReducers } from 'redux'
import { walletReducer } from '@hydroprotocol/hydor-sdk-wallet'

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass walletReducer under 'walletReducer' key
  walletReducer
})

const store = createStore(rootReducer)

```

### Step3: Wallet Component

To make the wallet logic work. We need to mount the `Wallet` and `WalletButton` components into your app. They should be mount into `Provider`(see more details about Provider in [react-redux](https://github.com/reduxjs/react-redux)). When the components is initialized, some monitors will start to work as well. They are monitoring the web3 wallet status(not installed, locking, account changed), ledger status(locked or not), and balances of all available addresses. You can config wallet through props. See more datials are in the api section below. 

```
import React from 'react'
import { Provider } from "react-redux";
import { Wallet, WalletButton } from '@hydroprotocol/hydro-sdk-wallet'
import { store } from "./store";

class App extends React.Component {
	render() {
		return <Provider store={store}>
			// ... your components
			
			<Wallet nodeURL="https://mainnet.infura.io" />
			<WalletButton />
		</Provider>
	}
}
```

### Step4: Use Account

We can get the current selected account by using selector functions.

```
import React from 'react'
import { connect } from "react-redux";

class App extends React.Component {
    signMessage = async () => {
        const { currentAccount } = this.props;
        const signature = currentAccount.wallet.personalSign("test message")
        console.log(signature)
    }
    
    render() {
        return <div>
	         <button onClick={this.signMessage} />
        </div>;
	}
}
export default connect((state) => {
	return {
		currentAccount: GetSelectAccount(state)
	}
})(App)
```


## API

### Wallet Component Props

| Name | Type | Default | Desc |
|------|----------|---------|------|
|nodeURL| string | `https://mainnet.ddex.io` | Ethereum JSON RPC Endpoint |
|defaultWalletType| string | `Extension` | default selected wallet type. Options are `Extension`, `Local`, `Ledger`, `WalletConnect`. |
|refreshWhenExtensionWalletAddressChanged| boolean | `true` | Reload the app when the address loaded from extension wallet is changed.|
|browserWalletAutoSign|boolean |`false`|Local wallet only. When asking for a signature for a tx or a message, whether popup a dialog to confirm or not.|


### selectors

Methods to get data from redux store.

```
function GetAccounts(state): account[];
function GetSelectAccount(state): account;
```

### action creators

These functions are redux action creators. You need to dispatch the result to store.

```
function SelectAccount(accountID);
function UnlockBrowserLocalAccount(accountID, password);
```

### account functions

We can call the following functions of `account.wallet` object.

```
function personalSign(message): Promise<string>;
function sendTransaction({ to: "", value: "", data: ""}): Promise<string>;
```

## Try the examples

There are some examples projects. You can find commands to start these examples in package.json and source code in examples dir.

## Licence

MIT
