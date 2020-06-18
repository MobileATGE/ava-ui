import axios from "axios";

class SpeechHelper {
  async getToken() {
    const response = await axios.post(
      process.env.SPEECH_ISSUE_TOKEN_URL,
      {},
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.SPEECH_KEY,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    return response.data;
  }
}

export default new SpeechHelper();
