class AvaUI {

  constructor() {
    this.options = {
      'credentials' : 'same-origin',
      'headers' : {
        'accept' : 'application/json'
      }
    };
  
    this.fetchProfile();  
  }

  fetchProfile() {
    fetch('/api/v1/users/self/profile', this.options)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(this.updateUser)
      .then(this.includeAva)
      .catch(function(error) {
      console.log('Unable to lookup user information ', error);
    });
  }

  parseJSON(response) {
    return response.json();
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  updateUser(data) {
    let user = {
      login_id      : data.login_id,
      name          : data.name,
      primary_email : data.primary_email,
      avatar        : data.avatar_url,
      showAva       : false
    };
    console.log(user);
    return user;
  }

  includeAva(user) {
    let url = 'https://ava-ui-prod.herokuapp.com/chat/';
    let params = '?id=' + user.login_id + '&name=' + user.name + '&email=' + user.primary_email + '&avatar=' + user.avatar;
    user.avaUrl = url + params;
  
    // Build launch button
    let g = document.createElement('button');
    g.innerHTML = '<img style="border-radius: 50%;" src="https://ava-ui-prod.herokuapp.com/ava-icon.png" class="sc-open-icon" width="30" height="30"/>';
    g.setAttribute("id", 'avaLauncher');
    g.style.cssText = 'position:fixed;bottom:40px;right:15px;opacity:1;z-index:11;background-color:rgba(0,0,0,0);width:4em;height:4em;border-radius:50%;outline:none;';
    document.body.appendChild(g);
    document.querySelector('#avaLauncher').addEventListener('click', function () {
      let left = screen.width - 620;
      let params = 'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=600,height=680,top=0,left=' + left;
      window.open(user.avaUrl, '', params);
    });
  }
}

(function() {
  new AvaUI();
}) ();
