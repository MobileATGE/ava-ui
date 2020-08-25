<template>
  <el-dialog
      class="suggestion"
      title="Your current information for notifications is below:"
      :visible.sync="dialogVisible"
      v-bind:modal="false"
      :before-close="beforeClose"
  >
    <el-form>
      <el-row>
        Email: {{ feedbackEmail }}
      </el-row>
      <el-row>
        Phone: {{ phone }}.
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit('formName')">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['dsi', 'conversationId', 'feedbackEmail', 'phone'],
  data() {
    return {
      dialogVisible: true,
      formLabelWidth: "120px",
    };
  },
  mounted() {
    console.log('this.dialogVisible:', this.dialogVisible);
  },
  methods: {
    submit() {
    },
    beforeClose() {
      console.log('beforeClose');
      this.reset();
    },
    reset() {
      this.$emit("onClose", 0);
    }
  }
};
</script>
<style>
.menuContainer {
  padding: 10px;
  vertical-align: middle;
}
.menuContainer img {
  width: 36px;
  height: 36px;
  align-self: center;
}
.el-dialog__title {
  font-size: 1em;
  font-weight: bold;
  color: #013a81;
}
.el-dialog {
  background-color:#f6f6f6 !important;
  border: solid 1px;
}
.el-button--primary {
  background-color:#013A81 !important;
}
</style>