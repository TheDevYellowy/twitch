/**
 * {
 *  identity: {}
 *  api: {}
 *  capabilities: {}
 *  channels: []
 * }
 */

const EventEmitter = require('node:events');
const net = require('net');
const parse = require('./parser');
const util = require('./util');

class ircClient extends EventEmitter {
  constructor(options) {
    super();

    this.identity = options.identity ?? {};
    this.api = options.api ?? null;
    this.capabilities = options.capabilities ?? {
      tags: true,
      commands: false,
      membership: false
    };
    this.channels = options.channels ?? [];
    this.secure = options.secure ?? false;
    this.connection = options.connection ?? {};
    this.port = options.port ?? 6667;
    this.debug = options.debug ?? false;

    /** @type {?net.Socket} */
    this.conn = null;

    this.latency = new Date();
    this.currentLatency = null;
  }

  log(message, level = 'info') {
    const date = new Date();
    console.log(`[${date.getHours()}:${date.getMinutes()}] <${level}>: ${message}`);
  }

  connect() {
    if(this.secure) this.port = 6697;
    if(this.port == 6697) this.secure = true;

    this.conn = net.createConnection(this.port, 'irc.chat.twitch.tv');

    this.conn.setEncoding('utf8');
    this.conn.addListener('connect', () => this.onconnect());
    this.conn.addListener('data', (data) => this.ondata(data));
    this.conn.addListener('close', (err) => console.log(`connection closed the connecton ${err ? 'did' : 'did not'} have an error`));
    this.conn.addListener('error', (err) => console.log(`The connection had an error: ${err.message}`));
  }

  onconnect() {
    let cap = "CAP REQ :";
    Object.keys(this.capabilities).forEach((k) => {
      if(this.capabilities[k]) cap += `twitch.tv/${k} `;
    });
    cap += '\r\n';

    this.conn.write(cap);
    this.conn.write(`PASS oauth:${this.identity.password}\r\n`);
    this.conn.write(`NICK ${this.identity.username}\r\n`);
  }

  ondata(data) {
    const lines = data.trim().split('\r\n');

    lines.forEach(str => {
      const msg = parse.msg(str);
      // console.log({ beforeHandle: msg });
      if(msg) this.handleMessage(msg);
    });
  }

  async handleMessage(msg) {
    if(this.listenerCount('raw_message')) this.emit('raw_message', JSON.parse(JSON.stringify(msg)), msg);

    const msgid = msg.tags['msg-id'] ?? null;
    const message = msg.params[1] ?? null;
    const channel = util.channel(msg.params[0] ?? null);

    if(msg.prefix == null) {
      switch(msg.command) {
        case 'PING':
          this.emit('ping');
          this.conn.write('PONG');
          break;
        case 'PONG': {
          this.currentLatency = (new Date().getTime() - this.latency.getTime()) / 1000;
          this.emit('pong', this.currentLatency);

          clearTimeout(this.pingTimeout);
          break;
        }

        default: break;
      }
    } else if(msg.prefix == 'tmi.twitch.tv') {
      switch(msg.command) {
        case '002':
        case '003':
        case '004':
        case '372':
        case '375':
        case 'CAP':
          break;
        
        case '001':
          [ this.username ] = msg.params;
          break;
        
        case '376': {
          this.emit('connected', this.port);
          this.pingLoop = setInterval(() => {
            if(this.isConnected()) this.conn.write('PING');
            this.latency = new Date();
            this.pingTimeout = setTimeout(() => {
              if(this.conn !== null) {
                this.conn.destroy();

                clearInterval(this.pingLoop);
                clearTimeout(this.pingTimeout);
              }
            }, this.connection.timeout ?? 9999);
          }, 60000);

          const joinInterval = 2000;

          for (let i = 0; i < this.channels.length; i++) {
            this.log(`Joining ${this.channels[i]}`);
            this.join(this.channels[i]);

            await new Promise(reject => setTimeout(reject, joinInterval));
          }

          break;
        }

        case 'NOTICE': {
          switch(msgid) {
            default:
              console.log({ msgid, msg: JSON.stringify(msg, null, 2) });
              break;
          }
        }
      }
    } else if(msg.prefix == 'jtv') {
      switch(msg.command) {
        default:
          console.log({ cmd: msg.command, msg: msg.params[1], full: JSON.stringify(msg, null, 2) });
          break;
      }
    } else {
      switch(msg.command) {
        case '353':
          this.emit('names', msg.params[2], msg.params[3].split(' '));
          break;
        
        case '366': break;
        
        case 'JOIN': {
          const [ nick ] = msg.prefix.split('!');

          this.emit('join', channel, nick, this.username == nick);
          break;
        }

        case 'PRIVMSG': {
          [ msg.tags.username ] = msg.prefix.split('!');
          if(msg.tags.username == 'jtv') {}
          else {
            const isActionMessage = util.actionMessage(message);
            msg.tags['message-type'] = isActionMessage ? 'action' : 'chat';
            const cleanedMsg = isActionMessage ? isActionMessage[1] : message;
            if(util.hasOwn(msg.tags, 'bits')) {}
            else {
              if(util.hasOwn(msg.tags, 'msg-id')) {}
              else if(util.hasOwn(msg.tags, 'custom-reward-id')) {}

              if(isActionMessage) this.emit('action', channel, msg.tags, cleanedMsg);
              else this.emit('chat', channel, msg.tags, cleanedMsg);
            }
          }
          break;
        }

        default:
          console.log({ msg: JSON.stringify(msg, null, 2) });
      }
    }
  }

  isConnected() {
    return this.conn !== null && this.conn.readyState == 'open';
  }

  join(channel) {
    this.conn.write(`JOIN ${util.channel(channel)}`);
  }
}

module.exports = ircClient;