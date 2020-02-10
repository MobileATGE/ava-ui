import Vue from "vue";
import * as io from "socket.io-client";
import VueSocketIO from "vue-socket.io-extended";

const isProd = process.env.DEPLOY_ENV === "GH_PAGES";
let socket;

console.log('isProd=' + isProd)

if (isProd) {
  socket = io("wss://mobile-common-services-qa.herokuapp.com", {
    transports: ["websocket"]
  })
} else {
  socket = io("ws://localhost:3000", {
    transports: ["websocket"]
  })
}

export default () => {
  Vue.use(VueSocketIO, socket)
}
