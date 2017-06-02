'use strict';
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
/**
 *
 * @constructor
 */
function AIM() {
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
 * @param callback
 */
AIM.prototype.has = function (key, callback) {
	return void process.nextTick(() => {
		callback(null, this.data.has(key));
	});
};
/**
 *
 * @param key
 * @param callback
 */
AIM.prototype.get = function (key, callback) {
	if (this.data.has(key)) {
		this.stats.hits++;
		return void process.nextTick(() => {
			callback(null, this.data.get(key));
		});
	}
	this.stats.misses++;
	if (!this.next) {
		return void callback(null, null);
	}
	if (!this.queryStack.has(key)) {
		this.queryStack.set(key, []);
		this.next.get(key, (err, value) => {
			if (err === null) {
				this.data.set(key, value);
			}
			this.queryStack.get(key).forEach((cb) => {
				cb(err, value);
			})
		});
	}
	this.queryStack.get(key).push(callback);
};
/**
 *
 * @param key
 * @param value
 * @param callback
 */
AIM.prototype.set = function (key, value, callback) {
	this.data.set(key, value);
	if (!this.next) {
		return void process.nextTick(() => {
			callback(null, true);
		});
	}
	this.next.set(key, value, callback);
};
/**
 *
 * @param key
 * @param callback
 */
AIM.prototype.delete = function (key, callback) {
	this.data.delete(key);
	if (!this.next) {
		return void process.nextTick(() => {
			callback(null, true);
		});
	}
	this.next.delete(key, callback);
};
/**
 * @param [propagate]
 * @param callback
 */
AIM.prototype.clear = function (propagate, callback) {
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
AIM.prototype.getStats = function (clear) {
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
AIM.prototype.clearStats = function () {
	this.stats = {
		hits: 0,
		misses: 0
	};
};
module.exports = AIM;
