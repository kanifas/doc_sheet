import { makeAutoObservable } from "mobx";

export default class RootStore {
  constructor() {
    makeAutoObservable(this);
  }
}
