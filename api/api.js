const fetch = require('node-fetch').default;
const { EventEmitter } = require('node:events');

module.exports = class API extends EventEmitter {
  constructor(id, secret, customTokens = false, token, refreshToken) {
    super();
    this.client_id = id;
    this.client_secret = secret;
    this.refresh_token = refreshToken;
    this.token = token;
    this.headers = {
      'Authorization': `Bearer ${this.token}`,
      'Client-Id': this.client_id
    }

    if (typeof token !== 'string' && !customTokens) {
      this.valid = false;
      console.log(`The token variable needs to be set`);
    } else {
      this.valid = true;
    }
  }

  async post(url, headers = {}, data) {
    if (!this.valid) return 'The token variable needs to be set';
    let oldHeaders = headers;
    let theaders = this.headers;
    headers = {
      ...theaders,
      ...headers
    }

    const res = await fetch(`https://api.twitch.tv/helix/${url}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (res.status === 401 && !this.refresh_token) return 'Token expired, if you want it to auto update please set refresh_token';
    else if (res.status == 401) {
      let success = await this.resetToken();
      if (success) return this.post(url, oldHeaders, data);
    } else if (res.status == 204) {
      this.emit('result', 'post', url, 'No Content');
      return {};
    } else {
      let json = await res.json();
      this.emit('result', 'post', url, json);
      return json;
    }
  }

  async patch(url, headers = {}, data) {
    if (!this.valid) return 'The token variable needs to be set';
    let oldHeaders = headers;
    let theaders = this.headers;
    headers = {
      ...theaders,
      ...headers
    }

    const res = await fetch(`https://api.twitch.tv/helix/${url}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (res.status === 401 && !this.refresh_token) return 'Token expired, if you want it to auto update please set refresh_token';
    else if (res.status == 401) {
      let success = await this.resetToken();
      if (success) return this.patch(url, oldHeaders, data);
    } else if (res.status == 204) {
      this.emit('result', 'patch', url, 'No Content');
      return {};
    } else {
      let json = await res.json();
      this.emit('result', 'patch', url, json);
      return json;
    }
  }

  async get(url, query = {}, headers = {}) {
    if (!this.valid) return 'The token variable needs to be set';
    let oldHeaders = headers;
    let theaders = this.headers;
    headers = {
      ...theaders,
      ...headers
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if(typeof value == 'string') params.append(key, value);
      else params.append(key, String(value));
    }

    const res = await fetch(`https://api.twitch.tv/helix/${url}?${params.toString()}`, {
      method: 'GET',
      headers: headers,
    });

    if (res.status === 401 && !this.refresh_token) return 'Token expired, if you want it to auto update please set refresh_token';
    else if (res.status == 401) {
      let success = await this.resetToken();
      if (success) return this.get(url, oldHeaders);
    } else if (res.status == 204) {
      this.emit('result', 'get', url, 'No Content');
      return {};
    } else {
      let json = await res.json();
      this.emit('result', 'get', url, json);
      return json;
    }
  }

  async delete(url, query = {}, headers = {}) {
    if (!this.valid) return 'The token variable needs to be set';
    let oldHeaders = headers;
    let theaders = this.headers;
    headers = {
      ...theaders,
      ...headers
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if(typeof value == 'string') params.append(key, value);
      else params.append(key, String(value));
    }

    const res = await fetch(`https://api.twitch.tv/helix/${url}?${params.toString()}`, {
      method: 'DELETE',
      headers: headers
    });

    if (res.status === 401 && !this.refresh_token) return 'Token expired, if you want it to auto update please set refresh_token';
    else if (res.status == 401) {
      let success = await this.resetToken();
      if (success) return this.delete(url, oldHeaders);
    } else if (res.status == 204) {
      this.emit('result', 'delete', url, 'No Content');
      return {};
    } else {
      let json = await res.json();
      this.emit('result', 'delete', url, json);
      return json;
    }
  }

  async resetToken(refresh = this.refresh_token) {
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${this.client_id}&client_secret=${this.client_secret}&refresh_token=${refresh}&grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'x-www-form-urlencoded'
      }
    });

    if (res.ok) {
      const data = await res.json();
      let token = data.access_token;
      let refreshToken = data.refresh_token;
      this.token = token;
      this.refresh_token = refreshToken;

      this.emit('refreshToken', token, refreshToken);
      return true;
    } else {
      const data = await res.text();
      console.log(data);
      return false;
    }
  }
}