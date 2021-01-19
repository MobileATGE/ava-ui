<template>
  <div class="menus">
    <el-popover
      placement="bottom"
      width="300"
      trigger="manual"
      v-model="visible"
    >
      <el-menu
        class="el-menu-vertical-demo"
        @select="handleSelect"
        background-color="#fff"
        text-color="#000"
        active-text-color="#000"
      >
        <el-menu-item index="1">
          <i class="el-icon-s-comment"></i>
          <span>Make a suggestion</span>
        </el-menu-item>

        <el-tooltip placement="bottom">
          <div class="wrap" slot="content">Ava can send text or email notifications to let you know a course announcement has been posted and an upcoming assignment or discussion is due. You can opt into notifications below.</div>
          <el-menu-item index="2">
            <i class="el-icon-bell"></i>
            <span>Notification preferences</span>
          </el-menu-item>
        </el-tooltip>
      </el-menu>
      <el-button
        class="menuContainer"
        slot="reference"
        @click="switchVisibility"
      >
        <img
          class="menuIcon"
          v-bind:src="isOpen ? '/cross.png' : '/bars.png'"
        />
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      visible: false,
      key: 0
    };
  },
  computed: {
    ...mapState('menu', ['isOpen'])
  },
  methods: {
    ...mapActions('menu', ['showMenu']),
    switchVisibility() {
      this.visible = !this.visible;
      this.showMenu(this.visible)
    },
    handleSelect(key, keyPath) {
      this.key = key;
      this.visible = key == 0;
      this.$emit("onMenuSelected", key);
    }
  }
};
</script>
<style>
.menus .el-popover {
  padding: 0;
}
.menus .el-popper .popper__arrow::after {
  content: '';
  border-width: 0;
}
.menus .menuContainer {
  background-color: transparent;
  border: 0;
  padding: 10px;
  vertical-align: middle;
}
.menus .menuContainer:focus {
  background-color: transparent;
}
.menus .menuContainer:not(:focus) {
  background-color: transparent;
}
.menus .menuContainer .menuIcon {
  width: 36px;
  height: 36px;
  align-self: center;
}
.el-dialog {
  background-color: #e2e9f4 !important;
  border: solid 1px rgba(0, 0, 0, 0.5);
}
.el-dialog__header {
  background-color: #345bb7;
}
.el-dialog__title {
  font-size: 1em;
  font-weight: bold;
  color: white;
}
.el-button--primary {
  background-color: #013a81 !important;
}
.el-dialog__headerbtn {
  display: none;
}
.wrap {
  word-wrap: break-word;
  width: 380px;
}
</style>
