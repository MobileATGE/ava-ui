<template>
  <div class="preferences">
    <el-dialog
      title="Your current information for notifications is below:"
      width="80%"
      :visible.sync="dialogVisible"
      v-bind:modal="false"
      :before-close="beforeClose"
    >
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-row> Email: {{ feedbackEmail }} </el-row>
            <br />
            <el-row> Phone: {{ phone }} </el-row>
          </el-col>
        </el-row>
        <el-row>
          <br />
          <div class="statement">
            By selecting one of the following options, you are providing concent to receive notifocations for the selected topic:
          </div>
        </el-row>
        <el-row>
          <br />
          <table>
            <thead>
              <tr>
                <th>Notification</th>
                <th>When</th>
                <th>Text Notification</th>
                <th>Email Notification</th>
              </tr>
            </thead>
            <tr>
              <td>Course Announcement</td>
              <td>Immediately</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr class="stripe">
              <td>Assignment</td>
              <td>Bi-Weekly:<br />Wednesday/Saturday</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
            <tr>
              <td>Discussions</td>
              <td>Bi-Weekly:<br />Wednesday/Saturday</td>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
            </tr>
          </table>
        </el-row>
        <el-row>
          <br />
          <div class="statement">
            If you want to opt out of all notifications please leave all boxes blank
          </div>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit('formName')">Update</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["dsi", "conversationId", "feedbackEmail", "phone"],
  data() {
    return {
      dialogVisible: true,
      formLabelWidth: "120px"
    };
  },
  mounted() {
    console.log("this.dialogVisible:", this.dialogVisible);
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      console.log("rowIndex=", rowIndex);
      console.log("rowIndex===1", rowIndex === 1);
      if (rowIndex === 1) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    submit() {},
    beforeClose() {
      this.reset();
    },
    reset() {
      this.$emit("onClose", 0);
    }
  }
};
</script>
<style>
/* .preferences .el-dialog {
  background-color: #c5cae5 !important;
  border: solid 1px rgba(0, 0, 0, 0.5);
}
.preferences .el-dialog__header {
  background-color: #345bb7;
}
.preferences .el-dialog__title {
  font-size: 1em;
  font-weight: bold;
  color: white;
}
.el-button--primary {
  background-color: #013a81 !important;
} */

.preferences {
  font-family: arial, sans-serif;
  font-weight: 600;
}
.preferences table {
  width: 100%;
  background-color: rgba(256, 256, 256, 0.5);
}
.preferences table > thead {
  color: white;
  background-color: #345bb7;
}
.preferences table th,
.preferences table td {
  padding: 0.5em 1em;
  height: 3em;
  text-align: left;
  width: 25%;
}
.preferences table td {
  background-color: #d0d5e8;
}
.stripe td {
  background-color: #e2e9f4 !important;
}
.preferences input[type="checkbox"] {
  width: 2em;
  height: 2em;
}
.statement {
  padding: 0.5em 1em;
  border: 1px solid black;
  background-color: white;
}
</style>
