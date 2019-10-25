import { HardwareWallet, sendRawTransaction, getTransactionCount } from ".";
import AwaitLock from "await-lock";
import { txParams } from "./baseWallet";
import EthereumTx from "ethereumjs-tx";

const U2fTransport = require("@ledgerhq/hw-transport-u2f").default;
const LedgerEth = require("@ledgerhq/hw-app-eth").default;

export default class Ledger extends HardwareWallet {
  public static LABEL = "Ledger";
  public static TYPE = "LEDGER";
  public PATH_TYPE_NAME = {
    LIVE: "Ledger Live",
    LEGACY: "Ledger Legacy"
  };
  private awaitLock = new AwaitLock();
  private eth: any;
  public ethAppVersion: string = "";

  public constructor() {
    super();
    const lastSelectedPathRule = window.localStorage.getItem("Ledger:lastSelectedPathRule");
    const lastSelectedPath = window.localStorage.getItem("Ledger:lastSelectedPath");
    if (lastSelectedPathRule && lastSelectedPath) {
      this.setPath(lastSelectedPathRule, lastSelectedPath);
    }
  }

  public async enable() {
    const transport = await U2fTransport.create();
    this.eth = new LedgerEth(transport);
    const config = await this.eth.getAppConfiguration();
    this.ethAppVersion = config.version;
  }

  public type(): string {
    return Ledger.TYPE;
  }

  public id(): string {
    return Ledger.TYPE;
  }

  public async signPersonalMessage(message: string): Promise<string> {
    try {
      await this.awaitLock.acquireAsync();
      if (message.slice(0, 2) === "0x") {
        message = message.slice(2);
      } else {
        message = Buffer.from(message).toString("hex");
      }
      const result = await this.eth.signPersonalMessage(this.currentPath, message);
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

      if (!txParams.nonce) {
        const currentAddress = await this.getAddresses();
        const nonce = await getTransactionCount(currentAddress[0], "pending");
        txParams.nonce = nonce;
      }
      txParams = this.formatTxParams(txParams);
      const tx = new EthereumTx(txParams);

      // Set the EIP155 bits
      tx.raw[6] = Buffer.from([networkID]); // v
      tx.raw[7] = Buffer.from([]); // r
      tx.raw[8] = Buffer.from([]); // s

      // Pass hex-rlp to ledger for signing
      const result = await this.eth.signTransaction(this.currentPath, tx.serialize().toString("hex"));

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
    const rawData = await this.signTransaction(txParams);
    return sendRawTransaction(rawData);
  }

  public async getAddressesWithPath(pathRule: string, from: number, count: number) {
    try {
      await this.awaitLock.acquireAsync();
      const addresses: { [key: string]: string } = {};
      for (let i = from; i < from + count; i++) {
        const path = this.getPath(pathRule, i);

        if (this.addresses[path]) {
          addresses[path] = this.addresses[path];
        } else {
          const address = await this.eth.getAddress(path, false, false);
          addresses[path] = address.address.toLowerCase();
          this.addresses[path] = addresses[path];
        }
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
    if (this.addresses[this.currentPath]) {
      return [this.addresses[this.currentPath]];
    } else {
      const res = await this.getAddressesWithPath(this.currentPathRule, this.getCurrentPathIndex(), 1);
      return Object.values(res);
    }
  }

  public name(): string {
    return "Ledger";
  }
}
