# SSO integration between React and Angular by using Cookies 

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

