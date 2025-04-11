# SSO integration between React and Angular by using Cookies 

# Auth0 Setup

Log in to your Auth0 Dashboard (https://manage.auth0.com/)
Create a new Application:

# Part 1: Auth0 Setup
- Log in to your Auth0 Dashboard (https://manage.auth0.com/)
- Create a new Application:
- Go to "Applications" > Click "Create Application" > Name it "SSO Demo" > Choose "Single Page Applications" (for Angular) > Click "Create"

- Configure Application Settings:

Allowed Callback URLs:
  http://localhost:4200/callback
  http://localhost:3000/callback

Allowed Logout URLs:
  http://localhost:4200
  http://localhost:3000

Allowed Web Origins:
  http://localhost:4200
  http://localhost:3000

# Note down these values from your Auth0 application:

-  Domain (e.g., your-tenant.auth0.com)
-  Client ID


# Part 2: Angular Application Setup

1. Create Angular App

ng new angular-sso-app --routing --style=css
cd angular-sso-app

2. Install Auth0 Angular SDK

npm install @auth0/auth0-angular

3. Configure Auth0 Module
Edit src/app/app.module.ts:

import { AuthModule } from '@auth0/auth0-angular';

@NgModule({
  imports: [
    // other imports...
    AuthModule.forRoot({
      domain: 'your-tenant.auth0.com',
      clientId: 'your-client-id',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://your-tenant.auth0.com/api/v2/',
        scope: 'openid profile email',
      },
      useRefreshTokens: true,
    }),
  ],
})
export class AppModule {}

4. Implement Login/Logout in Component

// src/app/app.component.ts
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="auth.loginWithRedirect()" *ngIf="!(auth.isAuthenticated$ | async)">Log in</button>
    <button (click)="auth.logout()" *ngIf="auth.isAuthenticated$ | async">Log out</button>
    <div *ngIf="auth.isAuthenticated$ | async">
      <p>Welcome to Angular App!</p>
      <pre>{{ auth.user$ | async | json }}</pre>
    </div>
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}

5. Run Angular App

# Part 3: React Application Setup

1. Create React App and Install Auth0 React SDK
npm install @auth0/auth0-react

2. Configure Auth0 Provider

Edit src/index.js:

import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

ReactDOM.render(
  <Auth0Provider
    domain="your-tenant.auth0.com"
    clientId="your-client-id"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: 'https://your-tenant.auth0.com/api/v2/',
      scope: 'openid profile email',
    }}
    useRefreshTokens={true}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

3. Implement Login/Logout in Component

// src/App.js

import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div>
      <button onClick={() => loginWithRedirect()} disabled={isAuthenticated}>
        Log in
      </button>
      <button onClick={() => logout()} disabled={!isAuthenticated}>
        Log out
      </button>
      {isAuthenticated && (
        <div>
          <p>Welcome to React App!</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
export default App;

4. Run React App



# Transferring Tokens Between React and Angular Apps Using Cookies

# 1. Setup the React Application
First, create a React app that will generate and set the authentication token in a cookie.

# Install cookie package:
npm install js-cookie

# Modify React App (src/App.js):

import Cookies from 'js-cookie';

function App() {
  const [token, setToken] = useState('');

  const generateToken = () => {
    // In a real app, you would get this from your auth server
    const fakeToken = 'react-generated-token-' + Math.random().toString(36).substring(2);
    setToken(fakeToken);
    
    // Set cookie accessible by Angular app on the same domain     
    // replace JSON.stringify(authObject) for Auth Object{} insted fakeToken
    Cookies.set('auth_token', fakeToken, { 
      expires: 1, // 1 day
      path: '/',
      domain: window.location.hostname,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  };

  return (
    <div className="App">
      <h1>React Auth App</h1>
      <button onClick={generateToken}>Generate Token</button>
      {token && <p>Token: {token}</p>}
      <p>
        <a href="http://localhost:4200" target="_blank" rel="noopener noreferrer">
          Go to Angular App
        </a>
      </p>
    </div>
  );
}
export default App;


# 2. Setup the Angular Application

Now create an Angular app that will read the cookie set by the React app.

# Install cookie service:

npm install ngx-cookie-service

# Modify Angular App:
Import the cookie service in app.module.ts:

import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }


# Update app.component.ts:

import { CookieService } from 'ngx-cookie-service';

export class AppComponent implements OnInit {
  token: string = '';

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    this.checkForToken();
  }

  checkForToken() {
    if (this.cookieService.check('auth_token')) {
      this.token = this.cookieService.get('auth_token');
    }
  }
}


#Update app.component.html:

<div style="text-align:center">
  <h1>Angular Token Receiver</h1>
  
  <div *ngIf="token; else noToken">
    <h2>Token Received!</h2>
    <p>{{ token }}</p>
    <p>This token was set by the React app via cookie.</p>
  </div>

  <ng-template #noToken>
    <p>No token found in cookies.</p>
    <p>
      <a href="http://localhost:3000" target="_blank">
        Go to React App to generate a token
      </a>
    </p>
  </ng-template>
</div>

# 3. Run Both Applications

# 4. Accessing Cookie Data in Angular's app.config.ts

1. First, create a utility function to read cookies directly 

// src/app/utils/cookie-reader.util.ts

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null; // For SSR compatibility

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function getAuthDataFromCookie(): { token?: string } | null {
  const authCookie = getCookie('auth_data');
  if (!authCookie) return null;

  try {
    return JSON.parse(authCookie);
  } catch {
    return null;
  }
}

2. Use in app.config.ts

// src/app/app.config.ts
import { getAuthDataFromCookie } from './utils/cookie-reader.util';

// Get auth data from cookies during 
const authData = getAuthDataFromCookie();

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAuth0({
      domain: `${authData?.domain}`,
      clientId: `${authData?.clientID}`,
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ]
};
