import User from './user '

export default class GoTrue {
  constructor(options = {}) {
    if (!options.APIUrl) {
      throw("You must specify an APIUrl of your GoTrue instance");
    }

    if (options.Audience) {
      this.audience = options.Audience;
    }

    this.api = new API(options.APIUrl);
  }

  request(path, options){
    options.headers = options.headers||{};
    //Audience??
    return this.api.request(path, options)
  }

  signup(email, password, data) {
    return this.request('/signup',{
      method: 'POST',
      body: JSON.stringify({email, password, data})
    });
  }

  //TODO  signupExternal

  login(emai, password, remember) {
    return this.request('/token', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'grant_type=password&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
      .then((response)=>{
        const user = new User(this.api, repsone);
        user.
      })
  }




  requestPasswordRecovery(email) {
    return this.request('/recover',{
      method: 'POST',
      body: JSON.stringify({email})
    });
  }

  verify(type, token) {
    return this.request('/users/confirmation',{
      method: 'POST'
    })
  }

}