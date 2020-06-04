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
      :showFile="true"
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
              <img src="/star.png" class="star" v-on:click="rate(1)" />
              <img src="/star.png" class="star" v-on:click="rate(2)" />
              <img src="/star.png" class="star" v-on:click="rate(3)" />
              <img src="/star.png" class="star" v-on:click="rate(4)" />
              <img src="/star.png" class="star" v-on:click="rate(5)" />
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
  </div>
</template>
<script>
import Vue from "vue";
import Chat from "vue-beautiful-chat";
// import TitleIcon from "../assets/atge-icon.jpeg";
import AvaIcon from "../static/ava-icon.png";
import GuestIcon from "../assets/guest-icon.png";
import CloseIcon from "../assets/close-icon.png";
import OpenIcon from "../assets/logo-no-bg.svg";
import FileIcon from "../assets/file.svg";
import CloseIconSvg from "../assets/close.svg";
import Carousel from "~/components/Carousel.vue";

Vue.use(Chat);

export default {
  name: "app",
  components: {
    Carousel
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
      host: window.location.protocol + "//" + window.location.hostname
    };
  },
  head() {
    return {
      title: "Ava - Your Personal Virtual Assistant"
    };
  },
  created: () => {},
  watch: {
    messageList: async function(list) {
      // console.log(`message list length=${list.length}`);
      // const lastItem = JSON.stringify(list[list.length - 1]);
      // const host = window.location.protocol + "//" + window.location.hostname;
      // await this.$axios.$post(`${host}/api/redis/history/${this.user.id}`, lastItem);
    }
  },
  async mounted() {
    console.log('In mounted');
    console.log('This host=', this.host);
    console.log('This user=', this.user);
    this.user = this.$route.query;
    let parent = this;
    // If id is null, get if from database.
    if (!this.user.id || this.user.id === "null") {
      console.log(`Calling ${this.host}/api/redis/id/${this.user.name}`);
      const id = await this.$axios.$get(`${this.host}/api/redis/id/${this.user.name}`);
      this.user.id = id || "";
      console.log('this.user.id=', this.user.id);
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
    },
    connected(data) {
      console.log("connected response=");
      console.log(data);
      if (!this.isConnected) {
        this.isConnected = true;
        this.avaReopen();
      }
    },
    reopen(data) {
      console.log("Socket data received:");
      console.log(data);
      this.showTypingIndicator = "";
      if (data.messages) {
        this.socketMessage = data;
        let messages = data.messages;
        let length = messages.length;
        // this.addResponseMessage(messages[length - 1].message[0], data.type, [
        this.addResponseMessage(
          messages[length - 1].message[0],
          messages[length - 1].type,
          ["List my tickets", "Talk to an agent"]
        );
      }
    },
    normal(data) {
      console.log("Response:");
      console.log(data);
      this.showTypingIndicator = "";
      this.socketMessage = data;
      let messages = data.messages;
      let length = messages.length;

      if (typeof messages[0] === "string") {
        messages.forEach(message => {
          this.addResponseMessage(message, data.type, [
            "List my tickets",
            "Talk to an agent"
          ]);
        });
      } else if (messages[0]) {
        this.addResponseMessage(messages[0].message[0], data.type, [
          "Help!",
          "Talk to an agent!"
        ]);
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
    serverError(data) {
      console.log("Error response received:");
      console.log(data);
      this.showTypingIndicator = "";

      this.addResponseMessage("Server error: " + data, "text", [
        "Help!",
        "Talk with an agent!"
      ]);
    },
    agentStart(data) {
      console.log("Agent start");
      console.log(data);
      this.addResponseMessage(data.message.message, data.type);
    },
    fromAgent(data) {
      console.log("From agent");
      console.log(data);
      this.addResponseMessage("From agent", data.type);
    }
  },
  methods: {
    rate(rating) {
      this.onMessageWasSent({
        type: "text",
        author: "me",
        data: { text: `My rating is ${rating} star${rating > 1 ? "s" : ""}` }
      });
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
    onMessageWasSent(message) {
      message.data.meta = new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      });
      // called when the user sends a message
      this.showTypingIndicator = "support";
      this.avaNormal(message);
      this.messageList.push(message);
    },
    avaReopen() {
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

      console.log("openchat:");
      console.log(options);

      this.$socket.client.emit("reopen", options);
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
      console.log("Send:");
      console.log(options);

      this.$socket.client.emit("normal", options);
    },
    addResponseMessage(message, type, suggestions, carouselItems) {
      this.messageList.push({
        author: "support",
        type: "text",
        id: Math.random(),
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
      });
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
</style>
