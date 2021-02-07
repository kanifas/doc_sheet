import {
  makeAutoObservable,
  observable,
  autorun,
  action,
  runInAction,
  computed,
  configure,
} from "mobx";

import UserStore from "./UserStore";
import AuthStore from "./AuthStore";
import DocStore from "./DocStore";
import BookStore from "./BookStore";
import UiStore from "./UiStore";

configure({ enforceActions: 'always' });

export default class RootStore {
  constructor() {
    this.userStore = new UserStore(this);
    this.authStore = new AuthStore(this);
    this.docStore = new DocStore(this);
    this.bookStore = new BookStore(this);
    this.uiStore = new UiStore(this);
  }
};
