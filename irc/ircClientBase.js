const { EventEmitter } = require("node:events");
const { WebSocket } = require("ws");

const _ = require('./utils');
const Queue = require('./Queue');
const parser = require('./parser');

module.exports = class IrcClientBase extends EventEmitter {
  constructor(options) {
    super();
    this.opts = options ?? {};
    this.opts.channels = this.opts.channels ?? [];
    this.opts.connection = this.opts.connection ?? {};
    this.opts.identity = this.opts.identity ?? {};
    this.opts.options = this.opts.options ?? {};

    this.clientId = this.opts.options.clientId ?? null;
    this._globalDefaultChannel = _.channel(this.opts.options.globalDefaultChannel ?? '#tmijs');
    this._skipMembership = this.opts.options.skipMembership ?? false;

    this.maxReconnectAttempts = this.opts.connection.maxReconnectAttempts ?? Infinity;
    this.maxReconnectInterval = this.opts.connection.maxReconnectInterval ?? 30000;
    this.reconnect = this.opts.connection.reconnect ?? true;
    this.reconnectDecay = this.opts.connection.reconnectDecay ?? 1.5;
    this.reconnectInterval = this.opts.connection.reconnectInterval ?? 1000;

    this.reconnecting = false;
    this.reconnections = 0;
    this.reconnectTimer = this.reconnectInterval;
    this.currentLatency = 0;
    this.latency = new Date();

    this.secure = this.opts.connection.secure ?? (!this.opts.connection.server && !this.opts.connection.port);

    this.pingLoop = null;
    this.pingTimeout = null;
    this.wasCloseCalled = false;
    this.reason = '';
    this.ws = null;

    this.emotes = '';

    this.username = '';
    this.channels = [];
    this.globaluserstate = {};
    this.userstate = {};
    this.lastJoined = '';
    this.moderators = {};

    this.opts.channels.forEach((part, index, theArray) => theArray[index] = _.channel(part));

    this.setMaxListeners(0);
  }

  handleMessage(message) {
    if (!message) return;

    if (this.listenerCount('raw_message')) this.emit('raw_message', JSON.parse(JSON.stringify(message)), message);

    const channel = _.channel(message.params[0] ?? null);
    const msg = message.params[1] ?? null;
    const msgid = message.tags['msg-id'] ?? null;

    const tags = message.tags = parser.badges(parser.badgeInfo(parser.emotes(message.tags)));

    for (const key in tags) {
      if (key === 'emote-sets' || key === 'ban-duration' || key === 'bits') continue;

      let value = tags[key];
      if (typeof value == 'boolean') value = null;
      else if (value == 1) value = true;
      else if (value == 0) value = false;
      else if (typeof value == 'string') value = _.unescapeIRC(value);

      tags[key] = value;

      if (message.prefix == null) {
        switch (message.command) {
          case 'PING': {
            this.emit('ping');
            if (this._isConnected()) this.ws.send('PONG');
            break;
          }

          case 'PONG': {
            this.currentLatency = (new Date().getTime() - this.latency.getTime()) / 1000;
            this.emit('pong', this.currentLatency);

            clearTimeout(this.pingTimeout);
            break;
          }

          default:
            console.warn(`Could not parse message with no prefix:\n${JSON.stringify(message, null, 2)}`);
            break;
        }
      }
      else if (message.prefix == 'tmi.twitch.tv') {
        switch (message.command) {
          case '002':
          case '003':
          case '004':
          case '372':
          case '375':
          case 'CAP':
            break;

          case '001':
            [this.username] = message.params;
            break;

          case '376': {
            this.userstate[this._globalDefaultChannel] = {};
            this.emit('connected', this.server, this.port);

            this.reconnections = 0;
            this.reconnectTimer = this.reconnectInterval;

            this.pingLoop = setInterval(() => {
              if (this._isConnected()) this.ws.send('PING');

              this.latency = new Date();
              this.pingTimeout = setTimeout(() => {
                if (this.ws !== null) {
                  this.wasCloseCalled = false;
                  this.ws.close();

                  clearInterval(this.pingLoop);
                  clearTimeout(this.pingTimeout);
                }
              }, this.opts.connection.timeout ?? 9999);
            }, 60000);

            let joinInterval = this.opts.options.joinInterval ?? 2000;
            if (joinInterval < 300) joinInterval = 300;

            const joinQueue = new Queue(joinInterval);
            const joinChannels = [...new Set([...this.opts.channels, ...this.channels])];
            this.channels = [];

            for (let i = 0; i < joinChannels.length; i++) {
              const channel = joinChannels[i];
              joinQueue.add(() => {
                if (this._isConnected()) this.join(channel).catch(err => console.error(err));
              });
            }

            joinQueue.next();
            break;
          }

          case 'NOTICE': {
            const nullArr = [null];
            const noticeArr = [channel, msgid, msg];
            const msgidArr = [msgid];
            const channelTrueArr = [channel, true];
            const channelFalseArr = [channel, false];
            const noticeAndNull = [noticeArr, nullArr];
            const noticeAndMsgid = [noticeArr, msgidArr];
            const basicLog = `[${channel}] ${msg}`;

            switch (msgid) {
              default:
                if (msg.includes('Login unsuccessful') || msg.includes('Login authentication failed')) {
                  this.wasCloseCalled = false;
                  this.reconnect = false;
                  this.reason = msg;
                  this.ws.close();
                }
                else if (msg.includes('Error logging in') || msg.includes('Improperly formatted auth')) {
                  this.wasCloseCalled = false;
                  this.reconnect = false;
                  this.reason = msg;
                  this.ws.close();
                }
                else if (msg.includes('Invalid NICK')) {
                  this.wasCloseCalled = false;
                  this.reconnect = false;
                  this.reason = 'Invalid NICK.';
                  this.ws.close();
                }
                break;
            }

            break;
          }

          case 'USERNOTICE': {
            const username = tags['display-name'] || tags['login'];
            const plan = tags['msg-param-sub-plan'] ?? '';
            const planName = _.unescapeIRC(tags['msg-param-sub-plan-name'] ?? '') || null;
            const prime = plan.includes('Prime');
            const methods = { prime, plan, planName };
            const streakMonths = ~~(tags['msg-param-streak-months'] || 0);
            const recipient = tags['msg-param-recipient-display-name'] || tags['msg-param-recipient-user-name'];
            const giftSubCount = ~~tags['msg-param-mass-gift-count'];
            tags['message-type'] = msgid;

            switch (msgid) {
              case 'resub':
                this.emit('resub', channel, username, streakMonths, msg, tags, methods);
                break;

              case 'sub':
                this.emit('sub', channel, username, methods, msg, tags);
                this.emit('subscription', channel, username, methods, msg, tags);
                break;

              case 'subgift':
                this.emit('subgift', channel, username, streakMonths, recipient, methods, tags);
                break;

              case 'anonsubgift':
                this.emit('anonsubgift', channel, streakMonths, recipient, methods, tags);
                break;

              case 'submysterygift':
                this.emit('submysterygift', channel, username, giftSubCount, methods, tags);
                break;

              case 'primepaidupgrade':
                this.emit('primepaidupgrade', channel, username, methods, tags);
                break;

              case 'giftpaidupgrade':
                const sender = tags['msg-param-sender-name'] || tags['msg-param-sender-login'];
                this.emit('giftpaidupgrade', channel, username, sender, tags);
                break;

              case 'anongiftpaidupgrade':
                this.emit('anongiftpaidupgrade', channel, username, tags);
                break;

              case 'announcement':
                const color = tags['msg-param-color'];
                this.emit('announcement', channel, tags, msg, false, color);
                break;

              case 'raid': {
                const username = tags['msg-param-displayName'] || tags['msg-param-login'];
                const viewers = +tags['msg-param-viewerCount'];
                this.emit('raided', channel, username, viewers, tags);
                break;
              }

              default:
                this.emit('usernotice', msgid, channel, tags, msg);
                break;
            }
            break;
          }

          case 'HOSTTARGET': {
            const msgSplit = msg.split(' ');
            const viewers = ~~msgSplit[1] || 0;

            if (msgSplit[0] === '-') this.emit('unhost', channel, viewers);
            else this.emit('hosting', channel, msgSplit[0], viewers);

            break;
          }

          case 'CLEARCHAT':
            if (message.params.length > 1) {
              const duration = message.tags['ban-duration'] ?? null;
              if (duration == null) this.emit('ban', channel, msg, null, message.tags);
              else this.emit('timeout', channel, msg, null, ~~duration, message.tags);
            }
            else this.emit('clearchat', channel);
            break;

          case 'CLEARMSG':
            if (message.params.length > 1) {
              const deletedMessage = msg;
              const username = tags['login'];
              tags['message-type'] = 'messagedeleted';

              this.emit('chatdeleted', channel, username, deletedMessage, tags)
            }
            break;

          case 'RECONNECT':
            this.disconnect().catch(err => console.error(err));
            setTimeout(() => this.connect().catch(err => console.error(err)), this.reconnectTimer);
            break;

          case 'USERSTATE':
            message.tags.username = this.username;

            if (message.tags['user-type'] == 'mod') {
              if (!this.moderators[channel]) this.moderators[channel] = [];
              if (!this.moderators[channel].includes(this.username)) this.moderators[channel].push(this.username);
            }

            if (!_.isJustinfan(this.getUsername()) && !this.userstate[channel]) {
              this.userstate[channel] = tags;
              this.lastJoined = channel;
              this.channels.push(channel);
              this.emit('join', channel, _.username(this.getUsername()), true);
            }

            if (message.tags['emote-sets'] !== this.emotes) {
              this.emotes = message.tags['emote-sets'];
              this.emit('emotesets', this.emotes, null);
            }

            this.userstate[channel] = tags;
            break;

          case 'GLOBALUSERSTATE':
            this.globaluserstate = tags;
            this.emit('globaluserstate', tags);

            if (message.tags['emote-sets'] !== undefined && message.tags['emote-sets'] !== this.emotes) {
              this.emotes = message.tags['emote-sets'];
              this.emit('emotesets', this.emotes, null);
            }
            break;

          case 'ROOMSTATE':
            if (_.channel(this.lastJoined) == channel) {
              this.emit('_promiseJoin', null, channel);
            };

            message.tags.channel = channel;
            this.emit('roomstate', channel, message.tags);

            break;

          case 'SERVERCHANGE': break;

          default:
            console.warn(`Could not parse message from tmi.twtich.tv:\n${JSON.stringify(message, null, 4)}`);
            break;
        }
      }
      else if (message.prefix == 'jtv') {
        switch (message.command) {
          case 'MODE':
            if (msg == '+o') {
              if (!this.moderators[channel]) this.moderators[channel] = [];
              if (!this.moderators[channel].includes(message.params[2])) this.moderators[channel].push(message.params[2]);

              this.emit('mod', channel, message.params[2]);
            }
            else if (msg == '-o') {
              if (!this.moderators[channel]) this.moderators[channel] = [];
              this.moderators[channel].filter(value => value !== message.params[2]);

              this.emit('unmod', channel, message.parms[2]);
            }
            break;

          default:
            console.warn(`Could not parse message from jtv:\n${JSON.stringify(message, null, 2)}`);
            break;
        }
      }
      else {
        switch (message.command) {
          case '353':
            this.emit('names', message.params[2], message.params[3].split(' '));
            break;

          case '366': break;

          case 'JOIN': {
            const [nick] = message.prefix.split('!');
            const matchesUsername = this.username === nick;
            const isSelfAnon = matchesUsername && _.isJustinfan(this.getUsername());

            if (isSelfAnon) {
              this.lastJoined = channel;
              this.channels.push(channel);

              this.emit('join', channel, nick, true);
            }
            else if (!matchesUsername) this.emit('join', channel, nick, false);
            break;
          }

          case 'PART': {
            const [nick] = message.prefix.split('!');
            const isSelf = this.username === nick;

            if (isSelf) {
              if (this.userstate[channel]) delete this.userstate[channel];

              let index = this.channels.indexOf(channel);
              if (index !== -1) this.channels.splice(index, 1);

              index = this.opts.channels.indexOf(channel);
              if (index !== -1) this.opts.channels.splice(index, 1);
            }

            this.emit('part', channel, nick, isSelf);
            break;
          }

          case 'WHISPER': {
            const [nick] = message.prefix.split('!');

            if (!_.hasOwn(message.tags, 'username')) message.tags.username = nick;
            message.tags['message-type'] = 'whisper';

            const from = _.channel(message.tags.username);

            this.emit('whisper', from, message.tags, msg, false);
            break;
          }

          case 'PRIVMSG':
            [message.tags.username] = message.prefix.split('!');
            if (message.tags.username == 'jtv') {
              const name = _.username(msg.split(' ')[0]);
              const autohost = msg.includes('auto');

              if (msg.includes('hosting you for')) {
                let count = 0;
                const parts = msg.split(' ');
                for (let i = 0; i < parts.length; i++) {
                  if (_.isInteger(parts[i])) {
                    count = ~~parts[i];
                    break;
                  }
                }

                this.emit('hosted', channel, name, count, autohost);
              }
              else if (msg.includes('hosting you')) this.emit('hosted', channel, name, 0, autohost);
            }
            else {
              const isActionMessage = _.actionMessage(msg);
              message.tags['message-type'] = isActionMessage ? 'action' : 'chat';
              const cleanedMsg = isActionMessage ? isActionMessage[1] : msg;

              if (_.hasOwn(message.tags, 'bits')) this.emit('cheer', channel, message.tags, cleanedMsg);
              else {
                if (_.hasOwn(message.tags, 'msg-id')) {
                  if (message.tags['msg-id'] == 'highlighted-message') {
                    const rewardType = message.tags['msg-id'];
                    this.emit('redeem', channel, message.tags.username, rewardType, message.tags, cleanedMsg);
                  }
                  else if (message.tags['msg-id'] === 'skip-subs-mode-message') {
                    const rewardType = message.tags['msg-id'];
                    this.emit('redeem', channel, message.tags.username, rewardType, message.tags, cleanedMsg);
                  }
                }
                else if (_.hasOwn(message.tags, 'custom-reward-id')) {
                  const rewardType = message.tags['custom-reward-id'];
                  this.emit('redeem', channel, message.tags.username, rewardType, message.tags, cleanedMsg);
                }

                if (isActionMessage) {
                  this.emit('action', channel, message.tags, cleanedMsg, false);
                }
                else this.emit('chat', channel, message.tags, cleanedMsg, false);
              }
            }
            break;

          default:
            console.warn(`Could not parse message:\n${JSON.stringify(message, null, 2)}`);
            break;
        }
      }
    }
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.server = this.opts.connection.server ?? 'irc-ws.chat.twitch.tv';
      this.port = this.opts.connection.port ?? 80;

      if (this.secure) this.port = 443;
      if (this.port == 443) this.secure = true;

      this.reconnectTimer = this.reconnectTimer * this.reconnectDecay;
      if (this.reconnectTimer >= this.maxReconnectInterval) this.reconnectTimer = this.maxReconnectInterval;

      this._openConnection();
    });
  }

  _openConnection() {
    const url = `${this.secure ? 'wss' : 'ws'}://${this.server}:${this.port}`;
    const connectionOptions = {};
    if ('agent' in this.opts.connection) {
      connectionOptions.agent = this.opts.connection.agent;
    }

    this.ws = new WebSocket(url, 'irc', connectionOptions);

    this.ws.onmessage = this._onMessage.bind(this);
    this.ws.onerror = this._onError.bind(this);
    this.ws.onclose = this._onClose.bind(this);
    this.ws.onopen = this._onOpen.bind(this);
  }

  _onOpen() {
    if (!this._isConnected()) return;

    this.emit('connecting', this.server, ~~this.port);

    this.username = _.username(this.opts.identity.username ?? _.justinfan());
    this._getToken()
      .then(token => {
        const password = _.password(token);
        this.emit('logon');

        let caps = 'twitch.tv/tags twitch.tv/commands';
        if (!this._skipMembership) caps += ' twitch.tv/membership';
        this.ws.send(`CAP REQ :${caps}`);

        if (password) this.ws.send(`PASS ${password}`);
        else if (_.isJustinfan(this.username)) this.ws.send(`PASS SCHMOOPIIE`);

        this.ws.send(`NICK ${this.username}`);
      })
      .catch(err => {
        this.emit('_promiseConnect', err);
        this.emit('disconnected', 'Could not get a token');
      });
  }

  _getToken() {
    const passwordOption = this.opts.identity.password;
    const password = typeof passwordOption == 'function' ? passwordOption() : passwordOption;
    return Promise.resolve(password);
  }

  _onMessage(event) {
    const parts = event.data.trim().split('\r\n');

    parts.forEach(str => {
      const msg = parser.msg(str);
      if (msg) this.handleMessage(msg);
    });
  }

  _onError() {
    this.moderators = {};
    this.userstate = {};
    this.globaluserstate = {};

    clearInterval(this.pingLoop);
    clearTimeout(this.pingTimeout);

    this.reason = this.ws == null ? 'Connection closed.' : 'Unable to connect.';

    this.emit('_promiseConnect', this.reason);
    this.emit('disconnected', this.reason);

    if (this.reconnect && this.reconnections === this.maxReconnectAttempts) {
      this.emit('maxreconnect');
      console.error('Maximum reconnection attempts reached.');
    }
    if (this.reconnect && !this.reconnecting && this.reconnections <= this.maxReconnectAttempts - 1) {
      this.reconnecting = true;
      this.reconnections++;
      console.log(`Reconnecting in ${Math.round(this.reconnectTimer / 1000)} seconds..`);
      this.emit('reconnect');
      setTimeout(() => {
        this.reconnecting = false;
        this.connect().catch(err => console.error(err));
      }, this.reconnectTimer);
    }
  }

  _onClose() {
    this.moderators = {};
    this.userstate = {};
    this.globaluserstate = {};

    clearInterval(this.pingLoop);
    clearTimeout(this.pingTimeout);

    if (this.wasCloseCalled) {
      this.wasCloseCalled = false;
      this.reason = 'Connection closed.';
      this.emit('disconnected', this.reason);
    }
    else {
      this.emit('disconnected', this.reason);

      if (!this.wasCloseCalled && this.reconnect && this.reconnections === this.maxReconnectAttempts) {
        this.emit('maxreconnect');
      }
      if (!this.wasCloseCalled && this.reconnect && this.reconnections <= this.maxReconnectAttempts - 1) {
        this.reconnecting = true;
        this.reconnections++;

        this.emit('reconnect');
        setTimeout(() => {
          this.reconnecting = false;
          this.connect().catch(err => console.error(err));
        }, this.reconnectTimer);
      }
    }

    this.ws = null;
  }

  _getPromiseDelay() {
    return Math.max(600, this.currentLatency * 1000 + 100);
  }

  _sendCommand({ delay, channel, command, tags }, fn) {
    return new Promise((resolve, reject) => {
      if (!this._isConnected()) return reject('Not connected to server.');
      else if (delay == null || typeof delay === 'number') {
        if (delay == null) delay = this._getPromiseDelay();
        _.promiseDelay(delay).then(() => reject('No response from Twitch.'));
      }

      const formedTags = parser.formTags(tags);

      if (typeof channel == 'string') {
        const chan = _.channel(channel);
        this.ws.send(`${formedTags ? `${formedTags}` : ''}PRIVMSG ${chan} :${command}`);
      }
      else this.ws.send(`${formedTags ? `${formedTags}` : ''}${command}`);

      if (typeof fn == 'function') {
        fn(resolve, reject);
      }
      else resolve();
    })
  }

  _sendMessage({ channel, message, tags }, fn) {
    return new Promise((resolve, reject) => {
      if (!this._isConnected()) return reject('Not connected to server.');
      else if (_.isJustinfan(this.getUsername())) reject('Cannot send anonymous messages.');

      const chan = _.channel(channel);
      if (!this.userstate[chan]) this.userstate[chan] = {};

      if (message.length > 500) {
        const maxLength = 500;
        const msg = message;
        let lastSpace = msg.slice(0, maxLength).lastIndexOf(' ');

        if (lastSpace === -1) lastSpace = maxLength;

        message = msg.slice(0, lastSpace);

        setTimeout(() => {
          this._sendMessage({ channel, message: msg.slice(lastSpace), tags });
        }, 350);
      }

      const formedTags = parser.formTags(tags);
      this.ws.send(`${formedTags ? `${formedTags}` : ''}PRIVMSG ${chan} :${message}`);

      const userstate = Object.assign(
        {},
        this.userstate[chan],
        { emotes: null }
      );

      const actionMessage = _.actionMessage(message);
      if (actionMessage) {
        userstate['message-type'] = 'action';
        this.emit('action', chan, userstate, actionMessage[1], true);
      }
      else {
        userstate['message-type'] = 'chat';
        this.emit('chat', chan, userstate, message, true);
      }

      if (typeof fn == 'function') fn(resolve, reject);
      else resolve();
    })
  }

  getUsername() {
    return this.username;
  }

  getOptions() {
    return this.opts;
  }

  getChannels() {
    return this.channels;
  }

  isMod(channel, username) {
    const chan = _.channel(channel);
    if (!this.moderators[chan]) this.moderators[chan] = [];
    return this.moderators[chan].includes(_.username(username));
  }

  readyState() {
    if (this.ws == null) return 'CLOSED';

    return ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][this.ws.readyState];
  }

  _isConnected() {
    return this.ws !== null && this.ws.readyState === 1;
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      if (this.ws !== null && this.ws.readyState !== 3) {
        this.wasCloseCalled = true;
        this.ws.close();
      }
      else {
        reject('Cannot disconnect from server. Socket is not opened or connection is already closing.');
      }
    });
  }
}