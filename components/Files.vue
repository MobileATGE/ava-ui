<template>
  <div class="sc-user-input--button">
    <i class="el-icon-paperclip"
      ><input type="file" id="file-selector" multiple
    /></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: undefined
    };
  },
  mounted() {
    const fileSelector = document.getElementById("file-selector");
    fileSelector.addEventListener("change", event => {
      this.fileList = event.target.files;
      console.log("this.fileList:", this.fileList);
      let fileArray = [];
      for (var i = 0; i < this.fileList.length; i++) {
        // get item
        let f = this.fileList[i];
        if (f.size > 10000000) {
          // alert(`${f.name} size : ${f.size}`);
          this.$message({
            showClose: true,
            message: `WARNING: File [${f.name}] is too large to upload to Ava. File size_bytes:[${f.size}]. Max size allowed:[10000000]`,
            type: 'error',
            duration: 0
          });
        } else {
          fileArray.push(f);
        }   
      }
      console.log(fileArray);
      this.$emit("onFilesChange", fileArray);
      fileSelector.value = '';
    });
  },
  methods: {}
};
</script>
<style></style>
