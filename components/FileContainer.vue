<template>
  <el-card v-show="fileList && fileList.length > 0" shadow="always">
    <div v-for="(file, index) in fileList" :key="file.name" class="container-item">
      <i class="el-icon-document"></i>
      {{ file.name }}
      <span class="delete-file-message" @click="cancelFile(index)">
        <i class="el-icon-delete" height="10"></i>
      </span>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    fileList: Array
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    cancelFile(index) {
      console.log('Before: ', Array.from(this.fileList));
      this.fileList.splice(index, 1);
      console.log('After: ', Array.from(this.fileList));
    }
  }
};
</script>
<style>
.container-item {
  padding: 5px 0;
}
</style>
