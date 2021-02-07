import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import reportWebVitals from './reportWebVitals';
import { App } from '~/pages';
import '~/styles/index.css';
import RootStore from  '~/stores/RootStore';

require("es6-object-assign").polyfill(); // IE11

const rootStore = new RootStore();
const stores = {
  rootStore,
  authStore: rootStore.authStore,
  userStore: rootStore.userStore,
  docStore: rootStore.docStore,
  bookStore: rootStore.bookStore,
  uiStore: rootStore.uiStore,
};

ReactDOM.render(
  <React.StrictMode>
    <Provider {...stores}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
