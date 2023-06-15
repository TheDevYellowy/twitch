const fetch = require('node-fetch').default;
const { EventEmitter } = require('node:events');

module.exports = class API extends EventEmitter {
  constructor(id, secret, token, refreshToken) {
    this.client_id = id;
    this.client_secret = secret;
    this.refresh_token = refreshToken;
    this.token = token;
    this.headers = {
      'Authorization': `Bearer ${this.token}`,
      'Client-Id': this.client_id
    }

    if (typeof token !== 'string') {
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

    const res = await fetch(`https://twitch.tv/helix/${url}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (res.status === 401 && !this.refresh_token) return 'Token expired, if you want it to auto update please set refresh_token';
    else if (res.status == 401) {
      let success = await this.resetToken();
      if (success) return this.post(url, oldHeaders, data);
    }
    else {
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

    const res = await fetch(`https://twitch.tv/helix/${url}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (res.status === 401 && !this.refresh_token) return 'Token expired, if you want it to auto update please set refresh_token';
    else if (res.status == 401) {
      let success = await this.resetToken();
      if (success) return this.patch(url, oldHeaders, data);
    }
    else {
      let json = await res.json();
      this.emit('result', 'patch', url, json);
      return json;
    }
  }

  async get(url) {
    if (!this.valid) return 'The token variable needs to be set';

    const res = await fetch(`https://twitch.tv/helix/${url}`, {
      method: 'GET',
      headers: this.headers
    });

    if (res.status === 401 && !this.refresh_token) return 'Token expired, if you want it to auto update please set refresh_token';
    else if (res.status == 401) {
      let success = await this.resetToken();
      if (success) return this.get(url);
    }
    else {
      let json = await res.json();
      this.emit('result', 'get', url, json);
      return json;
    }
  }

  async delete(url) {
    if (!this.valid) return 'The token variable needs to be set';
    const res = await fetch(`https://twitch.tv/helix/${url}`, {
      method: 'DELETE',
      headers: this.headers
    });

    if (res.status === 401 && !this.refresh_token) return 'Token expired, if you want it to auto update please set refresh_token';
    else if (res.status == 401) {
      let success = await this.resetToken();
      if (success) return this.delete(url);
    }
    else {
      let json = await res.json();
      this.emit('result', 'delete', url, json);
      return json;
    }
  }

  async resetToken() {
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${this.client_id}&client_secret=${this.client_secret}&refresh_token=${this.refresh_token}&grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'x-www-form-urlencoded'
      }
    });

    var data;
    if (res.ok) {
      data = await res.json();
      let token = data.access_token;
      let refreshToken = data.refresh_token;
      this.token = token;
      this.refresh_token = refreshToken;

      this.emit('refreshToken', token, refreshToken);
      return true;
    } else {
      data = await res.json();
      console.log(data);
      return false;
    }
  }
}