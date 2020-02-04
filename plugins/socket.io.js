import Vue from 'vue';
import * as io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io-extended';

const socket = io('http://localhost:3000');

export default () => {
  Vue.use(VueSocketIO, socket);
}
