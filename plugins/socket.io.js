import Vue from "vue";
import * as io from "socket.io-client";
import VueSocketIO from "vue-socket.io-extended";

const socket = io("wss://mobile-common-services-qa.herokuapp.com", {
  transports: ["websocket"]
});

export default () => {
  Vue.use(VueSocketIO, socket);
};
