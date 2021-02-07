import { makeAutoObservable } from 'mobx';
import axios from 'axios';
const jsonwebtoken = require('jsonwebtoken');

export default class RootStore {
  constructor(rootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
    this.checkForExpiredToken();
  }

  user = null;
  loading = null;
  error = null;

  loadingOn = () => this.loading = true;
  loadingOff = () => this.loading = false;

  signup = async userData => {
    try {
      this.loadingOn();
      await new Promise(res => {
        setTimeout(res, 3000);
      });
      const result = await axios.post(
        '/api/auth/signup',
        userData
      );
      const { jwt } = result.data;
      this.setUser(jwt);
      this.loadingOff();
    } catch (error) {
      this.loadingOff();
      this.setError(error);
      console.error(error.response.data);
    }
  };

  signin = async userData => {
    try {
      this.loadingOn();
      const result = await axios.post(
        '/api/auth/signin',
        userData
      );
      const { jwt } = result.data;
      this.setUser(jwt);
      this.loadingOff();
    } catch (error) {
      this.loadingOff();
      this.setError(error);
      console.error(error.response.data);
    }
  };

  setUser = jwt => {
    if (!jwt) {
      this.user = null;
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem('jwt');
      return;
    }
    const { id, firstName, lastName, email, isRoot } = jsonwebtoken.decode(jwt);
    this.user = { id, firstName, lastName, email, isRoot };
    axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    localStorage.setItem('jwt', jwt);
  };

  checkForExpiredToken = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const currentTime = Date.now() / 1000;
      const decoded = jsonwebtoken.decode(jwt);
      if (decoded.exp >= currentTime) {
        this.setUser(jwt);
      } else {
        this.logout();
      }
    }
  };

  setError = error => {
    this.error = error.response.data;
  };

  clearError = () => this.error = null;

  logout = () => this.setUser();
}
