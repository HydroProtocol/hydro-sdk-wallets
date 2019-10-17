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
  public ethAppVersion: string = "";
  public static PATH_TYPE = {
    LEDGER_LIVE: "m/44'/60'/x'/0/0",
    LEDGER_LEGACY: "m/44'/60'/0'/x"
  };
  public static currentPathRule: string = "";
  public static currentPath: string = "";
  public connected: boolean = false;
  public PER_PAGE = 3;
  public static CUSTOMIZAION_PATH = "Customization";
  public static PREFIX_ETHEREUM_PATH = "m/44'/60'/";
  public addresses: { [key: string]: string } = {};

  public constructor() {
    super();
    const lastSelectedPathRule =
      window.localStorage.getItem("Ledger:lastSelectedPathRule") || Ledger.PATH_TYPE.LEDGER_LIVE;
    const lastSelectedPath = window.localStorage.getItem("Ledger:lastSelectedPath") || "m/44'/60'/0'/0/0";
    Ledger.setPath(lastSelectedPathRule, lastSelectedPath);
  }

  public async enable() {
    const transport = await U2fTransport.create();
    this.eth = new LedgerEth(transport);
    const config = await this.eth.getAppConfiguration();
    this.ethAppVersion = config.version;
  }

  public static getPathType(basePath: string) {
    return Object.values(Ledger.PATH_TYPE).indexOf(basePath) > -1 ? basePath : Ledger.CUSTOMIZAION_PATH;
  }

  public static setPath(pathRule: string, path: string) {
    Ledger.currentPathRule = pathRule;
    Ledger.currentPath = path;
    window.localStorage.setItem("Ledger:lastSelectedPathRule", pathRule);
    window.localStorage.setItem("Ledger:lastSelectedPath", path);
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
      const result = await this.eth.signPersonalMessage(Ledger.currentPath, message);
      const v = parseInt(result.v, 10) - 27;
      let vHex = v.toString(16);
      if (vHex.length < 2) {
        vHex = `0${v}`;
      }
      return `0x${result.r}${result.s}${vHex}`;
    } catch (e) {
      throw e;
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
      const result = await this.eth.signTransaction(Ledger.currentPath, tx.serialize().toString("hex"));

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
    } catch (e) {
      throw e;
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

  public async getAddressesWithPath(pathRule: string, from: number, count: number) {
    try {
      await this.awaitLock.acquireAsync();
      const addresses: { [key: string]: string } = {};
      for (let i = from; i < from + count; i++) {
        let path;
        if (pathRule.includes("x")) {
          path = pathRule.replace("x", i.toString());
        } else {
          path = pathRule + "/" + i.toString();
        }
        const address = await this.eth.getAddress(path, false, false);
        addresses[path] = address.address.toLowerCase();
        this.addresses[path] = addresses[path];
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
    if (this.addresses[Ledger.currentPath]) {
      return [this.addresses[Ledger.currentPath]];
    } else {
      const res = await this.getAddressesWithPath(Ledger.currentPathRule, this.getCurrentPathIndex(), 1);
      return Object.values(res);
    }
  }

  public getCurrentPathIndex() {
    const parts = Ledger.currentPath.split("/");
    let partIndex = parts.length - 1;
    if (Ledger.currentPathRule.includes("x")) {
      const ruleParts = Ledger.currentPathRule.split("/");
      ruleParts.forEach((part, index) => {
        if (part.includes("x")) {
          partIndex = index;
        }
      });
    }
    return Number(parts[partIndex].replace("'", ""));
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
