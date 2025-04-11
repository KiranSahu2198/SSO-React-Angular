import { useState } from 'react';
import Cookies from 'js-cookie';

function GenerateAuth() {
  const [authData, setAuthData] = useState(null);

  const generateAuthData = () => {
    // Create a more complex auth object
    const authObject = {
      token: 'react-token-' + Math.random().toString(36).substring(2),
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientID: import.meta.env.VITE_AUTH0_CLIENT_ID,
      user: {
        id: Math.floor(Math.random() * 1000),
        name: 'User' + Math.floor(Math.random() * 100),
        email: `user${Math.floor(Math.random() * 100)}@example.com`
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      roles: ['user', 'editor']
    };
    
    setAuthData(authObject);
    
    // Stringify the object before storing in cookie
    Cookies.set('auth_data', JSON.stringify(authObject), {
      expires: 1, // 1 day
      path: '/',
      domain: window.location.hostname,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    alert('Auth data generated and cookie set!');
  };

  return (
    <div>
      <h1>Generate New Auth</h1>
      <button onClick={generateAuthData}>Generate Auth Data</button>
      {authData && (
        <div>
          <h3>Generated Data:</h3>
          <pre>{JSON.stringify(authData, null, 2)}</pre>
        </div>
      )}
      <p>
        <a href="http://localhost:4200" target="_blank" rel="noopener noreferrer">
          Go to Angular App
        </a>
      </p>
    </div>
  );
}

export default GenerateAuth;