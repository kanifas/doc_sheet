import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useRoutes } from "./routes";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";

import Loader from './components/ui/Loader';
import NavBar from './components/Navbar';

function App() {
  const { login, logout, token, userId, isReady } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  if (!isReady) {
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{ login, logout, token, userId, isAuthenticated }}>
      <div className="App">
        <BrowserRouter>
          {isAuthenticated && <NavBar />}
          {routes}
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
