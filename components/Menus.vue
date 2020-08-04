<template>
  <div>
    <el-popover
      placement="bottom"
      width="300"
      trigger="manual"
      v-model="visible"
    >
      <el-menu
        class="el-menu-vertical-demo"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1">
          <i class="el-icon-s-comment"></i>
          <span>Make a suggestion</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-bell"></i>
          <span>Notification preferences</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-setting"></i>
          <span>Update method of contact</span>
        </el-menu-item>
      </el-menu>
      <el-button
        class="menuContainer"
        slot="reference"
        @click="visible = !visible"
      >
        <img
          class="menuIcon"
          v-bind:src="visible ? '/cross.png' : '/bars.png'"
        />
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$emit("onMenuSelected", key);
    }
  }
};
</script>
<style>
.el-popover {
  padding: 0;
}
.el-popper .popper__arrow::after {
  content: '';
  border-width: 0;
}
.menuContainer {
  background-color: transparent;
  border: 0;
  padding: 10px;
  vertical-align: middle;
}
.menuContainer:focus {
  background-color: transparent;
}
.menuContainer:not(:focus) {
  background-color: transparent;
}
.menuContainer .menuIcon {
  width: 36px;
  height: 36px;
  align-self: center;
}
</style>
