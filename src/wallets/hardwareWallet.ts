import { BaseWallet, getNetworkID } from ".";

export default class HardwareWallet extends BaseWallet {
  public static LABEL = "Hardware Wallet";
  public static TYPE = "HARDWARE_WALLET";
  public PATH_TYPE: { [key: string]: string } = {
    LIVE: "m/44'/60'/x'/0/0",
    LEGACY: "m/44'/60'/0'/x"
  };
  public PATH_TYPE_NAME: { [key: string]: string } = {
    LIVE: "Live",
    LEGACY: "LEGACY"
  };
  public currentPathRule: string = this.PATH_TYPE.LIVE;
  public currentPath: string = "m/44'/60'/0'/0/0";
  public connected: boolean = false;
  public PER_PAGE = 3;
  public CUSTOMIZAION_PATH = "Customization";
  public PREFIX_ETHEREUM_PATH = "m/44'/60'/";
  public addresses: { [key: string]: string } = {};

  public getPathType(pathRule: string) {
    return Object.values(this.PATH_TYPE).indexOf(pathRule) > -1 ? pathRule : this.CUSTOMIZAION_PATH;
  }

  public setPath(pathRule: string, path: string) {
    this.currentPathRule = pathRule;
    this.currentPath = path;
    window.localStorage.setItem(this.name() + ":lastSelectedPathRule", pathRule);
    window.localStorage.setItem(this.name() + ":lastSelectedPath", path);
  }

  public type(): string {
    return HardwareWallet.TYPE;
  }

  public id(): string {
    return HardwareWallet.TYPE;
  }

  public signMessage(message: string): Promise<string> | null {
    return this.signPersonalMessage(message);
  }

  public async getAddressesWithPath(pathRule: string, from: number, count: number): Promise<{ [key: string]: string }> {
    return {};
  }

  public getCurrentPathIndex() {
    const parts = this.currentPath.split("/");
    let partIndex = parts.length - 1;
    if (this.currentPathRule.includes("x")) {
      const ruleParts = this.currentPathRule.split("/");
      ruleParts.forEach((part, index) => {
        if (part.includes("x")) {
          partIndex = index;
        }
      });
    }
    return Number(parts[partIndex].replace("'", ""));
  }

  public getPath(pathRule: string, index: number): string {
    if (pathRule.includes("x")) {
      return pathRule.replace("x", index.toString());
    } else {
      return pathRule + "/" + index.toString();
    }
  }

  public isSupported(): boolean {
    return this.connected;
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
    return "HardwareWallet";
  }
}
