<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :icons="icons"
      :open="openChat"
      :showEmoji="false"
      :showFile="false"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="false"
      :showCloseButton="false"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
    >
      <template v-slot:header>
        <div class="sc-header--title enabled">
          <img :src="titleImageUrl" /> <span>Ava</span>
        </div>
      </template>
      <template v-slot:user-avatar="{ message, user }">
        <div
          class="sc-message--avatar"
          :style="{ backgroundImage: 'url(' + user.imageUrl + ')' }"
        ></div>
      </template>
      <template v-slot:text-message-body="scopedProps">
        <p
          v-if="scopedProps.message.data.meta"
          class="sc-message--meta"
          :style="{ color: '#666666' }"
        >
          {{ scopedProps.message.data.meta }}
        </p>
        <div v-if="scopedProps.message.data.type === 'survey'">
          <div class="card">
            <p
              class="sc-message--text-content"
              v-html="scopedProps.message.data.text"
            ></p>
            <div class="rating">
              <span>Not Satisfied</span>
              <span class="starBox" :star-id="scopedProps.message.id" :number-of-star="scopedProps.message.numberOfStar" :history="scopedProps.message.history">
                <img :src="Number(scopedProps.message.numberOfStar) > 0 ? '/star.png': '/starGray.png'" class="star" v-on:click="rate(1)" @mouseover="hoverStar(1)" @mouseleave="hoverStarOut"/>
                <img :src="Number(scopedProps.message.numberOfStar) > 1 ? '/star.png': '/starGray.png'" class="star" v-on:click="rate(2)" @mouseover="hoverStar(2)" @mouseleave="hoverStarOut"/>
                <img :src="Number(scopedProps.message.numberOfStar) > 2 ? '/star.png': '/starGray.png'" class="star" v-on:click="rate(3)" @mouseover="hoverStar(3)" @mouseleave="hoverStarOut"/>
                <img :src="Number(scopedProps.message.numberOfStar) > 3 ? '/star.png': '/starGray.png'" class="star" v-on:click="rate(4)" @mouseover="hoverStar(4)" @mouseleave="hoverStarOut"/>
                <img :src="Number(scopedProps.message.numberOfStar) > 4 ? '/star.png': '/starGray.png'" class="star" v-on:click="rate(5)" @mouseover="hoverStar(5)" @mouseleave="hoverStarOut"/>
              </span>
              <span>Satisfied</span>
            </div>
          </div>
        </div>

        <div v-else-if="scopedProps.message.data.type === 'carousel'">
          <Carousel :items="scopedProps.message.carouselItems" />
          <p
            class="sc-message--text-content"
            v-html="scopedProps.message.data.text"
          ></p>
          <div class="hide">
            ...............................................................................................................................................................
          </div>
        </div>

        <div v-else>
          <p
            class="sc-message--text-content"
            v-html="scopedProps.message.data.text"
          ></p>
        </div>
      </template>
    </beautiful-chat>
    <!-- <Microphone class="microphone" /> -->
    <Menus
      class="menu"
      @onMenuSelected="onMenuSelected"
    />
    <Suggestion v-show="menuSelected==1"
      :dsi="user.id"
      :conversationId="conversationId"
      :feedbackEmail="feedbackEmail"
      :saveFeedback="saveFeedback"
      @onClose="onSuggestionClose"
    />
    <Preferences v-show="menuSelected==2"
      :dsi="user.id"
      :conversationId="conversationId"
      :feedbackEmail="feedbackEmail"
      :phone="phone"
      @onClose="onSuggestionClose"
    />
    <Files v-show="agentMode ? true : false" class="files" @onFilesChange="onFilesChange" />
    <FileContainer id="fileContainer" :fileList="filesSelected" />
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import Vue from "vue";
import Chat from "vue-beautiful-chat";
import AvaIcon from "../static/ava-icon.png";
import GuestIcon from "../assets/guest-icon.png";
import CloseIcon from "../assets/close-icon.png";
import OpenIcon from "../assets/logo-no-bg.svg";
import FileIcon from "../assets/file.svg";
import CloseIconSvg from "../assets/close.svg";
import Carousel from "~/components/Carousel.vue";
import Microphone from "~/components/Microphone.vue";
import Menus from "~/components/Menus.vue";
import Suggestion from "~/components/Suggestion.vue";
import Preferences from "~/components/Preferences.vue";
import Files from "~/components/Files.vue";
import FileContainer from "~/components/FileContainer.vue";
// import SpeechSDKHelper from  "~/lib/speech.sdk.helper";
import FormData from "form-data";

Vue.use(Chat);

export default {
  name: "app",
  components: {
    Carousel,
    Microphone,
    Menus,
    Suggestion,
    Preferences,
    Files,
    FileContainer
  },
  data() {
    return {
      user: {},
      conversationId: "mobile" + new Date().getTime(),
      isConnected: false,
      socketMessage: "",
      icons: {
        open: {
          img: OpenIcon,
          name: "default"
        },
        close: {
          img: CloseIcon,
          name: "default"
        },
        file: {
          img: FileIcon,
          name: "default"
        },
        closeSvg: {
          img: CloseIconSvg,
          name: "default"
        }
      },
      participants: [
        {
          id: "support",
          name: "Ava",
          imageUrl: AvaIcon
        }
      ],
      titleImageUrl: AvaIcon,
      messageList: [
        // { type: "text", author: `me`, data: { text: `Say yes!` } },
        // { type: 'text', author: `support`, id: 21, data: { text: `Hollo!` }, suggestions: ['Show opened tickets', 'Tickets', 'Closed tickets', 'Latest ticket'] }
        // {
        //   type: "text",
        //   author: "support",
        //   data: {
        //     text:
        //       "<div class='btn'>IT Help Desk</div><div class='btn'>Library Help Desk</div>"
        //   }
        // }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: true, // to determine whether the chat window should be open or closed
      showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: "#013A81",
          text: "#ffffff"
        },
        launcher: {
          bg: "#4e8cff"
        },
        messageList: {
          bg: "#f3f2f1"
        },
        sentMessage: {
          bg: "#E5E5F0",
          text: "#000000"
        },
        receivedMessage: {
          bg: "#ffffff",
          text: "#000000"
        },
        userInput: {
          bg: "#ffffff",
          text: "#565867"
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
      host: window.location.protocol + "//" + window.location.host,
      avaReopenSkipped: false,
      socketReopenCalled: false,
      feedbackEmail: undefined,
      phone: "123-456-7890",
      isUserActive: false,
      hasGreeting: false,
      filesSelected: [],
      canUpload: false,
      agentMode: false,
      menuSelected: 0,
    };
  },
  head() {
    return {
      title: "Ava - Your Personal Virtual Assistant"
    };
  },
  created: () => {},
  // watch: {
  //   messageList: async function(list) {
  //     if (list.length == 0 || !this.enableWatch) return;
  //     const lastItem = list[list.length - 1];
  //     const ret = await this.$axios.$post(
  //       `${this.host}/api/redis/history/${this.user.id}`,
  //       lastItem
  //     );
  //   }
  // },
  async mounted() {
    this.user = this.$route.query;
    let parent = this;
    // If id is null, get it from Canvas.
    if (!this.user.id || this.user.id === "null") {
      this.user.id = "";
      const data = await this.$axios.$get(
        `${this.host}/api/canvas/login_id/${this.user.canvas_id}`
      );
      this.user.id = data.login_id || "";
    }

    // Save conversation ID in browser for 15 minutes
    let userId = this.user.id;
    let savedId = localStorage.getItem(userId);
    if (!savedId) {
      localStorage.setItem(userId, this.conversationId);
    } else {
      let currentTime = new Date().getTime()
      let lastTime = savedId.split('mobile')[1];
      if (currentTime - lastTime < 900000) {
        this.conversationId = savedId;
        this.hasGreeting = true;
      } else {
        localStorage.setItem(userId, this.conversationId);
      }    
    }

    await this.loadChatHistory();
    if (!this.socketReopenCalled) {
      this.avaReopen();
      this.avaReopenSkipped = false;
    }
    this.participants.push({
      id: "me",
      name: "me",
      imageUrl: this.user.avatar || GuestIcon
    });

    this.$nextTick(() => {
      this.resize();
    });

    window.addEventListener("resize", function() {
      parent.resize();
    });

    // Make chat window reaizable
    const BORDER_SIZE = 4;
    const panel = document.querySelector(".sc-chat-window");
    let isResizing = false;
    let m_pos = 0;

    panel.addEventListener("mousedown", e => {
      if (e.offsetX < BORDER_SIZE) {
        m_pos = e.x;
        isResizing = true;
      }
    });

    document.addEventListener("mouseup", e => {
      isResizing = false;
    });

    document.addEventListener("mousemove", e => {
      if (isResizing) {
        const dx = m_pos - e.x;
        m_pos = e.x;
        panel.style.width = parseInt(panel.style.width) + dx + "px";
      }
    });

    // Set microphone position
    // Disable STT
    // let p = document.querySelector('.sc-user-input--buttons');
    // let s = document.querySelector('.microphone');
    // p.insertBefore( s, p.lastChild);

    // Set Files position
    let p = document.querySelector(".sc-user-input--buttons");
    let files = document.querySelector(".files");
    p.insertBefore(files, p.lastChild);

    // Set Menu position
    let header = document.querySelector(".sc-header");
    let menu = document.querySelector(".menu");
    header.append(menu);

    // Set FileContainer position
    let fileContainer = document.querySelector("#fileContainer");
    let userInput = document.querySelector(".sc-user-input");
    let userInputParent = userInput.parentNode;
    userInputParent.insertBefore(fileContainer, userInput);

    const sendIcon = document.querySelector(".sc-user-input--buttons").lastChild;

    sendIcon.addEventListener("click", function() {
      if (parent.agentMode && parent.canUpload) {
        if (document.querySelector(".sc-user-input--text").innerText.length === 0) {
          parent.onMessageWasSent({
            type: "text",
            author: "me",
            data: { text: 'Upload files',  }
          });
        }
      }
    });
  },
  updated() {
    let parent = this;
    parent.updateStyle();
    document.querySelectorAll(".btn").forEach(
      e =>
        (e.onclick = function(e) {
          parent.sendValue(
            e.target.textContent,
            e.target.getAttribute("value")
          );
        })
    );
  },
  sockets: {
    connect() {
      console.log("Socket connected");
      if (!this.isConnected) {
        this.isConnected = true;
        this.avaReopen();
      }
    },
    disconnect() {
      console.log("Socket disconnected");
      this.isConnected = false;
      this.isUserActive = false;
    },
    reopen(data) {
      console.log("Reopen data response:", data);
      this.showTypingIndicator = "";
      if (data.messages) {
        this.socketMessage = data;
        let messages = data.messages;
        let length = messages.length;
        this.addResponseMessage(
          messages[length - 1].message[0],
          messages[length - 1].type,
          ["List my tickets", "Talk to an agent"]
        );
      }
      if (data.email) {
        this.feedbackEmail = data.email;
      }
    },
    normal(data) {
      console.log("Normal response: ", data);
      this.agentMode = data.isOpen || false;
      this.showTypingIndicator = "";
      this.filesSelected = [];
      this.socketMessage = data;
      let messages = data.messages;
      let length = messages.length;

      if (typeof messages[0] === "string") {
        let newType = null;
        messages.forEach((message, idx) => {
          if (data.type === "survey" && (idx + 1) < length) {
            newType = null;
          } else {
            newType = data.type;
          }
          this.addResponseMessage(message, newType, [
            "List my tickets",
            "Talk to an agent"
          ]);
        });
      } else if (messages[0]) {
        this.addResponseMessage(messages[0].message[0], data.type, [
          "Help!",
          "Talk to an agent!"
        ]);
      } else if (data.type === "html") {
        // do nothing
      } else {
        this.agentMode = true;
        return;
      }

      if (data.html && data.html.includes("carousel")) {
        var div = document.createElement("DIV");
        div.innerHTML = data.html;
        let items = div.querySelectorAll(".carousel > div");
        if (items.length > 1) {
          let child = div.removeChild(div.childNodes[0]);
          this.addResponseMessage(div.innerHTML, "carousel", null, items);
        } else {
          this.addResponseMessage(data.html, data.type);
        }
      } else if (data.html) {
        this.addResponseMessage(data.html, data.type);
      }
    },
    feedback(data) {
      console.log("Feedback response: ", data);
    },
    serverError(data) {
      console.log("Error response received: ", data);
      this.showTypingIndicator = "";

      this.addResponseMessage("Server error: " + data, "text", [
        "Help!",
        "Talk to an agent!"
      ]);
    },
    agentStart(data) {
      console.log("Agent start: ", data);
      this.agentMode = data.isOpen || false;
      this.addResponseMessage(data.message.message);
    },
    agentChat(data) {
      // Files sent from Ava to Web Chat
      console.log("Got emit agentChat: ", data);
      this.showTypingIndicator = "";
      this.filesSelected = [];

      this.agentMode = data.data.isOpen || false;
      this.addResponseMessage(data.data.message.message, "text");

      if (data.files.length == 0) return;

      var downloadContainer = document.createElement("div");

      data.files.forEach(file => {
        var arrayBufferView = new Uint8Array( file.buffer );
        var blob = new Blob( [ arrayBufferView ], { type: file.mimetype } );
        var a = document.createElement("a"),
        url = URL.createObjectURL(blob);
        a.href = url;
        a.download = file.originalname;
        a.innerText = file.originalname;

        let div = document.createElement("div");
        div.appendChild(a);
        downloadContainer.appendChild(div);
      });

      this.addResponseMessage(downloadContainer.outerHTML, "text");
    }
  },
  methods: {
    ...mapActions('menu', ['showMenu']),
    async rate(rating) {
      let target = event.target.parentNode;
      if (target.getAttribute('history')) return;

      let starBoxId = target.getAttribute('star-id');      
      target.setAttribute('number-of-star', rating);
      target.setAttribute('history', true);

      await this.$axios.$post(
        `${this.host}/api/redis/star/${starBoxId}`,
        {
          "numberOfStar" : rating
        }
      );
 
      this.onMessageWasSent({
        type: "text",
        author: "me",
        data: { text: `My rating is ${rating} star${rating > 1 ? "s" : ""}` }
      });
    },
    hoverStar(rating) {
      let target = event.target.parentNode;
      if (target.getAttribute('history')) return;

      let elements = target.querySelectorAll(`img:nth-child(-n+${rating})`);
      let others = target.querySelectorAll(`img:nth-child(n+${rating + 1})`);
      elements.forEach(element => element.setAttribute('src', `${this.host}/star.png`));
      others.forEach(element => element.setAttribute('src', `${this.host}/starGray.png`));
    },
    hoverStarOut() {
      let target = event.target.parentNode;
      if (target.getAttribute('history')) return;

      let rating = target.getAttribute('number-of-star');
      if (Number(rating) > 0) return;
      let elements = target.querySelectorAll('img');
      elements.forEach(element => element.setAttribute('src', `${this.host}/starGray.png`));
    },
    sendValue(text, value) {
      this.onMessageWasSent({
        type: "text",
        author: "me",
        data: { text, value }
      });
    },
    resize() {
      document.querySelector(".sc-chat-window").style.top = "0";
      document.querySelector(".sc-chat-window").style.bottom = "0";
      document.querySelector(".sc-chat-window").style.width = "100%";
      document.querySelector(".sc-chat-window").style.height = "100%";
      document.querySelector(".sc-chat-window").style.maxHeight = "100%";
      document.querySelector(".sc-chat-window").style.minHeight = "50%";
      document.querySelector(".sc-chat-window").style.maxWidth = "100%";
      document.querySelector(".sc-chat-window").style.minWidth = "50%";
      document.querySelector(".sc-chat-window").style.minWidth = "50%";
      document.querySelector(".sc-chat-window").style.right = "0";
      document.querySelector(".sc-chat-window").style.borderRadius = "0";
      document.querySelector(".sc-header").style.borderTopLeftRadius = "0";
      document.querySelector(".sc-header").style.borderTopRightRadius = "0";
    },
    updateStyle() {
      let htmlCollection = document.getElementsByClassName(
        "sc-suggestions-element"
      );

      Array.from(htmlCollection).forEach(function(element) {
        element.style.color = "black";
        element.style.borderColor = "black";
      });
    },
    async onMessageWasSent(message) {
      console.log("onMessageWasSent: ", message);
      this.isUserActive = true;
      message.data.meta = new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      });
      // called when the user sends a message
      this.showTypingIndicator = "support";
      console.log('agentMode=', this.agentMode);
      console.log('filesSelected.length=', this.filesSelected.length);
      console.log('canUpload=', this.canUpload);
      if (this.agentMode && this.filesSelected.length > 0 && this.canUpload) {
        console.log("Upload Files");
        this.canUpload = false;
        this.uploadFiles(message, this.filesSelected);
        // this.uploadFilesSocket(message, this.filesSelected);
      } else {
        this.avaNormal(message);
      }
      await this.messagePush(message);
    },
    avaReopen() {
      if (this.hasGreeting && !this.isUserActive) {
        console.log("User is inactive. Skip reopen");
        return;
      }

      console.log("avaReopen user id=", this.user.id);
      if (!this.user.id || this.user.id == "null") {
        this.avaReopenSkipped = true;
        return;
      }
      this.hasGreeting = true;

      let options = {
        conversationId: this.conversationId.toString(),
        source: "canvas",
        from: {
          id: this.user.id,
          name: this.user.name,
          company: "ATGE",
          employee_type: "stu",
          department: "CU",
          email_address: this.user.email
        },
        message: "Hello!"
      };

      console.log("openchat:", options);

      this.$socket.client.emit("reopen", options);
      this.socketReopenCalled = true;
    },
    avaNormal(message) {
      let value = message.data.value || message.data.text;
      let options = {
        conversationId: this.conversationId,
        source: "canvas",
        from: {
          id: this.user.id,
          name: this.user.name,
          company: "ATGE",
          employee_type: "stu",
          department: "CU",
          email_address: this.user.email
        },
        message: value || ""
      };
      console.log("Send: ", options);

      this.$socket.client.emit("normal", options);
    },
    uploadFilesSocket(message, files) {
      let promises = [];
      for (let file of files) {
        let filePromise = new Promise(resolve => {
          let reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = () =>
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              data: reader.result
            });
        });
        promises.push(filePromise);
      }
      let parent = this;
      Promise.all(promises).then(fileContents => {
        let value = message.data.value || message.data.text || "";
        let options = {
          conversationId: this.conversationId,
          source: "canvas",
          from: {
            id: this.user.id,
            name: this.user.name,
            company: "ATGE",
            employee_type: "stu",
            department: "CU",
            email_address: this.user.email
          },
          message: value,
          files: fileContents
        };
        this.$socket.client.emit("fileupload", options);
      });
    },
    uploadFiles(message, files) {
      let value = message.data.value || message.data.text || "";
      let options = {
        conversationId: this.conversationId,
        source: "canvas",
        from: {
          id: this.user.id,
          name: this.user.name,
          company: "ATGE",
          employee_type: "stu",
          department: "CU",
          email_address: this.user.email
        },
        message: value
      };

      this.postFiles(options, files);
    },
    async addResponseMessage(message, type, suggestions, carouselItems) {
      if (type !== "carousel" && (!message || message.trim().length == 0)) {
        return;
      }
      let newData = {
        author: "support",
        type: "text",
        id: new Date().getTime(),
        data: {
          text: message,
          type: type,
          meta:
            "Ava " +
            new Date().toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true
            })
        },
        suggestions,
        carouselItems
      };

      if (type === "survey") {
        newData.numberOfStar = 0;
        newData.history = false;
      }

      await this.messagePush(newData);
      // Disable TTS
      // if (SpeechSDKHelper.enabled && !message.startsWith('<div')) {
      //   SpeechSDKHelper.tts(message);
      // }
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
    },
    setColor(color) {
      this.colors = this.availableColors[color];
      this.chosenColor = color;
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {
      // console.log("Emit typing event");
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
    removeMessage(message) {
      if (confirm("Delete?")) {
        const m = this.messageList.find(m => m.id === message.id);
        m.type = "system";
        m.data.text = "This message has been removed";
      }
    },
    async loadChatHistory() {
      const chatList = await this.$axios.$get(
        `${this.host}/api/redis/history/${this.user.id}`
      );
      for (let i=0; i < chatList.length; i++) {
        let chatObj = JSON.parse(chatList[i]);
        if (chatObj.data && chatObj.data.type == 'survey') {
          const numberOfStar = await this.$axios.$get(
            `${this.host}/api/redis/star/${chatObj.id}`
          );
          chatObj.numberOfStar = numberOfStar;
          chatObj.history = true;
        }
        this.messageList.push(chatObj);        
      }
    },
    saveFeedback(data) {
      this.$socket.client.emit("feedback", data);
    },
    onFilesChange(files) {
      this.filesSelected = this.filesSelected.concat(files);
      this.canUpload = this.filesSelected.length > 0 ? true : false;
    },
    onMenuSelected(key) {
      this.menuSelected = key;
      console.log(`menuSelected=${this.menuSelected}`);
    },
    onSuggestionClose() {
      console.log('this.menuSelected:', this.menuSelected);
      this.menuSelected = 0;
      this.showMenu(false);
    },
    async postFiles(options, files) {
      let formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`uploads`, file);
      });
      formData.append("data", JSON.stringify(options));

      const backend = await this.$axios.$get(`${this.host}/api/backend`);
      const data = await this.$axios.$post(
        `${backend.url}/api/v1/ava/upload`,
        formData,
        {
          headers: {
            authorization: backend.authorization,
            dsi: backend.dsi
          }
        }
      );

      console.log('data:', data);
      this.addResponseMessage(data.message, "text");
    },
    async messagePush(data) {
      this.messageList.push(data);
      await this.$axios.$post(
        `${this.host}/api/redis/history/${this.user.id}`,
        data
      );
    }
  }
};
</script>
<style>
.sc-message {
  width: 90%;
  padding-bottom: 15px;
}

.sc-message--text {
  max-width: 66%;
  font-size: 0.9em;
  font-weight: 300;
  align-content: stretch;
}
.sc-header--close-button,
.sc-launcher {
  display: none;
}

.sc-message--content.sent .sc-message--avatar {
  display: inline-block;
  order: 2;
  margin-left: 15px;
  margin-right: 0;
}

.sc-message--avatar {
  min-width: 40px;
  min-height: 40px;
}

.sc-message--meta {
  text-align: left;
  font-size: small;
}

.sc-message-list {
  padding: 0;
}

.sc-user-input:focus-within {
  border-bottom: 2px solid #6064a4;
}

.sc-header--title > img {
  vertical-align: middle;
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
.sc-header--title span {
  vertical-align: middle;
}
.card {
  border: 1px solid rgba(189, 185, 185, 0.4);
  padding: 15px;
  margin: 5px 0;
}
.rating {
  margin-top: 10px;
}

.rating > span {
  vertical-align: middle;
}

.star {
  vertical-align: middle;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.sc-suggestions-element:focus {
  outline: none;
}

.sc-suggestions-element:hover {
  background-color: rgb(212, 209, 209);
}

.sc-user-input--text {
  width: calc(100% - 120px);
}

.sc-chat-window:after {
  content: " ";
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  left: 0;
  width: 4px;
  height: 100%;
  cursor: w-resize;
}

.sc-message--text-content:not(.carousel) > div {
  margin-bottom: 5px;
}

.sc-message--text-content > div > img {
  max-width: 50%;
  display: block;
  margin: auto;
}

.btn {
  display: inline-block;
  color: rgb(74, 103, 199);
  border: 1px solid rgba(74, 103, 199, 0.5);
  cursor: pointer;
  vertical-align: middle;
  max-width: 200px;
  padding: 5px;
  text-align: center;
  margin: 0 5px;
  font-weight: 400;
  border-radius: 5px;
  margin-top: 5px;
}

.btn:active {
  box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.6);
}

.hide {
  height: 0;
  visibility: hidden;
}

.microphone {
  position: relative;
  font-size: 1.3em;
  cursor: pointer;
}

.menu {
  position: relative;
  font-size: 1.3em;
  cursor: pointer;
}

.files {
  position: relative;
  font-size: 1.3em;
  cursor: pointer;
}

#fileContainer {
  background-color: rgb(86, 88, 103);
  color: white;
}
</style>
