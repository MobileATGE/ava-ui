import axios from "axios";
import "~/lib/microsoft.cognitiveservices.speech.sdk.bundle";

var AudioContext = window.AudioContext || window.webkitAudioContext || false;

class SpeechSDKHelper {
  constructor() {
    console.log('SpeechSDKHelper constructor');
    this.SpeechSDK = window.SpeechSDK;
    this.recognizer = undefined;
    this.host = window.location.protocol + "//" + window.location.host;
    this.enabled = false;
    this.speechConfig = undefined;
  }

  async start() {
    let authorization;
    try {
      authorization = await this.getSpeechToken();
    } catch (e) {
      console.log('Failed to get token'. e);
    }
  
    let speechConfig = this.SpeechSDK.SpeechConfig.fromAuthorizationToken(
      authorization.data.token,
      authorization.data.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.enableDictation();
    let audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    this.recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    this.synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
    this.speechConfig = speechConfig;
    this.stt();
    this.enabled = true;
  }

  stop() {
    if (!this.enabled) {
      return;
    }

    this.enabled = false;
    this.recognizer.stopContinuousRecognitionAsync(() => {},error => {});
    this.recognizer = undefined;
  }

  async getSpeechToken() {
    return await axios.get(`${this.host}/api/speech/token`);
  }

  stt() {
    this.recognizer.recognizing = function(s, e) {
      if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
        document.querySelector(".sc-user-input--text").textContent = e.result.text;
      }
    };

    this.recognizer.recognized = function(s, e) {
      if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
        document.querySelector(".sc-user-input--text").textContent = e.result.text;
      }
    };

    this.recognizer.sessionStopped = function(s, e) {
      this.enabled = false;
    };

    this.recognizer.startContinuousRecognitionAsync(() => {}, error => {});
  }

  tts(inputText) {
    if (!this.enabled) {
      return;
    }
    console.log("how many time is called", inputText);

    var soundContext = undefined;
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext || false;
      if (AudioContext) {
        soundContext = new AudioContext();
      } else {
        alert("AudioContext not supported");
      }
    }
    catch(e){
      window.console.log("no sound context found, no audio output. " + e);
    }

    let synthesizer = new SpeechSDK.SpeechSynthesizer(this.speechConfig);

    synthesizer.speakTextAsync(
      inputText,	  
      function (result) {
        window.console.log('audioData size=', result.audioData.byteLength);

        if (result.audioData && soundContext) {
          console.log('has audio data');
          var source = soundContext.createBufferSource();
          soundContext.decodeAudioData(result.audioData, function (newBuffer) {
            source.buffer = newBuffer;
            source.connect(soundContext.destination);
            source.start(0);
          });
        } else {
          console.log('no audio data');
        }

        synthesizer.close();
        synthesizer = undefined;
      },
      function (err) {
        window.console.log(err);
        synthesizer.close();
        synthesizer = undefined;
      }
    );
  }

}
  
export default new SpeechSDKHelper();