<template>
  <el-carousel indicator-position="outside" :autoplay="false">
    <el-carousel-item v-for="(item, index) in items" :key="index">
      <div v-html="item.outerHTML"></div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    };
  },
  props: ["items"]
};
</script>
<style>
@media only screen and (min-width: 400px) {
  .el-carousel {
    min-width: 220px;
  }
}
@media only screen and (min-width: 680px) {
  .el-carousel {
    min-width: 320px;
  }
}
@media only screen and (min-width: 768px) {
  .el-carousel {
    min-width: 410px;
  }
}
.el-carousel__arrow:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
.el-carousel__arrow > i {
  color: white;
  font-size: 2em;
}
.item {
  padding: 15px;
  line-height: 2em;
}
.el-carousel__item {
  background-color: #caf1c89f;
  margin: 0 auto;
}
.el-carousel__button,
.el-carousel__indicators--outside button {
  background-color: #1da3169f;
  height: 12px;
  width: 12px;
  border-radius: 6px;
}
</style>
