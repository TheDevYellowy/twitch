const _ = require('./utils');
const nonspaceRegex = /\S+/g;

function parseComplexTag(tags, tagKey, splA = ',', splB = '/', splC) {
  const raw = tags[tagKey];

  if (raw === undefined) {
    return tags;
  }

  const tagIsString = typeof raw === 'string';
  tags[`${tagKey}-raw`] = tagIsString ? raw : null;

  if (raw === true) {
    tags[tagKey] = null;
    return tags;
  }

  tags[tagKey] = {};

  if (tagIsString) {
    const spl = raw.split(splA);

    for (let i = 0; i < spl.length; i++) {
      const parts = spl[i].split(splB);
      let [, val] = parts;
      if (splC !== undefined && val) {
        val = val.split(splC);
      }
      tags[tagKey][parts[0]] = val || null;
    }
  }
  return tags;
}

module.exports = {
  badges: tags => parseComplexTag(tags, 'badges'),

  badgeInfo: tags => parseComplexTag(tags, 'badge-info'),

  emotes: tags => parseComplexTag(tags, 'emotes', '/', ':', ','),

  emoteRegex(msg, code, id, obj) {
    nonspaceRegex.lastIndex = 0;
    const regex = new RegExp(`(\\b|^|\\s)${_.unescapeHtml(code)}(\\b|$|\\s)`);
    let match;

    while ((match = nonspaceRegex.exec(msg)) !== null) {
      if (regex.test(match[0])) {
        obj[id] = obj[id] || [];
        obj[id].push([match.index, nonspaceRegex.lastIndex - 1]);
      }
    }
  },

  emoteString(msg, code, id, obj) {
    nonspaceRegex.lastIndex = 0;
    let match;

    while ((match = nonspaceRegex.exec(msg)) !== null) {
      if (match[0] === _.unescapeHtml(code)) {
        obj[id] = obj[id] || [];
        obj[id].push([match.index, nonspaceRegex.lastIndex - 1]);
      }
    }
  },

  transformEmotes(emotes) {
    let transformed = '';

    Object.keys(emotes).forEach(id => {
      transformed = `${transformed}${id}:`;
      emotes[id].forEach(
        index => transformed = `${transformed}${index.join('-')},`
      );
      transformed = `${transformed.slice(0, -1)}/`;
    });
    return transformed.slice(0, -1);
  },

  formTags(tags = {}) {
    const result = Object.entries(tags).map(([k, v]) => `${_.escapeIRC(k)}=${_.escapeIRC(v)}`);
    return !result.length ? null : `@${result.join(';')}`;
  },

  msg(data) {
    const message = {
      raw: data,
      tags: {},
      prefix: null,
      command: null,
      params: []
    };

    let position = 0;
    let nextspace = 0;

    if (data.charCodeAt(0) === 64) {
      nextspace = data.indexOf(' ');

      if (nextspace === -1) {
        return null;
      }

      const rawTags = data.slice(1, nextspace).split(';');

      for (let i = 0; i < rawTags.length; i++) {
        const tag = rawTags[i];
        const pair = tag.split('=');
        message.tags[pair[0]] = tag.slice(tag.indexOf('=') + 1) || true;
      }

      position = nextspace + 1;
    }

    while (data.charCodeAt(position) === 32) {
      position++;
    }

    if (data.charCodeAt(position) === 58) {
      nextspace = data.indexOf(' ', position);

      if (nextspace === -1) {
        return null;
      }

      message.prefix = data.slice(position + 1, nextspace);
      position = nextspace + 1;

      while (data.charCodeAt(position) === 32) {
        position++;
      }
    }

    nextspace = data.indexOf(' ', position);

    if (nextspace === -1) {
      if (data.length > position) {
        message.command = data.slice(position);
        return message;
      }
      return null;
    }

    message.command = data.slice(position, nextspace);

    position = nextspace + 1;

    while (data.charCodeAt(position) === 32) {
      position++;
    }

    while (position < data.length) {
      nextspace = data.indexOf(' ', position);

      if (data.charCodeAt(position) === 58) {
        message.params.push(data.slice(position + 1));
        break;
      }

      if (nextspace !== -1) {
        message.params.push(data.slice(position, nextspace));
        position = nextspace + 1;

        while (data.charCodeAt(position) === 32) {
          position++;
        }

        continue;
      }

      if (nextspace === -1) {
        message.params.push(data.slice(position));
        break;
      }
    }
    return message;
  }
};