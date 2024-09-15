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
      "channel-points-channel-v1",
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

    const ws = this.connection = new WebSocket(url);

    ws.onopen = function() {
      ps.sendHeartbeat();
      ps.heartbeat = setInterval(() => {ps.sendHeartbeat()}, hbInterval);

      ps.emit("online");
    }

    ws.onmessage = function(event) {
      let message = JSON.parse(event.data.toString());
      ps.emit("raw", message);

      switch (message.type) {
        case "RECONNECT":
          this.close();
          ps.emit("reconnect");
          ps.connection = null;
          break;
        case "RESPONSE":
          ps.emit("response", { nonce: message.nonce, error: message.error });
          break;
        case "AUTH_REVOKED":
          ps.emit("authRevoked", message.data.topics)
          break;
        default:
          ps.emit(message.type.split(".")[0], message.data);
          break;
      }
    }
  }

  /**
   * Listen to PubSub topics
   * @example
   * // Listens to when a user redeems channel points
   * PubSub.listen({
   *  topic: "channel-points-channel-v1",
   *  channelID: "1234567"
   * })
   */
  listen(options = {}, token = this.token) {
    if(this.connection == null) return;
    let topic = options.topic;
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

  unlisten(topic) {
    const data = this.subscriptions.get(topic);

    if(data) {
      data.type = "UNLISTEN";

      this.connection.send(JSON.stringify(data));
    } else return;
  }

  sendHeartbeat() {
    if(this.connection) {
      this.connection.send(JSON.stringify({ "type": "PING" }));
    }
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