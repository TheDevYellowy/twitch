const { EventEmitter } = require("events");
const { WebSocket } = require("ws");

class PubSub extends EventEmitter {
  constructor(auth_token) {
    super();

    this.token = auth_token;
    this.subscriptions = new Map();
    this.connection = null;
    this.heartbeat = null;

    /** @private */
    this.topics = [
      "channel-bits-events-v2",
      "channel-bits-badge-unlocks",
      "channel-subscribe-events-v1",
      "automod-queue",
      "chat_moderator_actions",
      "low-trust-users",
      "user-moderation-notifications",
      "whispers"
    ];
  }

  connect() {
    if(this.connection !== null) this.connection.close();
    const url = "wss://pubsub-edge.twitch.tv";
    const hbInterval = 1000 * 60;
    const ps = this;

    this.connection = new WebSocket(url);

    this.connection.onopen = function() {
      ps.sendHeartbeat();
      ps.heartbeat = setInterval(ps.sendHeartbeat(), hbInterval);
    }

    this.connection.onmessage = function(event) {
      let message = JSON.parse(event.data.toString());

      if(message.type == "RECONNECT") {
        this.close();
        ps.emit("reconnect");
        ps.connection = null;
        return;
      }

      ps.emit(message.type, message.data);
    }
  }

  subscribe(options = {}, token = this.token) {
    if(this.connection = null) return;
    const topic = options.topic;
    if(this.topics.includes(topic)) {
      switch (topic) {
        case "automod-queue.":
          topic = `${topic}.${options.modID}.${options.channelID}`;
          break;
        case "chat_moderator_actions.":
          topic = `${topic}.${options.userId}.${options.channelID}`;
          break;
        case "low-trust-users.":
          topic = `${topic}.${options.channelID}.${options.susUserID}`;
          break;
        case "user-moderation-notifications.":
          break;
        default:
          topic = `${topic}.${options.channelID}`;
          break;
      }
    } else return;
    const nonce = this.createNonce()
    const data = {
      type: "LISTEN",
      nonce,
      data: {
        topics: [topic],
        auth_token: token
      }
    }
    this.subscriptions.set(topic, data);

    this.connection.send(JSON.stringify(data));
  }

  createNonce() {
    let c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let r = "";
    for(let i = 0; i < 10; i++) {
      r += c[Math.round(Math.random() * c.length)];
    }

    return r;
  }
}

module.exports = PubSub