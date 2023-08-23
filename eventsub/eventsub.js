const { EventEmitter } = require('node:events');

const websocket = require('./websocket');
const webhook = require('./webhook');
const API = require('../api/api');

/**
 * The main class, this will emit events for the varius events you subscribe to
 * 
 * ```js
 * const { EventSub } = require('twitch-utils');
 * 
 * const eventsub = new EventSub({ client_id, client_secret, { api: { client_token, refresh_token } } });
 * eventsub.connect('websocket');
 * // or
 * eventsub.connect('webhook', callback, secret, port) // port is automatically 80
 * 
 * eventsub.subscribe(type, version, condition);
 * 
 * eventsub.on('stream.online', event => {
 *   console.log(event.broadcaster_user_name + ' is online');
 * })
 * ```
 */
module.exports = class EventSub extends EventEmitter {
  constructor(client_id, client_secret, options = { api: {customTokens: false, client_token: null, refresh_token: null, API: null} }) {
    super();
   
    if (options.api.API == null) {
      this.api = new API(client_id, client_secret, options.api.customTokens, options.api.client_token, options.api.refresh_token);
    } else {
      /** @type {API} */
      this.api = options.api.API;
    }

    this.type = null;
    /** @type {webhook | null} */
    this.webhook = null;
    /** @type {websocket | null} */
    this.websocket = null;
  }

  connect({ type, callback, secret, port = 80}) {
    if(type !== 'websocket' && type !== 'webhook') return console.log(`Incorrect type passed into EventSub.connect() expected "websocket" or "webhook" got "${type}"`);
    if(this.type !== null) return console.log(`You already have a ${this.type} connection, you can use eventsub.${this.type} to access it`);
    this.type = type;

    if(type == 'websocket') {
      this.websocket = new websocket(this);
    } else {
      this.webhook = new webhook(this, callback, secret, port);
    }
  }

  /**
   * Subscribe to an event, cHeaders stands for change headers it's for headers that you want to change.
   * 
   * This returns a boolean true if it's a success and false if it failed it will also emit the a debug event with the message if it failed
   * 
   * ```js
   * eventsub.subscribe('stream.online', 1, {
   *   broadcaster_user_id: ''
   * });
   * ```
   */
  async subscribe(type, version, condition, cHeaders = {}) {
    if(this.type == null) {
      return console.log(`You need to run the connect function first before you can subscribe to events`);
    }

    const headers = {
      "Content-Type": "application/json",
      ...cHeaders
    }
    const body = {
      "type": type,
      "version": version,
      "condition": condition,
      "transport": {}
    }

    if (this.type == 'websocket') {
      body.transport = {
        "method": "websocket",
        "session_id": this.websocket.id,
      }
    } else {
      body.transport = {
        "method": "webhooks",
        "callback": this.webhook.callback,
        "secret": this.webhook.secret
      }
    }

    let res = await this.api.post('eventsub/subscriptions', headers, body);

    if (res == undefined) return this.subscribe(type, version, condition, cHeaders);

    if (typeof res == 'string') { this.debug(res); return false; }
    else if (res.status == 200) return true;
    else { this.debug(res); return false; }
  }

  debug(msg) {
    this.emit('debug', msg);
  }
}