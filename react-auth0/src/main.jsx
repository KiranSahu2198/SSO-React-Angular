import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
    domain="dev-4brsopxh5v5u62re.us.auth0.com"
    clientId="9a1OkTcoB47GUwSsbmYEPJ1HEOLYrRT0"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
