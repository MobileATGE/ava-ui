import axios from "axios";
import "~/lib/microsoft.cognitiveservices.speech.sdk.bundle";

var AudioContext = window.AudioContext || window.webkitAudioContext || false;
var isPlayerActive = false;
var recognizer = undefined;

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
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    recognizer.recognizing = function(s, e) {
      if (isPlayerActive) return;
      if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
        document.querySelector(".sc-user-input--text").textContent = e.result.text;
      }
    };

    recognizer.recognized = function(s, e) {
      if (isPlayerActive) return;
      if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
        document.querySelector(".sc-user-input--text").textContent = e.result.text;
      }
    };

    recognizer.sessionStopped = function(s, e) {
      this.enabled = false;
    };

    recognizer.startContinuousRecognitionAsync(() => {}, error => {});
    this.enabled = true;
  }

  stop() {
    if (!this.enabled) {
      return;
    }
    this.enabled = false;
    recognizer.stopContinuousRecognitionAsync(() => {},error => {});
    recognizer = undefined;
  }

  async getSpeechToken() {
    return await axios.get(`${this.host}/api/speech/token`);
  }

  tts(inputText) {
    if (isPlayerActive) return;
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