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
      :showEmoji="true"
      :showFile="true"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
      @remove="removeMessage"
    >
      <template v-slot:text-message-body="scopedProps">
        <p
          class="sc-message--text-content"
          v-html="scopedProps.message.data.text"
        ></p>
        <p
          v-if="scopedProps.message.data.meta"
          class="sc-message--meta"
          :style="{ color: scopedProps.messageColors.color }"
        >
          {{ scopedProps.message.data.meta }}
        </p>
        <p
          v-if="scopedProps.message.isEdited || scopedProps.message.liked"
          class="sc-message--edited"
        >
          <template v-if="scopedProps.message.isEdited">✎</template>
          <template v-if="scopedProps.message.liked">👍</template>
        </p>
      </template>
    </beautiful-chat>
  </div>
</template>
<script>
import Vue from "vue";
import Chat from "vue-beautiful-chat";
import CloseIcon from "../assets/close-icon.png";
import OpenIcon from "../assets/logo-no-bg.svg";
import FileIcon from "../assets/file.svg";
import CloseIconSvg from "../assets/close.svg";

Vue.use(Chat);

export default {
  name: "app",
  data() {
    return {
      user: {},
      CONVERSATION_ID_PREFIX: new Date().getTime(),
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
          imageUrl:
            "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png"
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl:
        "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png",
      messageList: [
        // { type: "text", author: `me`, data: { text: `Say yes!` } },
        // { type: "text", author: `user1`, data: { text: `No.` } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: true, // to determine whether the chat window should be open or closed
      showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        launcher: {
          bg: "#4e8cff"
        },
        messageList: {
          bg: "#ffffff"
        },
        sentMessage: {
          bg: "#4e8cff",
          text: "#ffffff"
        },
        receivedMessage: {
          bg: "#C2DAFF",
          text: "#000000"
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867"
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    };
  },
  created: () => {
    console.log("Created ---");
    // this.setColor("blue");
  },
  mounted() {
    console.log("Mounted ---");
    this.user = this.$route.query;
    let parent = this;

    this.resize();

    window.addEventListener("resize", function() {
      parent.resize();
    });
  },
  sockets: {
    connect() {
      console.log("Socket connected");
      this.isConnected = true;
      this.avaReopen();
    },
    disconnect() {
      console.log("Socket disconnected");
      this.isConnected = false;
    },
    connected(data) {
      console.log("serverMessage");
      console.log(data);
      if (!this.isConnected) {
        this.isConnected = true;
        this.avaReopen();
      }
    },
    reopen(data) {
      console.log("Socket data received:");
      this.socketMessage = data;
      let messages = data.messages;
      let length = messages.length;
      this.addResponseMessage(messages[length - 1].message[0], [
        "Show open tickets",
        "Talk to an agent"
      ]);
    },
    normal(data) {
      console.log("Normal response received:");
      console.log(data);
      this.showTypingIndicator = "";
      this.socketMessage = data;
      let messages = data.messages;
      let length = messages.length;
      console.log('length=' + length);
      let message =
        typeof messages[0] === "string" ? messages[0] : messages[0].message[0];

      if (typeof messages[0] === "string") {
        messages.forEach(message => {
          this.addResponseMessage(message);
        })
      } else {
        this.addResponseMessage(messages[0].message[0], ["Help!", "Talk with an agent!"]);
      }
    }
  },
  methods: {
    resize() {
      document.querySelector(".sc-chat-window").style.maxHeight = '80%';

      if (window.matchMedia("(max-width: 640px)").matches) {
        document.querySelector(".sc-chat-window").style.width = "90%";
      } else if (window.matchMedia("(max-width: 768px)").matches) {
        document.querySelector(".sc-chat-window").style.width = "80%";
      } else {
        document.querySelector(".sc-chat-window").style.width = "768px";
      }
    },
    onMessageWasSent(message) {
      console.log("Here is onMessageWasSent");
      console.log(message);
      // called when the user sends a message
      this.showTypingIndicator = "support";
      this.avaNormal(message);
      this.messageList.push(message);
    },
    avaReopen() {
      console.log("in avaReopen");
      let parent = this;

      this.$socket.client.emit("reopen", {
        conversationId: this.CONVERSATION_ID_PREFIX + parent.user.id,
        from: {
          id: parent.user.id,
          name: parent.user.name,
          company: "ATGE",
          employee_type: "stu",
          department: "CU",
          email_address: parent.user.email
        },
        message: "Hello!"
      });
    },
    avaNormal(message) {
      console.log("in avaNormal");
      let parent = this;

      this.$socket.client.emit("normal", {
        conversationId: this.CONVERSATION_ID_PREFIX + parent.user.id,
        from: {
          id: parent.user.id,
          name: parent.user.name,
          company: "ATGE",
          employee_type: "stu",
          department: "CU",
          email_address: parent.user.email
        },
        message: message.data.text || ""
      });
    },
    addResponseMessage(message, suggestions) {
      this.messageList.push({
        author: "support",
        type: "text",
        id: Math.random(),
        data: { text: message },
        suggestions
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
      console.log("Emit typing event");
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
}
</style>
