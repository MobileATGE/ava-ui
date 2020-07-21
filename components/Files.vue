<template>
  <div class="sc-user-input--button">
    <i class="el-icon-paperclip"><input type="file" id="file-selector" multiple/></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: undefined,
    };
  },
  mounted() {
    const fileSelector = document.getElementById("file-selector");
    fileSelector.addEventListener("change", event => {
      this.fileList = event.target.files;
      this.$emit('onFilesChange', this.fileList);
    });
  },
  methods: {
  }
};
</script>
<style></style>
