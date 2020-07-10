<template>
  <div>
    <el-button class="menuContainer" type="text" @click="showForm">
      <img id="menuIcon" src="/bars.png" />
    </el-button>

    <el-dialog
      class="suggestion"
      title="Make a suggestion"
      :visible.sync="dialogFormVisible"
      v-bind:modal="false"
      :before-close="beforeClose"
    >
      <el-form
        :model="suggestionForm"
        ref="suggestionForm"
        label-position="top"
      >
        <el-form-item
          label="Select a topic."
          prop="topic"
          :label-width="formLabelWidth"
          :rules="[
            {
              required: true,
              message: 'Please select a topic.',
              trigger: 'change'
            }
          ]"
        >
          <el-select
            v-model="suggestionForm.topic"
            placeholder="Please select a topic"
          >
            <el-option label="New Idea" value="idea"></el-option>
            <el-option label="Feedback" value="feedback"></el-option>
            <el-option label="Other" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="sugestionLabel"
          label="Suggestion."
          prop="suggestion"
          :label-width="formLabelWidth"
          :rules="[
            {
              required: true,
              message: 'Please type your suggestion here.',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 250,
              message: 'Length should be 1 to 250',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            type="textarea"
            v-model="suggestionForm.suggestion"
            placeholder="Type your suggestion here."
            rows="3"
            maxlength="250"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-row>
            <el-checkbox v-model="suggestionForm.comtactMe" />
            It is OK for Ava to contact me about my suggestion.
        </el-row>
        <el-row v-show="suggestionForm.comtactMe">
            We will contact you at {{ feedbackEmail }}.
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('suggestionForm')"
          >Submit</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['feedbackEmail'],
  data() {
    return {
      dialogFormVisible: false,
      suggestionForm: {
        topic: '',
        suggestion: '',
        comtactMe: false,
        date: ''
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.openConfirmBox();
          this.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
    },
    showForm() {
      document.querySelector('#menuIcon').src = "/cross.png";
      this.dialogFormVisible = true;
    },
    beforeClose() {
      this.reset();
    },
    openConfirmBox() {
      this.$confirm('Thank you for your suggestion.', '', {
        confirmButtonText: 'OK',
        showCancelButton: false,
        type: 'success',
        beforeClose: (action, instance, done) => {
          this.reset();
          done();
        }
      }).then(() => {
        this.dialogFormVisible = false;
        document.querySelector('.el-form').reset();
      });
    },
    reset() {
      this.dialogFormVisible = false;
      this.suggestionForm.topic = '';
      this.suggestionForm.suggestion = '';
      this.suggestionForm.comtactMe = false;
      document.querySelector('#menuIcon').src = "/bars.png";
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
