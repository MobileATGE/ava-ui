<template>
    <el-button icon="el-icon-microphone" v-on:click="stt()"></el-button>
</template>

<script>
import "~/lib/microsoft.cognitiveservices.speech.sdk.bundle";

export default {
  data() {
    return {
      SpeechSDK: window.SpeechSDK,
      host: window.location.protocol + "//" + window.location.host,
    };
  },
  methods: {
    async stt() {
      const authorizationToken = await this.getSpeechToken();
      let speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, "westus");
      speechConfig.speechRecognitionLanguage = "en-US";
      speechConfig.enableDictation();
      let audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      let recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizing = function (s, e) {
          if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
            document.querySelector('.sc-user-input--text').textContent = e.result.text;
          }
        };

        recognizer.recognized = function (s, e) {
          if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
            document.querySelector('.sc-user-input--text').textContent = e.result.text;
          }
        };

        recognizer.sessionStarted = function (s, e) {
          window.console.log("sessionStarted", e);
        };

        recognizer.sessionStopped = function (s, e) {
          window.console.log("sessionStarted", e);
          // sdkStartContinousRecognitionBtn.disabled = false;
          // sdkStopContinousRecognitionBtn.disabled = true;
        };

        recognizer.startContinuousRecognitionAsync(()=>{}, (error)=>{});
    },
    async getSpeechToken() {
      return await this.$axios.$get(`${this.host}/api/speech/token`);
    }

  }
};
</script>
<style>
</style>
