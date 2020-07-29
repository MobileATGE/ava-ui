import axios from "axios";

class BackendHelper {
  constructor() {
  }
  /**
   * Get Canvas sis_user_id from Canvas id.
   * @param {*} id 
   */
  async postAgentStart(files) {
    const response = await axios.post(
      `http://localhost:3000/api/v1/ava/agent/start`,
      {
        "message": {
          "from": "D40373764",
          "message": "test"
        },
        "isOpen": true,
        "session": {
          "id": "test",
          "channelId": "msteams",
          "user_id": "test",
          "user_name": "Gwowen Fu",
          "conversation_id": "test",
          "bot_id": "test",
          "bot_name": "Ava [Beta]",
          "serviceurl": "https://smba.trafficmanager.net/amer/"
        },
        files: files
      },
      {
        headers: {
          "authorization": "AtvaUJKoloIn6yFZa08tG6u4puY9HaRS4yfOUX6a8pc=",
          "dsi": "D40373764",
          "Content-Type": "application/json"
        }
      }
    );
    console.log('Response: ', response.data);
    return { data: response.data };
  }
}

export default new BackendHelper();