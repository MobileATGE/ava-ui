(function() {
    'use strict';

    console.log('Start AVA Webchat Client');
  
    let options = {
      'credentials' : 'same-origin',
      'headers' : {
        'accept' : 'application/json'
      }
    };

    let user = {};

    fetchProfile();

    function fetchProfile() {
      fetch('/api/v1/users/self/profile', options)
        .then(checkStatus)
        .then(parseJSON)
        .then(updateUser)
        .then(includeAva)
        .catch(function(error) {
        console.log('Unable to lookup user information ', error);
      });
    }

    function parseJSON(response) {
      return response.json();
    }

    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }

    function updateUser(data) {
      console.log(data);
      user.login_id = data.login_id;
      user.name = data.name;
      user.primary_email = data.primary_email;
      user.avatar = data.avatar_url;
      user.showAva = false;
      return user;
    }

    function includeAva() {
      avaButton();
      let url = 'https://ava-ui-qa.herokuapp.com/chat/';
      let params = '?id=' + user.login_id + '&name=' + user.name + '&email=' + user.primary_email + '&avatar=' + user.avatar;
      user.avaUrl = url + params;
    }

    function avaButton() {
      let g = document.createElement('button');
      g.innerHTML = '<img style="border-radius: 50%;" src="https://ava-ui-qa.herokuapp.com/ava-icon.png" class="sc-open-icon" width="30" height="30"/>';
      g.setAttribute("id", 'avaLauncher');
      g.style.cssText = 'position:fixed;bottom:40px;right:15px;opacity:1;z-index:11;background-color:rgba(0,0,0,0);width:4em;height:4em;border-radius:50%;outline:none;';
      document.body.appendChild(g);
      document.querySelector('#avaLauncher').addEventListener('click', showAva);
    }

    function showAva() {
      window.open(user.avaUrl, '_blank');
    }

})();
