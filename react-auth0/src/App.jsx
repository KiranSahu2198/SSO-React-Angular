import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import './App.css';
import LoginButton from './components/login';
import LogoutButton from './components/logout';
import Profile from './components/profile';
import GenerateAuth from './components/generateAuth';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App">
      <h1>React Auth App</h1>
      {!isAuthenticated && <LoginButton />}
      {isAuthenticated && <>
        <LogoutButton />
        <Profile />
        <GenerateAuth />
      </>}
    </div>
  );
}

export default App;