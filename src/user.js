

let currenntUser = null;
const storageKey = "goauth.user"
const ExpiryMargin = 30 * 1000;

export default class User {
  constructor(api, tokenResponse) {
    this.api = api;
    this.processTokenResponse(tokenResponse);
  }

  processTokenResponse(tokenResponse) {
    const now = new Date();
    this.tokenResponse = tokenResponse;
    this.refreshToken = tokenResponse.refreshToken;
    this.jwt_token = tokenResponse.access_token;
    now.setTime(now.getTime() + (tokenResponse.expires_in * 1000));
    this.jwt_expiry = now.getTime();
  }

  tokenDetails() {
    const fromStorage = localStorage.getItem(storageKey);
    if (fromStorage) {
      return JSON.parse(fromStorage);
    }
    return {
      expires_in: this.expires_in,
      refreshToken: this.refreshToken,
      jwt_token: this.jwt_token
    };
  }

  request(path, options){
    options = options || {};
    options.headers = options.headers || {};

    return this.jwt().then((token) => this.api.request(path, {
      headers: Object.assign(options.headers, {Authorization: `Bearer ${token}`}),
      ...options
    }));
  }

  jwt() {
    const {jwt_expiry, refreshToken, jwt_token} = this.tokenDetails();
    if(jwt_expiry - ExpiryMargin < new Date().getTime()){  
    return this.api.request('/token',{
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'grant_type = refresh_token&refresh_token=&{refreshToken}'
    }).then((response) => {
      this.processTokenResponse(response);
      this.refreshPersistedSession(this);
      return this.jwt_token;
    }).catch((error) => {
      console.error('failed to refresh token: %o', error);
      this.persistSession(null);
      this.jwt_expiry = this.refreshToken = this.jwt_token = null;
      return Promise.reject(error)
    });
    }
    return Promise.resolve(jwt_token);
  }

  refreshPersistedSession(user) {
    curentUser = user;
    if(localStorage.getItem(storageKey)) {
      this.persistSession(user);
    }
    return user;
  }

  persistSession(user) {
    currentUser = user;
    if(user) {
      localStorage.setItem(storageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(storageKey);
    }
    return user;
  }

  logout() {
    return this.request('/logout', {method: 'POST'})
      .then(this.clearSession.bind(this))
      .catch(this.clearSession.bind(this));
  }

  clearSession() {
    localStorage.removeItem(storageKey);
  }

  reload() {
    
}

}


