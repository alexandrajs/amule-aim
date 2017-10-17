'use strict';

/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
/**
 * @param {Object} options
 * @constructor
 */
function Aim(options) {
	this.options = Object.assign({
		cache: true
	}, options);
	/**
	 *
	 * @type {object}
	 */
	this.next = null;
	if (this.options.cache === true) {
		/**
		 *
		 */
		this.data = new Map();
	}
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
	const keyValue = this.options.cache === true ? this.data.get(key) : false;
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
	let keyValue;
	if (this.options.cache === true) {
		keyValue = this.data.get(key) || new Map();
		if (keyValue && keyValue.has(field)) {
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
	const queryStackKey = key + '---' + field;
	if (!this.queryStack.has(queryStackKey)) {
		this.queryStack.set(queryStackKey, []);
		this.next.get(key, field, (err, value) => {
			if (err === null && this.options.cache === true) {
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
	let keyValue;
	if (this.options.cache === true) {
		keyValue = this.data.get(key) || new Map();
		if (!this.data.has(key)) {
			this.data.set(key, keyValue);
		}
	}
	const cb = (err) => {
		if (!err && this.options.cache === true) {
			keyValue.set(field, value);
		}
		callback(err);
	};
	if (!this.next) {
		return void process.nextTick(() => {
			cb(null);
		});
	}
	this.next.set(key, field, value, cb);
};
/**
 *
 * @param key
 * @param field
 * @param callback
 */
Aim.prototype.delete = function (key, field, callback) {
	let cb = callback;
	if (this.options.cache === true) {
		const keyValue = this.data.get(key);
		cb = (err) => {
			if (!err && keyValue) {
				keyValue.delete(field);
			}
			callback(err);
		};
	}
	if (!this.next) {
		return void process.nextTick(() => {
			cb(null);
		});
	}
	this.next.delete(key, field, cb);
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
	if (this.options.cache === true) {
		this.data.clear();
	}
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
