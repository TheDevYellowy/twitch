const { WebSocket } = require('ws');
const { EventEmitter } = require('node:events');
const td = new TextDecoder();

const API = require('./api');

module.exports = class EventSub extends EventEmitter {
  /**
   * @param {string} client_id
   * @param {string} client_secret
   * @param {?string} client_token
   * @param {?string} refresh_token
   */
  constructor(client_id, client_secret, client_token = null, refresh_token = null) {
    super();
    /** @type {?WebSocket} */
    this.connection = null;
    this.connectedAt = null;
    this.id = null;
    this.api = new API(client_id, client_secret, client_token, refresh_token);
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

  async subscribe(type, version, condition) {
    const headers = {
      "Content-Type": "application/json"
    }
    const body = {
      "type": type,
      "version": version,
      "condition": condition,
      "transport": {
        "method": "websocket",
        "session_id": this.id
      }
    }

    let res = await this.api.post('eventsub/subscriptions', headers, body);

    if (typeof res == 'string') { this.debug(res); return false; }
    else if (res.status == 200) return true;
    else { this.debug(res); return false; }
  }

  debug(msg) {
    this.emit('debug', msg);
  }
}