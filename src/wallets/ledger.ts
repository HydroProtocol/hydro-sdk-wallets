import { BaseWallet, getNetworkID, sendRawTransaction, getTransactionCount } from ".";
import AwaitLock from "await-lock";
import { txParams } from "./baseWallet";
import EthereumTx from "ethereumjs-tx";

const U2fTransport = require("@ledgerhq/hw-transport-u2f").default;
const LedgerEth = require("@ledgerhq/hw-app-eth").default;

export default class Ledger extends BaseWallet {
  public static LABEL = "Ledger";
  public static TYPE = "LEDGER";
  private awaitLock = new AwaitLock();
  private eth: any;
  public static PATH_TYPE = {
    LEDGER_LIVE: "m/44'/60'/0'/0",
    LEGACY: "m/44'/60'/0'"
  };
  public static currentBasePath: string;
  public static currentIndex: number;
  public connected: boolean = false;
  public static CUSTOMIZAION_PATH = "Customization";
  public static PREFIX_ETHEREUM_PATH = "m/44'/60'/";

  public constructor() {
    super();
    const selectedBasePath = window.localStorage.getItem("Ledger:selectedBasePath") || Ledger.PATH_TYPE.LEGACY;
    const selectedIndex = Number(window.localStorage.getItem("Ledger:selectedIndex")) || 0;
    Ledger.setPath(selectedBasePath, selectedIndex);
  }

  public async initTransport() {
    const transport = await U2fTransport.create();
    this.eth = new LedgerEth(transport);
  }

  public static getPathType(basePath: string) {
    return Object.values(Ledger.PATH_TYPE).indexOf(basePath) > -1 ? basePath : Ledger.CUSTOMIZAION_PATH;
  }

  public static setPath(basePath: string, index: number) {
    Ledger.currentBasePath = basePath;
    window.localStorage.setItem("Ledger:selectedBasePath", basePath);
    Ledger.currentIndex = index;
    window.localStorage.setItem("Ledger:selectedIndex", String(index));
  }

  public currentPath(): string {
    return Ledger.currentBasePath + "/" + Ledger.currentIndex.toString();
  }

  public type(): string {
    return Ledger.TYPE;
  }

  public id(): string {
    return Ledger.TYPE;
  }

  public signMessage(message: string): Promise<string> | null {
    return this.signPersonalMessage(message);
  }

  public async signPersonalMessage(message: string): Promise<string> {
    try {
      await this.awaitLock.acquireAsync();
      if (message.slice(0, 2) === "0x") {
        message = message.slice(2);
      } else {
        message = Buffer.from(message).toString("hex");
      }
      const result = await this.eth.signPersonalMessage(this.currentPath(), message);
      const v = parseInt(result.v, 10) - 27;
      let vHex = v.toString(16);
      if (vHex.length < 2) {
        vHex = `0${v}`;
      }
      return `0x${result.r}${result.s}${vHex}`;
    } finally {
      this.awaitLock.release();
    }
  }

  public async signTransaction(txParams: txParams): Promise<string> {
    try {
      await this.awaitLock.acquireAsync();

      const networkID = await this.loadNetworkId();
      const tx = new EthereumTx(txParams);

      // Set the EIP155 bits
      tx.raw[6] = Buffer.from([networkID]); // v
      tx.raw[7] = Buffer.from([]); // r
      tx.raw[8] = Buffer.from([]); // s

      // Pass hex-rlp to ledger for signing
      const result = await this.eth.signTransaction(this.currentPath(), tx.serialize().toString("hex"));

      // Store signature in transaction
      tx.v = Buffer.from(result.v, "hex");
      tx.r = Buffer.from(result.r, "hex");
      tx.s = Buffer.from(result.s, "hex");

      // EIP155: v should be chain_id * 2 + {35, 36}
      const signedChainId = Math.floor((tx.v[0] - 35) / 2);
      const validChainId = networkID & 0xff; // FIXME this is to fixed a current workaround that app don't support > 0xff
      if (signedChainId !== validChainId) {
        throw new Error("Invalid networkId signature returned. Expected: " + networkID + ", Got: " + signedChainId);
      }
      return `0x${tx.serialize().toString("hex")}`;
    } finally {
      this.awaitLock.release();
    }
  }

  public async sendTransaction(txParams: txParams): Promise<string> {
    if (!txParams.nonce) {
      const currentAddress = await this.getAddresses();
      const nonce = await getTransactionCount(currentAddress[0], "pending");
      txParams.nonce = nonce;
    }
    const rawData = await this.signTransaction(txParams);
    return sendRawTransaction(rawData);
  }

  public async getAddressesWithPath(basePath: string, from: number, count: number): Promise<{ [key: string]: string }> {
    try {
      await this.awaitLock.acquireAsync();
      const addresses: { [key: string]: string } = {};
      for (let i = from; i < from + count; i++) {
        const path = basePath + "/" + i.toString();
        const address = await this.eth.getAddress(path, false, false);
        addresses[path] = address.address.toLowerCase();
      }
      this.connected = true;
      this.awaitLock.release();
      return addresses;
    } catch (e) {
      // ledger disconnected
      this.connected = false;
      throw e;
    }
  }

  public async getAddresses(): Promise<string[]> {
    const address = await this.getAddressesWithPath(Ledger.currentBasePath, Ledger.currentIndex, 1);
    return Object.values(address);
  }

  public isSupported(): boolean {
    return !this.connected;
  }

  public isLocked(): boolean {
    return !this.connected;
  }

  public async loadNetworkId(): Promise<number> {
    return getNetworkID();
  }

  public async sendCustomRequest(method: string, params: any): Promise<any> {
    return null;
  }

  public name(): string {
    return "Ledger";
  }
}
