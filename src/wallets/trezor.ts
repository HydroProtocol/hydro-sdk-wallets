import { txParams } from "./baseWallet";
import { getTransactionCount, sendRawTransaction, HardwareWallet } from ".";
import EthereumTx from "ethereumjs-tx";
import { HDNode } from "ethers/utils";

export default class Trezor extends HardwareWallet {
  public static LABEL = "Trezor";
  public static TYPE = "TREZOR";
  public PATH_TYPE = {
    LIVE: "m/44'/60'/0'/0"
  };
  public PATH_TYPE_NAME = {
    LIVE: "Standard"
  };
  public cacheAddressCount = 3 * this.PER_PAGE;
  public currentPathRule: string = this.PATH_TYPE.LIVE;
  public currentPath: string = "m/44'/60'/0'/0/0";
  public masterNodes: { [key: string]: HDNode.HDNode } = {};
  private TrezorConnector: any;

  public constructor() {
    super();
    const lastSelectedPathRule = window.localStorage.getItem("Trezor:lastSelectedPathRule");
    const lastSelectedPath = window.localStorage.getItem("Trezor:lastSelectedPath");
    if (lastSelectedPathRule && lastSelectedPath) {
      this.setPath(lastSelectedPathRule, lastSelectedPath);
    }
    this.TrezorConnector = require("trezor-connect").default;
  }

  public type(): string {
    return Trezor.TYPE;
  }

  public id(): string {
    return Trezor.TYPE;
  }

  public async signPersonalMessage(message: string): Promise<string> {
    try {
      if (message.slice(0, 2) === "0x") {
        message = message.slice(2);
      } else {
        message = Buffer.from(message).toString("hex");
      }

      const res = await this.TrezorConnector.ethereumSignMessage({ path: this.currentPath, message, hex: true });
      if (res.success) {
        return "0x" + res.payload.signature;
      } else {
        throw new Error(res.payload.error);
      }
    } catch (e) {
      throw e;
    }
  }

  public async signTransaction(txParams: txParams): Promise<string> {
    try {
      const networkID = await this.loadNetworkId();
      if (!txParams.chainId) {
        txParams.chainId = networkID;
      }

      if (!txParams.nonce) {
        const currentAddress = await this.getAddresses();
        const nonce = await getTransactionCount(currentAddress[0], "pending");
        txParams.nonce = nonce;
      }
      txParams = this.formatTxParams(txParams);
      const tx = new EthereumTx(txParams);
      tx.raw[6] = Buffer.from([networkID]); // v
      tx.raw[7] = Buffer.from([]); // r
      tx.raw[8] = Buffer.from([]); // s

      const res = await this.TrezorConnector.ethereumSignTransaction({ path: this.currentPath, transaction: txParams });
      tx.v = Buffer.from(res.payload.v.substr(2), "hex");
      tx.r = Buffer.from(res.payload.r.substr(2), "hex");
      tx.s = Buffer.from(res.payload.s.substr(2), "hex");

      return `0x${tx.serialize().toString("hex")}`;
    } catch (e) {
      throw e;
    }
  }

  public async sendTransaction(txParams: txParams): Promise<string> {
    const rawData = await this.signTransaction(txParams);
    return sendRawTransaction(rawData);
  }

  public async getAddressesWithPath(pathRule: string, from: number, count: number): Promise<{ [key: string]: string }> {
    try {
      let addresses: { [key: string]: string } = {};
      for (let i = from; i < from + count; i++) {
        const address = await this.deriveAddress(pathRule, i);
        addresses = { ...addresses, ...address };
      }
      return addresses;
    } catch (e) {
      throw e;
    }
  }

  public async getAddresses(): Promise<string[]> {
    if (this.addresses[this.currentPath]) {
      return [this.addresses[this.currentPath]];
    } else {
      return Object.values(await this.deriveAddress(this.currentPathRule, this.getCurrentPathIndex()));
    }
  }

  public async deriveAddress(pathRule: string, index: number): Promise<{ [key: string]: string }> {
    if (!this.masterNodes[pathRule]) {
      const res = await this.TrezorConnector.getPublicKey({ path: pathRule });
      if (res.success) {
        this.connected = true;
        this.masterNodes[pathRule] = HDNode.fromExtendedKey(res.payload.xpub);
      } else {
        this.connected = false;
        throw new Error(res.payload.error);
      }
    }

    return {
      [this.getPath(pathRule, index)]: this.masterNodes[pathRule].derivePath(index.toString()).address.toLowerCase()
    };
  }

  public getStartPageIndex(index: number) {
    return Math.max(Math.floor(index / this.cacheAddressCount) - this.PER_PAGE, 0);
  }

  public name(): string {
    return "Trezor";
  }
}
