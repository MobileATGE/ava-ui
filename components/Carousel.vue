<template>
  <div class="block">
    <el-carousel indicator-position="outside" :autoplay="false">
      <el-carousel-item v-for="(item, index) in items" :key="index">
        <div class="item">
          <p class="sc-message--text-content" v-html="item.outerHTML"></p>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
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
.el-carousel {
  min-width: 300px;
  min-height: 300px;
}
.el-carousel__arrow {
  background-color:rgba(0,0,0,0.5);
}
/* .el-carousel__arrow:hover {
  background-color:black;
} */
.el-carousel__arrow > i {
  color:white;
  font-size: 2em;
}
.item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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
