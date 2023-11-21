const actionMessageRegex = /^\u0001ACTION ([^\u0001]+)\u0001$/;
const justinFanRegex = /^(justinfan)(\d+$)/;
const unescapeIRCRegex = /\\([sn:r\\])/g;
const escapeIRCRegex = /([ \n;\r\\])/g;
const tokenRegex = /^oauth:/i;
const ircEscapedChars = { s: ' ', n: '', ':': ';', r: '' };
const ircUnescapedChars = { ' ': 's', '\n': 'n', ';': ':', '\r': 'r' };
const _ = module.exports = {
	// Indirectly use hasOwnProperty
	// TODO: Node v16.9.0 adds Object.hasOwn
	hasOwn: (obj, key) => ({}).hasOwnProperty.call(obj, key),

	promiseDelay: time => new Promise(resolve => setTimeout(resolve, time)),

	isInteger(input) {
		if(typeof input !== 'string' && typeof input !== 'number') {
			return false;
		}
		return !isNaN(Math.round(input));
	},

	justinfan: () => `justinfan${Math.floor((Math.random() * 80000) + 1000)}`,

	isJustinfan: username => justinFanRegex.test(username),

	channel(str) {
		const channel = (str ? str : '').toLowerCase();
		return channel[0] === '#' ? channel : `#${channel}`;
	},

	username(str) {
		const username = (str ? str : '').toLowerCase();
		return username[0] === '#' ? username.slice(1) : username;
	},

	token: str => str ? str.replace(tokenRegex, '') : '',

	password(str) {
		const token = _.token(str);
		return token ? `oauth:${token}` : '';
	},

	actionMessage: msg => msg.match(actionMessageRegex),

	unescapeHtml: safe =>
		safe.replace(/\\&amp\\;/g, '&')
		.replace(/\\&lt\\;/g, '<')
		.replace(/\\&gt\\;/g, '>')
		.replace(/\\&quot\\;/g, '"')
		.replace(/\\&#039\\;/g, '\''),

	unescapeIRC(msg) {
		if(!msg || typeof msg !== 'string' || !msg.includes('\\')) {
			return msg;
		}
		return msg.replace(
			unescapeIRCRegex,
			(m, p) => p in ircEscapedChars ? ircEscapedChars[p] : p
		);
	},

	escapeIRC(msg) {
		if(!msg || typeof msg !== 'string') {
			return msg;
		}
		return msg.replace(
			escapeIRCRegex,
			(m, p) => p in ircUnescapedChars ? `\\${ircUnescapedChars[p]}` : p
		);
	},

	inherits(ctor, superCtor) {
		ctor.super_ = superCtor;
		const TempCtor = function() {};
		TempCtor.prototype = superCtor.prototype;
		ctor.prototype = new TempCtor();
		ctor.prototype.constructor = ctor;
	}
};