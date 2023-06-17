const LOG_PREFIX = '[gnir]'

let logger = {
	_call: function(type, ...text) {
		console[type](LOG_PREFIX, ...text)
	},
	info: function(...text) {
		this._call('info', ...text)
	},
	error: function(...text) {
		this._call('error', ...text)
	},
	log: function(...text) {
		this._call('log', ...text)
	}
}

module.exports = logger