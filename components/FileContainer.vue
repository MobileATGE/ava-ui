<template>
  <el-card v-show="fileList && fileList.length > 0" shadow="always">
    <div v-for="(file, index) in fileList" :key="file.name" class="container-item">
      <i class="el-icon-document"></i>
      {{ file.name }}
      <span class="delete-file-message" @click="cancelFile(index)">
        <i class="el-icon-circle-close custom-icon" height="10"></i>
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
      this.fileList.splice(index, 1);
    }
  }
};
</script>
<style>
.container-item {
  padding: 5px 0;
}

.container-item > span {
  font-style: normal;
  float: right;
  cursor: pointer;
  color: #c8cad0;
}

.container-item > span:hover {
  color: #c8cad0;
}

.custom-icon {
  font-size: 1.2em;
}
</style>
