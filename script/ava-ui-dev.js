(function() {
    'use strict';

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
      let url = 'https://ava-ui-dev.herokuapp.com/chat/';
      let params = '?id=' + user.login_id + '&name=' + user.name + '&email=' + user.primary_email + '&avatar=' + user.avatar;
      user.avaUrl = url + params;
    }

    function avaButton() {
      let g = document.createElement('button');
      g.innerHTML = '<img data-v-542b4c99="" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiPjxyZWN0IGlkPSJiYWNrZ3JvdW5kcmVjdCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgeD0iMCIgeT0iMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIi8+PGRlZnM+PHN0eWxlPi5he2ZpbGw6bm9uZTt9LmJ7ZmlsbDojNGU4Y2ZmO30uY3tjbGlwLXBhdGg6dXJsKCNhKTt9LmR7ZmlsbDojZmZmO30uZXtmaWxsOiNlZmY0Zjk7fTwvc3R5bGU+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBjbGFzcz0iYSIgZD0iTSAwIDAgSCAxNy41NTUgdiAxNy41NTUgSCAwIFoiIGlkPSJzdmdfMSIgdHJhbnNmb3JtPSIiLz48L2NsaXBQYXRoPjwvZGVmcz48ZyBjbGFzcz0iY3VycmVudExheWVyIiBzdHlsZT0iIj48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PGcgaWQ9InN2Z18yIiBjbGFzcz0ic2VsZWN0ZWQiIHRyYW5zZm9ybT0iIj48ZyBpZD0ic3ZnXzMiIHRyYW5zZm9ybT0iIj48ZyBjbGFzcz0iYyIgaWQ9InN2Z180IiB0cmFuc2Zvcm09IiI+PGcgaWQ9InN2Z181IiB0cmFuc2Zvcm09IiI+PHBhdGggY2xhc3M9ImQiIGQ9Ik0gMTcuNTU2IDguNzc4NDIgYSA4Ljc3OCA4Ljc3OCAwIDAgMCAtOC43NzggLTguNzc4IGEgOC43NzggOC43NzggMCAwIDAgLTguNzc4IDguNzc4IGEgOC43NDUgOC43NDUgMCAwIDAgMi4yNiA1Ljg3OSB2IDEuNDQyIGMgMCAwLjggMC40OTIgMS40NTcgMS4xIDEuNDU3IGggNS44MyBhIDAuODQzIDAuODQzIDAgMCAwIDAuMTgzIC0wLjAyIGEgOC43NzggOC43NzggMCAwIDAgOC4xODQgLTguNzU3IiBpZD0ic3ZnXzYiIHRyYW5zZm9ybT0iIi8+PC9nPjxnIGlkPSJzdmdfNyIgdHJhbnNmb3JtPSIiPjxwYXRoIGNsYXNzPSJlIiBkPSJNIDMuMTYxNDggOC45MjEgYSA5LjI5MiA5LjI5MiAwIDAgMSA2LjM4IC04Ljg4OCBjIC0wLjI1MiAtMC4wMjIgLTAuNTA2IC0wLjAzMyAtMC43NjMgLTAuMDMzIGEgOC43NzQgOC43NzQgMCAwIDAgLTguNzc4IDguNzc4IEEgOS41MDggOS41MDggMCAwIDAgMi4yMjQ0NyAxNC43MDAzIGMgMC4wMDUgMCAwIDAuMDA5IDAgMC4wMSBjIC0wLjMxMSAwLjM1MiAtMS45MjQgMi44NDkgMC4wMjEgMi44NDkgaCAyLjI1IGMgLTEuMjMgLTAuMDIyIDEuMjYzIC0yLjEwNyAwLjI2OSAtMy40OTQgYSA4LjIyNSA4LjIyNSAwIDAgMSAtMS42IC01LjE0MSIgaWQ9InN2Z184IiB0cmFuc2Zvcm09IiIvPjwvZz48L2c+PC9nPjwvZz48L2c+PC9zdmc+" alt="default" class="sc-open-icon">';
      g.setAttribute("id", 'avaLauncher');
      g.style.cssText = 'position:fixed;bottom:40px;right:15px;opacity:1;z-index:11;background-color:#013A81;width:3em;height:3em;border-radius:50%;outline:none;';
      document.body.appendChild(g);
      document.querySelector('#avaLauncher').addEventListener('click', showAva);
    }

    function showAva() {
      window.open(user.avaUrl, '_blank');
    }

})();
