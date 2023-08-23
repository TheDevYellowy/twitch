const EventSub = require('./eventsub');
const { WebSocket } = require('ws');
const td = new TextDecoder();

module.exports = class websocket {
  constructor(parent) {
    /** @type {EventSub} */
    this.parent = parent;
    /** @type {?WebSocket} */
    this.connection = null;
    this.connectedAt = null;
    this.id = null;

    this.connect();
  }

  connect(url = null) {
    let connectURL;
    if (this.connection?.readyState == WebSocket.OPEN) return Promise.resolve();

    if (url == null) connectURL = 'wss://eventsub.wss.twitch.tv/ws';
    else connectURL = url;

    return new Promise((resolve, reject) => {
      this.connectedAt = Date.now();
      const ws = this.connection = new WebSocket(connectURL);

      ws.onopen = this.onOpen.bind(this);
      ws.onmessage = this.onMessage.bind(this);
    });
  }

  onOpen() {
    this.debug(`[CONNECTED] took ${Date.now() - this.connectedAt}ms`);
  }

  onMessage({ data }) {
    let raw;
    if (data instanceof ArrayBuffer) data = new Uint8Array(data);
    raw = data;
    if (typeof raw !== 'string') raw = td.decode(raw);
    let packet = JSON.parse(raw);
    this.emit('raw', packet);

    this.onPacket(packet)
  }

  async onPacket(packet) {
    if (!packet) {
      this.debug(`Recieved broken packet: ${packet}`);
      return;
    }

    if (packet.metadata.message_type == 'session_welcome') {
      this.id = packet.payload.session.id;
      this.emit('online');
    }

    if (packet.metadata.message_type == 'session_reconnect') {
      const ws = new WebSocket(packet.payload.session.reconnect_url);
      this.connectedAt = Date.now();
      ws.on('message', async (data) => {
        let raw;
        if (data instanceof ArrayBuffer) data = new Uint8Array(data);
        raw = data;
        if (typeof raw !== 'string') raw = td.decode(raw);
        let packet = JSON.parse(raw);

        if (packet.metadata.message_type == 'session_welcome') {
          await this.connection.close();
          this.connection = ws;
          this.id = packet.payload.session.id;
          this.emit('online');

          ws.off('message', () => { });

          ws.onopen = this.onOpen.bind(this);
          ws.onmessage = this.onMessage.bind(this);

          this.onOpen();
        }
      });
    }

    if (packet.metadata.subscription_type == 'drop.entitlement.grant') this.emit(packet.metadata.subscription_type, packet.payload.events);
    else if (packet.metadata.subscription_type) this.emit(packet.metadata.subscription_type, packet.payload.event);
  }
}