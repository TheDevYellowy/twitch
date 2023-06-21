const IrcClientBase = require("./ircClientBase");
const _ = require('./utils');

module.exports = class ircClient extends IrcClientBase {
  action(channel, message, tags) {
    message = `\u0001ACTION ${message}\u0001`;
    return this._sendMessage({ channel, message, tags }, (res, _rej) => {
      res([_.channel(channel), message]);
    });
  }

  announce(channel, message) {
    return this._sendMessage({ channel, message: `/announce ${message}` }, (res, _rej) => res([_.channel(channel), message]));
  }

  join(channel) {
    channel = _.channel(channel);

    return this._sendCommand({ delay: undefined, channel: null, command: `JOIN ${channel}` }, (res, rej) => {
      const eventName = '_promiseJoin';
      let hasFulfilled = false;
      let listener = (err, joinedChannel) => {
        if (channel === _.channel(joinedChannel)) {
          this.removeListener(eventName, listener);
          hasFulfilled = true;
          !err ? res([channel]) : rej(err);
        }
      }
      this.on(eventName, listener);

      const delay = this._getPromiseDelay();
      _.promiseDelay(delay).then(() => {
        if (!hasFulfilled) this.emit(eventName, 'No response from Twitch.', channel);
      });
    });
  };

  reply(channel, message, replyParentMsgId, tags = {}) {
    if (typeof replyParentMsgId == 'object') replyParentMsgId = replyParentMsgId.id;
    if (!replyParentMsgId || typeof replyParentMsgId !== 'string') throw new Error('replyParentMsgId is required.');
    return this.say(channel, message, { ...tags, 'reply-parent-msg-id': replyParentMsgId });
  }

  say(channel, message, tags) {
    channel = _.channel(channel);

    if ((message.startsWith('.') && !message.startsWith('..')) || message.startsWith('/') || message.startsWith('\\')) {
      if (message.slice(1, 4) === 'me ') return this.action(channel, message.slice(4));
      else return this._sendCommand({ channel, command: message, tags }, (res, _rej) => res([channel, message]));
    }

    return this._sendMessage({ channel, message, tags }, (res, _rej) => res([channel, message]));
  }
}