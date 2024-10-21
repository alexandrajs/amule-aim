"use strict";
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */

const Layer = require("amule").Layer;

class Aim extends Layer {
	/**
	 *
	 * @param {Object} [options]
	 */
	constructor(options) {
		super();
		this.options = Object.assign({
			cache: true,
			ttl: 0
		}, options);
		if (this.options.cache) {
			this.data = new Map();
			if (this.options.ttl) {
				this.ttl = new Map();
			}
		}
		this.__map = new Map();
		this.query = new Map();
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {function} callback
	 */
	has(key, field, callback) {
		return void process.nextTick(() => {
			callback(null, this.options.cache && this.data.has(this._mapKey(key, field)));
		});
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {function} callback
	 */
	get(key, field, callback) {
		process.nextTick(() => {
			const mapKey = this._mapKey(key, field);
			if (this.options.cache) {
				if (this.data.has(mapKey)) {
					this.stats.hits++;
					return void process.nextTick(() => {
						callback(null, this.data.get(mapKey));
					});
				}
				this.stats.misses++;
			}
			if (!this.next) {
				return void process.nextTick(() => {
					callback(null, null);
				});
			}
			if (!this.query.has(mapKey)) {
				this.query.set(mapKey, []);
				this.next.get(key, field, (err, value) => {
					if (err === null && this.options.cache) {
						this.data.set(mapKey, value);
					}
					this.query.get(mapKey)?.forEach((cb) => {
						cb(err, value);
					});
					this.query.delete(mapKey);
				});
			}
			this.query.get(mapKey).push(callback);
		});
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {*} value
	 * @param {function} callback
	 * @returns {*}
	 * @private
	 */
	_set(key, field, value, callback) {
		process.nextTick(() => {
			if (this.options.cache) {
				const mapKey = this._mapKey(key, field);
				this.data.set(mapKey, value);
				if (this.options.ttl) {
					const timeout = setTimeout(() => {
						this._delete(key, field, () => {
						});
					}, this.ttl);
					timeout.unref();
					this.ttl.set(mapKey, timeout);
				}
				return callback(null, true);
			}
			callback(null, false);
		});
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {function} callback
	 */
	_delete(key, field, callback) {
		process.nextTick(() => {
			const mapKey = this._mapKey(key, field);
			this._delMapKey(mapKey);
			if (this.options.cache && this.data.has(mapKey)) {
				if (this.ttl) {
					const timeout = this.ttl.get(mapKey);
					timeout && clearTimeout(timeout);
					this.ttl.delete(mapKey);
				}
				return callback(null, this.data.delete(mapKey));
			}
			callback(null, false);
		});
	}

	/**
	 *
	 * @param {function} callback
	 * @private
	 */
	_clear(callback) {
		process.nextTick(() => {
			this.query.clear();
			if (this.options.cache) {
				this.data.clear();
				return callback(null, true);
			}
			callback(null, false);
		});
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @returns {Object}
	 * @private
	 */
	_mapKey(key, field) {
		if (!this.__map.has(key)) {
			this.__map.set(key, new Map());
		}
		const _key = this.__map.get(key);
		if (!_key.has(field)) {
			_key.set(field, {
				key,
				field
			});
		}
		return _key.get(field);
	}

	/**
	 *
	 * @param {Object} mapKey
	 * @param {string} mapKey.key
	 * @param {string} mapKey.field
	 * @private
	 */
	_delMapKey({key, field}) {
		const _key = this.__map.get(key);
		if (_key) {
			_key.delete(field);
			if (!_key.size) {
				this.__map.delete(key);
			}
		}
	}
}

module.exports = Aim;
