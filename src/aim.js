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
			cache: true
		}, options);
		if (this.options.cache) {
			this.data = new Map();
		}
		this.queryStack = new Map();
	}

	/**
	 *
	 * @param {string} key
	 * @param {string} field
	 * @param {function} callback
	 */
	has(key, field, callback) {
		return void process.nextTick(() => {
			const keyValue = this.options.cache ? this.data.get(key) : false;
			callback(null, !!(keyValue && keyValue.has(field)));
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
			let keyValue;
			if (this.options.cache) {
				keyValue = this.data.get(key) || new Map();
				if (keyValue.has(field)) {
					this.stats.hits++;
					return void process.nextTick(() => {
						callback(null, keyValue.get(field));
					});
				}
				this.data.set(key, keyValue);
				this.stats.misses++;
			}
			if (!this.next) {
				return void process.nextTick(() => {
					callback(null, null);
				});
			}
			const queryStackKey = key + "---" + field;
			if (!this.queryStack.has(queryStackKey)) {
				this.queryStack.set(queryStackKey, []);
				this.next.get(key, field, (err, value) => {
					if (err === null && this.options.cache) {
						keyValue.set(field, value);
					}
					this.queryStack.get(queryStackKey).forEach((cb) => {
						cb(err, value);
					});
					this.queryStack.delete(queryStackKey);
				});
			}
			this.queryStack.get(queryStackKey).push(callback);
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
				const keyValue = this.data.get(key) || new Map();
				keyValue.set(field, value);
				if (!this.data.has(key)) {
					this.data.set(key, keyValue);
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
			if (this.options.cache && this.data.has(key)) {
				return callback(null, this.data.get(key).delete(field));
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
			this.queryStack.clear();
			if (this.options.cache) {
				this.data.clear();
				return callback(null, true);
			}
			callback(null, false);
		});
	}
}

module.exports = Aim;
