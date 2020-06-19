<template>
  <div class="sc-user-input--button">
    <i
      class="el-icon-microphone"
      :style="{ color: enabled ? 'red' : 'grey' }"
      v-on:click="stt()"
    ></i>
  </div>
</template>

<script>
import "~/lib/microsoft.cognitiveservices.speech.sdk.bundle";

export default {
  data() {
    return {
      SpeechSDK: window.SpeechSDK,
      soundContext: new AudioContext(),
      recognizer: null,
      synthesizer: null,
      host: window.location.protocol + "//" + window.location.host,
      enabled: false,
    };
  },
  async mounted() {
    const authorization = await this.getSpeechToken();
    let speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
      authorization.token,
      authorization.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.enableDictation();
    let audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    this.recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    this.synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
  },
  methods: {
    async getSpeechToken() {
      return await this.$axios.$get(`${this.host}/api/speech/token`);
    },
    async stt() {
      this.enabled = !this.enabled;

      if (!this.enabled) {
        this.recognizer.stopContinuousRecognitionAsync(() => {},error => {});
        return;
      }

      this.recognizer.recognizing = function(s, e) {
        if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
          document.querySelector(".sc-user-input--text").textContent =
            e.result.text;
        }
      };

      this.recognizer.recognized = function(s, e) {
        if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
          document.querySelector(".sc-user-input--text").textContent =
            e.result.text;
        }
      };

      this.recognizer.sessionStopped = function(s, e) {
        this.enabled = false;
      };

      this.recognizer.startContinuousRecognitionAsync(
        () => {},
        error => {}
      );
    },
    async tts(inputText) {
        synthesizer.speakTextAsync(
          inputText,	  
          function (result) {
            window.console.log(result.text);

            if (result.audioData && this.soundContext) {
              var source = this.soundContext.createBufferSource();
              this.soundContext.decodeAudioData(result.audioData, function (newBuffer) {
                source.buffer = newBuffer;
                source.connect(this.soundContext.destination);
                source.start(0);
              });
            }

            // synthesizer.close();
            // synthesizer = undefined;
          },
          function (err) {
            window.console.log(err);
            synthesizer.close();
            synthesizer = undefined;
          });
    },
  }
};
</script>
<style>
</style>
