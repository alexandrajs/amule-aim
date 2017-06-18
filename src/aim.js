'use strict';
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
/**
 *
 * @constructor
 */
function Aim() {
	/**
	 *
	 * @type {object}
	 */
	this.next = null;
	/**
	 *
	 */
	this.data = new Map();
	/**
	 *
	 * @type {Map}
	 */
	this.queryStack = new Map();
	this.clearStats();
}
/**
 *
 * @param key
 * @param field
 * @param callback
 */
Aim.prototype.has = function (key, field, callback) {
	const keyValue = this.data.get(key);
	return void process.nextTick(() => {
		callback(null, !!keyValue && keyValue.has(field));
	});
};
/**
 *
 * @param key
 * @param field
 * @param callback
 */
Aim.prototype.get = function (key, field, callback) {
	const keyValue = this.data.get(key) || new Map();
	if (keyValue && keyValue.has(field)) {
		this.stats.hits++;
		return void process.nextTick(() => {
			callback(null, keyValue.get(field));
		});
	}
	this.data.set(key, keyValue);
	this.stats.misses++;
	if (!this.next) {
		return void callback(null, null);
	}
	const queryStackKey = key + '---' + field;
	if (!this.queryStack.has(queryStackKey)) {
		this.queryStack.set(queryStackKey, []);
		this.next.get(key, field, (err, value) => {
			if (err === null) {
				keyValue.set(field, value);
			}
			this.queryStack.get(queryStackKey).forEach((cb) => {
				cb(err, value);
			})
		});
	}
	this.queryStack.get(queryStackKey).push(callback);
};
/**
 *
 * @param key
 * @param field
 * @param value
 * @param callback
 */
Aim.prototype.set = function (key, field, value, callback) {
	const keyValue = this.data.get(key) || new Map();
	if (!this.data.has(key)) {
		this.data.set(key, keyValue);
	}
	keyValue.set(field, value);
	if (!this.next) {
		return void process.nextTick(() => {
			callback(null, true);
		});
	}
	this.next.set(key, field, value, callback);
};
/**
 *
 * @param key
 * @param field
 * @param callback
 */
Aim.prototype.delete = function (key, field, callback) {
	const keyValue = this.data.get(key);
	if (keyValue) {
		keyValue.delete(field);
	}
	if (!this.next) {
		return void process.nextTick(() => {
			callback(null, true);
		});
	}
	this.next.delete(key, field, callback);
};
/**
 * @param [propagate]
 * @param callback
 */
Aim.prototype.clear = function (propagate, callback) {
	if (typeof propagate === 'function') {
		callback = propagate;
		propagate = undefined;
	}
	this.data.clear();
	this.queryStack.clear();
	if (propagate && this.next) {
		return void this.next.clear(propagate, callback);
	}
	process.nextTick(() => {
		callback(null, true);
	});
};
/**
 * @param [clear]
 * @returns {{hits: number, misses: number, ratio: number}}
 */
Aim.prototype.getStats = function (clear) {
	const stats = this.stats;
	stats.ratio = stats.hits && stats.misses ? stats.hits / stats.misses : 0;
	if (clear) {
		this.clearStats();
	}
	return stats;
};
/**
 *
 */
Aim.prototype.clearStats = function () {
	this.stats = {
		hits: 0,
		misses: 0
	};
};
module.exports = Aim;
