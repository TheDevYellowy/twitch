const crypto = require('crypto');
const express = require('express');
const EventSub = require('./eventsub');

const twitch_message_id = 'twitch-eventsub-message-id';
const twitch_message_timestamp = 'twitch-eventsub-message-timestamp';
const twitch_message_signature = 'twitch-eventsub-message-signature';
const message_type = 'twitch-eventsub-message-type';

const message_type_verification = 'webhook_callback_verificcation';
const message_type_notification = 'notification';
const message_type_revocation = 'revocation';

const HMAC_PREFIX = 'sha256=';

module.exports = class webhook {
  constructor(parent, callback, secret, port = 80) {
    /** @type {EventSub} */
    this.parent = parent;
    this.callback = callback;
    this.secret = secret;
    this.port = port;
    /**
     * The express app that the webhook uses you can use this for your backend
     * ```js
     * const app = EventSub.webhook.app;
     * app.get('/', (req, res) => {});
     * ```
     */
    this.app = express();

    
    this.app.use(express.raw({ type: 'application/json' }));

    this.app.post('/eventsub', (req, res) => {
      let message = this.getHmacMessage(req);
      let hmac = HMAC_PREFIX+this.getHmac(message);

      if(this.verifyMessage(hmac, req.headers[twitch_message_signature])) {
        let notification = JSON.parse(req.body);
        this.parent.emit('raw', notification);

        switch(req.headers[message_type]) {
          case message_type_notification:
            this.parent.emit(notification.subscription.type, notification.event);
            res.sendStatus(204);
            break;
          case message_type_verification:
            res.status(200).send(notification.challenge);
            break;
          case message_type_revocation:
            this.parent.emit('revocation', notification.subscription.status);
            break;
          default:
            res.sendStatus(204);
        }
      } else {
        res.sendStatus(403);
      }
    });

    this.app.listen(this.port, () => this.parent.emit("online"));
  }

  getHmacMessage(req) {
    return (req.headers[twitch_message_id]+req.headers[twitch_message_timestamp]+req.body);
  }

  getHmac(message) {
    return crypto.createHmac('sha256', this.secret)
    .update(message)
    .digest('hex');
  }

  verifyMessage(hmac, verifySignature) {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
  }
}