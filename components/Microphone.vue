<template>
  <div class="sc-user-input--button">
    <i
      class="el-icon-microphone"
      :style="{ color: enabled ? 'red' : 'grey' }"
      v-on:click="enable()"
    ></i>
  </div>
</template>

<script>
import SpeechSDKHelper from  "~/lib/speech.sdk.helper";

export default {
  data() {
    return {
      enabled: false,
    };
  },
  async mounted() {
  },
  methods: {
    async enable() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        await SpeechSDKHelper.start();
      } else {
        SpeechSDKHelper.stop();
      }
    }
  }
};
</script>
<style>
</style>
