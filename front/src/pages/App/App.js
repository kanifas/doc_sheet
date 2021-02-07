import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useAuth } from "~/hooks/auth.hook";
import { AuthContext } from "~/context/AuthContext";
import { Auth, Dashboard, Links } from '~/pages';
import NavBar from '~/components/Navbar';
import Loader from '~/components/ui/Loader';

@inject('authStore')
@observer
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authStore } = this.props;

    /*if (!isReady) {
      return <Loader/>
    }*/

    if (authStore.user) {
      return (
        <div className="App">
          <BrowserRouter>
            <NavBar/>
            <Switch>
              <Route path="/dashboard" exact component={Dashboard} />
              <Route path="/links" exact component={Links} />
              <Redirect to="/dashboard" />
            </Switch>
          </BrowserRouter>
        </div>
      )
    }

    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Auth} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
