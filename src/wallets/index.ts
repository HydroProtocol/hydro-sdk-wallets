import HydroWallet from "./hydroWallet";
import ExtensionWallet from "./extensionWallet";
import BaseWallet from "./baseWallet";
import WalletConnectWallet from "./WalletConnectWallet";
import request from "request";
import { BigNumber } from "ethers/utils";
import { Contract } from "ethers";
import { JsonRpcProvider } from "ethers/providers";

const { NeedUnlockWalletError, NotSupportedError } = BaseWallet;
let globalNodeUrl = "https://ropsten.infura.io";
export {
  BaseWallet,
  HydroWallet,
  ExtensionWallet,
  NeedUnlockWalletError,
  NotSupportedError,
  WalletConnectWallet
};

export const setNodeUrl = (nodeUrl: string) => {
  HydroWallet.setNodeUrl(nodeUrl);
  globalNodeUrl = nodeUrl;
};

export const truncateAddress = (address: string): string => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const getBalance = (address: string): Promise<BigNumber> => {
  return new Promise((resolve, reject) => {
    request.post(
      globalNodeUrl,
      {
        headers: { "content-type": "application/json" },
        form: `{"jsonrpc":"2.0","method":"eth_getBalance","params":["${address}"],"id":1}`
      },
      (error, response, data) => {
        if (error) {
          reject(error);
        }
        try {
          if (data) {
            const json = JSON.parse(data);
            resolve(new BigNumber(json.result));
          }
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

export const getTransactionReceipt = (txID: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    request.post(
      globalNodeUrl,
      {
        headers: { "content-type": "application/json" },
        form: `{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["${txID}"],"id":1}`
      },
      (error, response, data) => {
        if (error) {
          reject(error);
        }
        try {
          if (data) {
            const json = JSON.parse(data);
            resolve(json.result);
          }
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

export const getContract = (contractAddress: string, abi: any): Contract => {
  const provider = new JsonRpcProvider(globalNodeUrl);
  return new Contract(contractAddress, abi, provider);
};

export const WalletTypes = [
  HydroWallet.TYPE,
  ExtensionWallet.TYPE,
  WalletConnectWallet.TYPE
];
