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

  async parseJSON(response) {
    const regex = /"id":(.*),"name"/;
    const text = await response.text();
    let jsonObj = JSON.parse(text);
    const found = text.match(regex);
    if (found.length > 1) {
      jsonObj.id = found[1];
    }
    return jsonObj;
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

  async updateUser(data) {
    let user = {
      canvas_id     : data.id,
      login_id      : data.login_id,
      name          : data.name,
      primary_email : data.primary_email,
      avatar        : data.avatar_url,
      showAva       : false
    };

    const url = `/api/v1/users/${user.canvas_id}/enrollments?type[]=StudentEnrollment`;
    let res = await fetch(url, {
      'credentials' : 'same-origin',
      'headers' : {
        'accept' : 'application/json'
      }
    });
    const jsonObj = await res.json();
    let activeArray = jsonObj.filter(e => e.enrollment_state === 'active');
    user.isStudent = activeArray.length > 0;
    console.log(user);
    return user;
  }

  includeAva(user) {
    let url = 'https://ava-ui-prod.herokuapp.com/chat/';
    let params = '?id=' + user.login_id + '&canvas_id=' + user.canvas_id + '&name=' + user.name + '&email=' + user.primary_email + '&avatar=' + user.avatar + '&is_student=' + user.isStudent;
    user.avaUrl = url + params;

    if (!!document.querySelector('#avaLauncher')) {
      return user;
    }

    // Build launch button
    let iconDiv = document.createElement('div');
    iconDiv.innerHTML = '<img style="border-radius: 50%;" src="https://ava-ui-prod.herokuapp.com/ava-icon.png" class="sc-open-icon" width="30" height="30"/>';
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
    if (parent) {
      parent.insertBefore(newLi, document.querySelector('#global_nav_help_link').parentElement);
    }

    document.querySelector('#avaLauncher').addEventListener('click', function () {
        let left = screen.width - 620;
        let height = (window.innerHeight + 54 >= screen.height) ? screen.height - 54 : window.innerHeight;
        let params = 'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=600,height=' + height + ',top=10,left=' + left;
        window.open(user.avaUrl, 'Ava', params);
    });

    return user;
  }

  includeFlyoutPanelAva(user) {
    let p = document.querySelector('div[aria-label="Global Navigation"] > div > span > ul');
    if (!p) return;

    let firstChild = p.firstChild;
    let newChild = firstChild.cloneNode(true);
    newChild.querySelector('li > a').setAttribute('href', 'javascript:;');
    
    let targetParent = newChild.querySelector('li > a > span > span');
    targetParent.querySelector('span:nth-child(2) > span').innerText = 'Ava';
    targetParent.firstChild.innerHTML = '<img style="border-radius: 50%;" src="https://ava-ui-prod.herokuapp.com/ava-icon.png" class="sc-open-icon" width="30" height="30"/>';
    
    var helpSpan = document.evaluate('//span[text()="Help"]', p, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null );
    var helpLi = helpSpan.singleNodeValue.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    p.insertBefore(newChild, helpLi);
    
    newChild.querySelector('li > a').addEventListener('click', function () {
      let left = screen.width - 620;
      let height = (window.innerHeight + 54 >= screen.height) ? screen.height - 54 : window.innerHeight;
      console.log('window height:', height);
      let params = 'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=600,height=' + height + ',top=10,left=' + left;
      window.open(user.avaUrl, 'Ava', params);
    });
  }
}

(function() {
  if (!document.querySelector('#avaLauncher')) {
    new AvaUI();
  }
  
  if (document.querySelector('#mobile-header > button')) {
    document.querySelector('#mobile-header > button').addEventListener('click', function () {
      new AvaUI();
    });
  }

}) ();
