import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Wallet, WalletReducer, WalletButton } from "hydro-sdk-wallet";
import thunk from "redux-thunk";

const dest = document.getElementById("content");
const reducer = combineReducers({
  WalletReducer
});

const enhancers = [];
if (window.devToolsExtension) {
  enhancers.push(window.devToolsExtension());
}

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    ...enhancers
  )
);

let render = () => {
  // const SimpleForm = require("./SimpleForm").default;
  // const readme = require("./Simple.md");
  //   const raw = require("!!raw-loader!./SimpleForm");
  ReactDOM.render(
    <Provider store={store}>
      <h2>Basic</h2>
      <Wallet title="Basic Wallet Demo" nodeUrl="http://localhost:8545" />
      <WalletButton />
    </Provider>,
    dest
  );
};

render();
