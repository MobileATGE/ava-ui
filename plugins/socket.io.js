import Vue from "vue";
import * as io from "socket.io-client";
import VueSocketIO from "vue-socket.io-extended";

// const socket = io('http://localhost:3000');
const socket =
  process.env.DEPLOY_ENV === "GH_PAGES"
    ? io("wss://mobile-common-services-qa.herokuapp.com")
    : io("ws://mobile-common-services-qa.herokuapp.com");

export default () => {
  Vue.use(VueSocketIO, socket);
};
