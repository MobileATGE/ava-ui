<template>
  <div class="block">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="(item, index) in items" :key="index">
        <div class="item">
          <p class="sc-message--text-content" v-html="item.textContent"></p>
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
.item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.el-carousel__item {
  background-color: #1da3169f;
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
