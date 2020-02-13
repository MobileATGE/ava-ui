import Vue from "vue";
import * as io from "socket.io-client";
import VueSocketIO from "vue-socket.io-extended";

console.log(`Socket Server URL=${process.env.socketServerURL}`);

const socket = io(process.env.socketServerURL, {
  transports: ["websocket"]
});

export default () => {
  Vue.use(VueSocketIO, socket);
};
