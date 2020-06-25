import axios from "axios";
import "~/lib/microsoft.cognitiveservices.speech.sdk.bundle";

let recognizer = undefined;
let synthesizer = undefined;
let player = undefined;
let speechConfig = undefined;

// Detect Firefox 
let firefoxAgent = navigator.userAgent.indexOf("Firefox") > -1; 

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
  
    speechConfig = this.SpeechSDK.SpeechConfig.fromAuthorizationToken(
      this.authorization.data.token,
      this.authorization.data.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.enableDictation();

    let audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    recognizer.recognizing = function(s, e) {
      if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
        document.querySelector(".sc-user-input--text").textContent = e.result.text;
      }
    };

    recognizer.recognized = function(s, e) {
      console.log('recognized e.result.text=', e.result.text);
      if (e.result.reason !== SpeechSDK.ResultReason.NoMatch) {
        document.querySelector(".sc-user-input--text").textContent = e.result.text;
      }
    };

    recognizer.speechEndDetected = function(s, e) {
      console.log('speechEndDetected');
    };

    recognizer.sessionStopped = function(s, e) {
      console.log('sessionStopped');
    };

    recognizer.startContinuousRecognitionAsync(() => {}, error => {});
    this.enabled = true;

    if (!firefoxAgent) {
      this.initSynthesizer();
    }

  }

  initSynthesizer() {
    speechConfig.speechSynthesisVoiceName = "en-US-BenjaminRUS";
    speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
    
    player = new SpeechSDK.SpeakerAudioDestination();
    player.onAudioEnd = function (_) {
      window.console.log("playback finished");
    }

    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, SpeechSDK.AudioConfig.fromSpeakerOutput(player));
    synthesizer.synthesisStarted = function (s, e) {
      console.log('synthesisStarted');
    }
    synthesizer.synthesisCompleted = function (s, e) {
      console.log('synthesisCompleted');
    }
  }

  stop() {
    if (!this.enabled) {
      return;
    }
    this.enabled = false;
    recognizer.stopContinuousRecognitionAsync(() => {},error => {});
    recognizer = undefined;

    player.pause();
    player.close();

    if (!firefoxAgent) {
      synthesizer.close();
      synthesizer = undefined;
    }
  }

  async getSpeechToken() {
    return await axios.get(`${this.host}/api/speech/token`);
  }

  tts(inputText) {
    if (firefoxAgent) {
      this.initSynthesizer();
    }

    synthesizer.speakTextAsync(
      inputText,
      result => {
        window.console.log(result);
        if (firefoxAgent) {
          synthesizer.close();
          synthesizer = undefined;
        }
      },
      error => {
        window.console.log(err);
        if (firefoxAgent) {
          synthesizer.close();
          synthesizer = undefined;
        }
      }
    );
  }
}
  
export default new SpeechSDKHelper();