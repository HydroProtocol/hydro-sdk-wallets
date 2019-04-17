import {
  HydroWallet,
  ExtensionWallet,
  NeedUnlockWalletError,
  NotSupportedError,
  isHydroWallet
} from "../wallets";
import {
  loadAccount,
  selectAccount,
  supportExtensionWallet,
  unlockAccount,
  lockAccount,
  loadBalance,
  loadNetworkId
} from "../actions/wallet";

declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

export type Connection = HydroWallet | typeof ExtensionWallet;

export default class Connector {
  private accountWatchers: Map<string, number> = new Map();
  public connections: Map<string, Connection> = new Map();
  public selectedType: string | null = null;
  private nodeUrl?: string;
  public dispatch: any;

  public constructor() {
    this.startAccountWatchers();
  }

  public setNodeUrl(nodeUrl: string): void {
    this.nodeUrl = nodeUrl;
    this.refreshWatchers();
  }

  public setDispatch(dispatch: any): void {
    this.dispatch = dispatch;
    this.refreshWatchers();
  }

  public getSupportedTypes(): string[] {
    return Array.from(this.connections.keys());
  }

  public getConnection(type: string | null): Connection | null {
    if (!type) {
      return null;
    }
    return this.connections.get(type)!;
  }

  public getAddress(type: string | null): string | null {
    const connection = this.getConnection(type);
    return connection ? connection.getAddress() : null;
  }

  public async unlock(type: string, password: string): Promise<void> {
    if (!isHydroWallet(type)) {
      return;
    }
    const connection = this.getConnection(type);
    if (!connection) {
      return;
    }
    await connection.unlock(password);
    if (this.dispatch) {
      this.dispatch(unlockAccount(type));
    }
  }

  public selectConnection(type: string): void {
    if (this.dispatch) {
      this.dispatch(selectAccount(type));
    }
    if (type === this.selectedType || !this.connections.get(type)) {
      return;
    }
    if (type === ExtensionWallet.getType()) {
      ExtensionWallet.enableBrowserExtensionWallet();
    }
    this.selectedType = type;
    window.localStorage.setItem("HydroWallet:lastSelectedType", type);
    this.refreshWatchers();
  }

  private loadExtensionWallet(): void {
    this.connections.set(ExtensionWallet.getType(), ExtensionWallet);
    if (this.dispatch && ExtensionWallet.isSupported()) {
      this.dispatch(supportExtensionWallet());
    }
  }

  private loadHydroWallets(): void {
    HydroWallet.list().map(wallet => {
      const type = wallet.getType();
      if (this.nodeUrl) {
        wallet.setNodeUrl(this.nodeUrl);
      }
      this.connections.set(type, wallet);
    });
  }

  private startAccountWatchers(): void {
    this.loadHydroWallets();
    this.loadExtensionWallet();
    this.selectConnection(
      window.localStorage.getItem("HydroWallet:lastSelectedType") ||
        ExtensionWallet.getType()
    );
    const promises: Array<Promise<any>> = [];
    promises.push(this.watchWallet(ExtensionWallet.getType()));
    HydroWallet.list().map((wallet: HydroWallet) => {
      promises.push(this.watchWallet(wallet.getType()));
    });
    Promise.all(promises);
  }

  private watchWallet(type: string): Promise<[void, void, void]> {
    const watchAccount = async (timer = 0) => {
      const timerKey = `${type}-account`;
      if (
        timer &&
        this.accountWatchers.get(timerKey) &&
        timer !== this.accountWatchers.get(timerKey)
      ) {
        return;
      }

      await this.loadAccount(type);
      const nextTimer = window.setTimeout(() => watchAccount(nextTimer), 3000);
      this.accountWatchers.set(timerKey, nextTimer);
    };

    const watchNetWork = async (timer = 0) => {
      const timerKey = `${type}-account`;
      if (
        timer &&
        this.accountWatchers.get(timerKey) &&
        timer !== this.accountWatchers.get(timerKey)
      ) {
        return;
      }

      await this.loadAccount(type);
      const nextTimer = window.setTimeout(() => watchNetWork(nextTimer), 3000);
      this.accountWatchers.set(timerKey, nextTimer);
    };

    const watchBalance = async (timer = 0) => {
      const timerKey = `${type}-balance`;
      if (
        timer &&
        this.accountWatchers.get(timerKey) &&
        timer !== this.accountWatchers.get(timerKey)
      ) {
        return;
      }
      await this.loadBalance(type);
      const watcherRate = this.getWatcherRate(type);
      const nextTimer = window.setTimeout(
        () => watchBalance(nextTimer),
        watcherRate
      );
      this.accountWatchers.set(timerKey, nextTimer);
    };

    return Promise.all([watchAccount(), watchNetWork(), watchBalance()]);
  }

  private async loadAccount(type: string): Promise<void> {
    const connection = this.connections.get(type);
    if (!connection) {
      return;
    }
    let account;

    try {
      const accounts: string[] = await connection.loadAccounts();
      account = accounts.length > 0 ? accounts[0].toLowerCase() : null;
    } catch (e) {
      account = null;
    }

    if (this.dispatch) {
      this.dispatch(loadAccount(type, account));
      if (connection.isLocked()) {
        this.dispatch(lockAccount(type));
      } else {
        this.dispatch(unlockAccount(type));
      }
    }
  }

  private async loadNetwork(type: string): Promise<void> {
    const connection = this.connections.get(type);
    if (!connection) {
      return;
    }

    try {
      const networkId: number | undefined = await connection.loadNetworkId();
      if (this.dispatch && networkId) {
        this.dispatch(loadNetworkId(type, networkId));
      }
    } catch (e) {
      if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
        throw e;
      }
    }
  }

  private async loadBalance(type: string): Promise<void> {
    const connection = this.connections.get(type);
    if (!connection) {
      return;
    }

    try {
      const balance = await connection.loadBalance();
      if (this.dispatch) {
        this.dispatch(loadBalance(type, balance));
      }
    } catch (e) {
      if (e !== NeedUnlockWalletError && e !== NotSupportedError) {
        throw e;
      }
    }
  }

  private getWatcherRate(type: string): number {
    return this.selectedType === type &&
      window.document.visibilityState !== "hidden"
      ? 3000
      : 300000;
  }

  public async refreshWatchers(): Promise<void> {
    this.clearTimers();
    await this.startAccountWatchers();
  }

  public clearTimers(): void {
    this.accountWatchers.forEach(timer => {
      if (timer) {
        clearTimeout(timer);
      }
    });
  }
}
