import axios from "axios";
import "~/lib/microsoft.cognitiveservices.speech.sdk.bundle";

var AudioContext = window.AudioContext || window.webkitAudioContext || false;

class SpeechSDKHelper {
  constructor() {
    console.log('SpeechSDKHelper constructor');
    this.SpeechSDK = window.SpeechSDK;
    this.recognizer = undefined;
    this.synthesizer = undefined;
    this.host = window.location.protocol + "//" + window.location.host;
    this.enabled = false;
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
    this.stt();
    this.enabled = true;
    this.synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, SpeechSDK.AudioConfig.fromDefaultSpeakerOutput());
  }

  stop() {
    if (!this.enabled) {
      return;
    }

    this.enabled = false;
    this.recognizer.stopContinuousRecognitionAsync(() => {},error => {});
    this.recognizer = undefined;

    this.synthesizer.close();

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
    this.synthesizer.speakTextAsync(
      inputText,
      result => {
        if (result) {
            console.log(JSON.stringify(result));
        }
        // this.synthesizer.close();
      },
      error => {
        console.log(error);
        // this.synthesizer.close();
      });
  }

}
  
export default new SpeechSDKHelper();