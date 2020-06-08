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
      .then(this.includeFlyoutPanelAva)
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
    return user;
  }

  includeAva(user) {
    let url = 'https://ava-ui-qa.herokuapp.com/chat/';
    let params = '?id=' + user.login_id + '&name=' + user.name + '&email=' + user.primary_email + '&avatar=' + user.avatar;
    user.avaUrl = url + params;

    if (!!document.querySelector('#avaLauncher')) {
      return user;
    }

    // Build launch button
    let iconDiv = document.createElement('div');
    iconDiv.innerHTML = '<img style="border-radius: 50%;" src="https://ava-ui-qa.herokuapp.com/ava-icon.png" class="sc-open-icon" width="30" height="30"/>';
    iconDiv.setAttribute('class', 'menu-item-icon-container');

    let textDiv = document.createElement('div');
    textDiv.innerHTML = 'Ava';
    textDiv.setAttribute('class', 'menu-item__text');

    let g = document.createElement('a');
    g.setAttribute("id", 'avaLauncher');
    g.setAttribute("href", "javascript:void(0)");
    g.setAttribute("class", "ic-app-header__menu-list-link");
    g.style.cssText = 'background-color:rgba(0,0,0,0);outline:none;';
    g.appendChild(iconDiv);
    g.appendChild(textDiv);
    
    var newLi = document.createElement('li');
    newLi.setAttribute('class', 'menu-item ic-app-header__menu-list-item');
    newLi.appendChild(g);

    let parent = document.querySelector('.ic-app-header__menu-list');
    parent.insertBefore(newLi, document.querySelector('.ic-app-header__menu-list li:last-child'));

    document.querySelector('#avaLauncher').addEventListener('click', function () {
        let left = screen.width - 620;
        let params = 'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=600,height=680,top=0,left=' + left;
        window.open(user.avaUrl, 'Ava', params);
    });

    return user;
  }

  includeFlyoutPanelAva(user) {
    if (!document.querySelector('div[role="dialog"] > div > span > ul')) return;

    let firstChild = document.querySelector('div[role="dialog"] > div > span > ul').firstChild;
    let newChild = firstChild.cloneNode(true);
    newChild.querySelector('li > a').setAttribute('href', 'javascript:;');
    
    let targetParent = newChild.querySelector('li > a > span > span');
    targetParent.querySelector('span:nth-child(2) > span').innerText = 'Ava';
    targetParent.firstChild.innerHTML = '<img style="border-radius: 50%;" src="https://ava-ui-qa.herokuapp.com/ava-icon.png" class="sc-open-icon" width="30" height="30"/>';
    
    let p = document.querySelector('div[role="dialog"] > div > span > ul');
    p.insertBefore(newChild, p.lastChild);
    
    newChild.querySelector('li > a').addEventListener('click', function () {
      let left = screen.width - 620;
      let params = 'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=600,height=680,top=0,left=' + left;
      window.open(user.avaUrl, 'Ava', params);
    });
  }

}

(function() {
  if (!document.querySelector('#avaLauncher')) {
    new AvaUI();
  }
  
  document.querySelector('#mobile-header > button').addEventListener('click', function () {
    new AvaUI();
  });
}) ();
