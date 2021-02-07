import { makeAutoObservable, computed, action } from "mobx";

export default class RootStore {
  firstName;
  lastName;

  constructor() {
    makeAutoObservable(this);
  }

  get fullName() {
    return `${this.firstName} ${this.lasName}`;
  }

  setFio(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

