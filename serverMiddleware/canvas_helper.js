import axios from "axios";

class CanvasHelper {
  constructor() {
    this.token = process.env.CANVAS_API_TOKEN;
    this.url = process.env.CANVAS_API_URL;
  }
  /**
   * Get Canvas sis_user_id from Canvas id.
   * @param {*} id 
   */
  async getLoginId(canvasId) {
    const response = await axios.get(
      `${this.url}/users/${canvasId}/profile`,
      {
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      }
    );
    const login_id = response.data.sis_user_id || '';
    return { login_id: login_id };
  }
}

export default new CanvasHelper();
