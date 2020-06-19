import axios from "axios";

class SpeechHelper {
  constructor() {
    this.region = process.env.SPEECH_REGION;
    console.log('region', this.region);
    this.url = process.env.SPEECH_ISSUE_TOKEN_URL.replace('SPEECH_REGION', this.region);
  }
  async getToken() {
    const response = await axios.post(
      this.url,
      {},
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.SPEECH_KEY,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    return { token: response.data, region: this.region };
  }
}

export default new SpeechHelper();
