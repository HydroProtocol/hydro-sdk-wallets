import { Map } from "immutable";
import WalletReducer from "./wallet";

export interface ImmutableMap<T> extends Map<string, any> {
  get<K extends Extract<keyof T, string>>(key: K, notSetValue?: any): T[K];
  set<K extends Extract<keyof T, string>>(key: K, value: any): any;
}

export { WalletReducer };
