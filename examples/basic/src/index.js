import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { Wallet, WalletReducer } from "hydro-sdk-wallet";

const dest = document.getElementById("content");
const reducer = combineReducers({
  WalletReducer
});

const store = (window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore)(reducer);

let render = () => {
  // const SimpleForm = require("./SimpleForm").default;
  // const readme = require("./Simple.md");
  //   const raw = require("!!raw-loader!./SimpleForm");
  ReactDOM.render(
    <Provider store={store}>
      <h2>Basic</h2>
      <Wallet />
    </Provider>,
    dest
  );
};

render();
