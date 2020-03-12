<template>
  <article>
    <section>
      <h1>This is a testing page</h1>
      <el-row>
        <el-button>Default</el-button>
        <el-button type="primary">Primary</el-button>
        <el-button type="success">Success</el-button>
        <el-button type="info">Info</el-button>
        <el-button type="warning">Warning</el-button>
        <el-button type="danger">Danger</el-button>
      </el-row>
    </section>
    <section>
      <h1>This is a Carousel page</h1>
      <Carousel :items="[1,2,3,4,5]" />
    </section>
  </article>
</template>
<script>
import Carousel from '~/components/Carousel.vue'

export default {
  components: {
    Carousel
  }
}
</script>