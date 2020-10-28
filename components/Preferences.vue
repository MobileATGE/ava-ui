<template>
  <div class="preferences">
    <el-dialog
      title="Your current information for notifications is below:"
      width="90%"
      :visible.sync="dialogVisible"
      v-bind:modal="false"
      :before-close="beforeClose"
      :show-close="false"
      v-loading="loading"
      element-loading-text="Updating..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    >
      <el-form>
        <el-row>
          <el-col>
            <el-row> Email: {{ feedbackEmail }} &nbsp;&nbsp; <i class="el-icon-info"></i> <span class="desc">To forward emails to another inbox, <a href="https://cdn.brandfolder.io/991738N1/at/4txrg8hsgkb7g44cqtkfqk6s/HG_OUT_Forwarding_Email.pdf">follow these instructions</a>.</span></el-row>
            <br />
            <el-row> Phone: {{ phone }} &nbsp;&nbsp; <i class="el-icon-info"></i> <span class="desc">Please contact Student Services if you would like to update your Phone preference.</span></el-row>
          </el-col>
        </el-row>
        <el-row>
          <br />
          <p class="statement">
            By selecting one of the following options, you are providing consent
            to receive notifications for the selected topic:
          </p>
        </el-row>
        <el-row>
          <br />
          <div style="width: 100%; overflow: auto">
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
                <td><input type="checkbox" v-model="preferences.CourseAnnouncement.Text" /></td>
                <td><input type="checkbox" v-model="preferences.CourseAnnouncement.Email" /></td>
              </tr>
              <tr class="stripe">
                <td>Assignment</td>
                <td>Two Days Prior to Due Date</td>
                <td><input type="checkbox" v-model="preferences.Assignment.Text" /></td>
                <td><input type="checkbox" v-model="preferences.Assignment.Email" /></td>
              </tr>
              <tr>
                <td>Discussions</td>
                <td>Two Days Prior to Due Date</td>
                <td><input type="checkbox" v-model="preferences.Discussion.Text" /></td>
                <td><input type="checkbox" v-model="preferences.Discussion.Email" /></td>
              </tr>
            </table>
          </div>
        </el-row>
        <el-row>
          <br />
          <p class="statement">
            If you want to opt out of all notifications please leave all boxes
            blank
          </p>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submit('formName')">Update</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["dsi", "feedbackEmail", "phone", "preferences", "savePreferences"],
  data() {
    return {
      dialogVisible: true,
      formLabelWidth: "120px",
      loading: false
    };
  },
  mounted() {
    this.$nuxt.$on('preference_response', this.openConfirmBox);
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    submit() {
      this.loading = true;
      let data = {
        "Dnumber": this.dsi,
        "Notification": this.preferences
      }
      this.savePreferences(data);
    },
    beforeClose() {
      this.reset();
    },
    openConfirmBox(data) {
      this.loading = false;
      if (data.status == 1) {
        if (document.querySelector('.preferences input:checked')) {
          let textTypes = [];
          if (this.preferences.CourseAnnouncement.Text) { textTypes.push('course announcement'); }
          if (this.preferences.Assignment.Text) { textTypes.push('assignment'); }
          if (this.preferences.Discussion.Text) { textTypes.push('discussion'); }
          if (textTypes.length > 1) {
            textTypes[textTypes.length-1] = 'and ' + textTypes[textTypes.length-1];
          }
          
          let emailTypes = [];
          if (this.preferences.CourseAnnouncement.Email) { emailTypes.push('course announcement'); }
          if (this.preferences.Assignment.Email) { emailTypes.push('assignment'); }
          if (this.preferences.Discussion.Email) { emailTypes.push('discussion'); }
          if (emailTypes.length > 1) {
            emailTypes[emailTypes.length-1] = 'and ' + emailTypes[emailTypes.length-1];
          }

          let message = 'You have updated your notification preferences.';
          if (textTypes.length > 0) {
            message = message.concat(` You will now be notified with a text message at ${this.phone} for ${textTypes.join(', ')}.`);
          }
          if (emailTypes.length > 0) {
            message = message.concat(` You will now be notified with an email at ${this.feedbackEmail} for ${emailTypes.join(', ')}.`);
          }

          this.$confirm(message, "", {
            confirmButtonText: "Close",
            showCancelButton: false,
            type: "success"
          }).then(() => {
            this.reset();
          });
        } else {
          this.$confirm("You have opted out of all notifications.", "", {
            confirmButtonText: "Close",
            showCancelButton: false,
            type: "success"
          }).then(() => {
            this.reset();
          });         
        }
      } else {
        this.$confirm(data.message, "", {
          confirmButtonText: "Close",
          showCancelButton: false,
          type: "warning"
        }).then(() => {
          this.reset();
        });
      }
    },
    reset() {
      this.$emit("onClose", 0);
    }
  }
};
</script>
<style>
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  white-space: normal;
  word-break: normal;
}
/* .el-icon-loading {
  font-size: 2rem;
} */
.el-loading-spinner {
  top: 50%;
  left: 50%;
  margin-left: -55px;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 4px;
  width: auto;
  text-align: center;
  position: absolute;
  font-size: 2rem;
}
.el-loading-spinner .el-loading-text, .el-loading-spinner i {
  color: #eee;
}
.el-loading-mask {
  position: fixed;
}
i.el-icon-info {
  color: #606266;
}
.desc {
  color: #606266;
  font-family: Arial, Helvetica, sans-serif;
  white-space: normal;
  word-break: normal;
}
</style>
