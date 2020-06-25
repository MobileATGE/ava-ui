import axios from "axios";
import "~/lib/microsoft.cognitiveservices.speech.sdk.bundle";

var AudioContext = window.AudioContext || window.webkitAudioContext || false;
var isPlayerActive = false;

class SpeechSDKHelper {
  constructor() {
    console.log('SpeechSDKHelper constructor');
    this.SpeechSDK = window.SpeechSDK;
    this.recognizer = undefined;
    this.host = window.location.protocol + "//" + window.location.host;
    this.enabled = false;
    this.authorization = undefined;
  }

  async start() {
    try {
      this.authorization = await this.getSpeechToken();
    } catch (e) {
      console.log('Failed to get token'. e);
    }
  
    let speechConfig = this.SpeechSDK.SpeechConfig.fromAuthorizationToken(
      this.authorization.data.token,
      this.authorization.data.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.enableDictation();

    let audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    this.recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
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
    isPlayerActive = true;

    let speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
      this.authorization.data.token,
      this.authorization.data.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.speechSynthesisVoiceName = "en-US-BenjaminRUS";
    speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
    
    let player = new SpeechSDK.SpeakerAudioDestination();
    player.onAudioEnd = function (_) {
      window.console.log("playback finished");
      isPlayerActive = false;
    }

    let audioConfig = SpeechSDK.AudioConfig.fromSpeakerOutput(player)
    let synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.synthesisStarted = function (s, e) {
      console.log('synthesisStarted');
      isPlayerActive = true;
    }
    synthesizer.synthesisCompleted = function (s, e) {
      console.log('synthesisCompleted');
    }

    synthesizer.speakTextAsync(
      inputText,
      result => {
        window.console.log(result);
        synthesizer.close();
        synthesizer = undefined;
      },
      error => {
        window.console.log(err);
        synthesizer.close();
        synthesizer = undefined;
      }
    );
  }
}
  
export default new SpeechSDKHelper();