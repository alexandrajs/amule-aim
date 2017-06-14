/* global describe, it */
'use strict';
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const MLC = require('alexandrajs-mlc');
const AIM = require('../');
const assert = require('assert');
describe('Base', () => {
	describe('MLC', () => {
		it('has', (done) => {
			let mlc = new MLC();
			mlc.use(new AIM());
			mlc.has('key', 'field', function (err, has) {
				assert.strictEqual(err, null);
				assert.strictEqual(has, false);
				mlc.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					mlc.has('key', 'field', function (err, has) {
						assert.strictEqual(err, null);
						assert.strictEqual(has, true);
						done();
					})
				});
			});
		});
		it('set', (done) => {
			let mlc = new MLC();
			mlc.use(new AIM());
			mlc.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				mlc.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					done();
				});
			});
		});
		it('get', (done) => {
			let mlc = new MLC();
			mlc.use(new AIM());
			mlc.get('key', 'field', function (err, value) {
				assert.strictEqual(err, null);
				assert.strictEqual(value, null);
				mlc.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					mlc.get('key', 'field', function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, 'value');
						done();
					})
				});
			});
		});
		it('delete', (done) => {
			let mlc = new MLC();
			mlc.use(new AIM());
			mlc.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				mlc.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mlc.delete('key', 'field', function (err) {
						assert.strictEqual(err, null);
						mlc.has('key', 'field', (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});
		it('clear', (done) => {
			let mlc = new MLC();
			mlc.use(new AIM());
			mlc.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				mlc.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mlc.clear(function (err) {
						assert.strictEqual(err, null);
						mlc.has('key', 'field', (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});
		it('stats', (done) => {
			let mlc = new MLC();
			const aim = new AIM();
			mlc.use(aim);
			mlc.get('key', 'field', function (err, value) {
				assert.strictEqual(err, null);
				assert.strictEqual(value, null);
				const stats = aim.getStats();
				assert.strictEqual(stats.misses, 1);
				assert.strictEqual(stats.ratio, 0);
				assert.strictEqual(stats.hits, 0);
				mlc.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					mlc.get('key', 'field', function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, 'value');
						let stats = aim.getStats(true);
						assert.strictEqual(stats.misses, 1);
						assert.strictEqual(stats.ratio, 1);
						assert.strictEqual(stats.hits, 1);
						stats = aim.getStats();
						assert.strictEqual(stats.misses, 0);
						assert.strictEqual(stats.ratio, 0);
						assert.strictEqual(stats.hits, 0);
						done();
					})
				});
			});
		});
	});
	describe('MLC 2 levels', () => {
		it('has', (done) => {
			const mlc = new MLC(), aim1 = new AIM(), aim2 = new AIM();
			mlc.use(aim1);
			mlc.use(aim2);
			aim2.has('key', 'field', function (err, has) {
				assert.strictEqual(err, null);
				assert.strictEqual(has, false);
				mlc.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					aim2.has('key', 'field', function (err, has) {
						assert.strictEqual(err, null);
						assert.strictEqual(has, true);
						done();
					})
				});
			});
		});
		it('set', (done) => {
			const mlc = new MLC(), aim1 = new AIM(), aim2 = new AIM();
			mlc.use(aim1);
			mlc.use(aim2);
			mlc.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				aim2.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					done();
				});
			});
		});
		it('get', (done) => {
			const mlc = new MLC(), aim1 = new AIM(), aim2 = new AIM();
			mlc.use(aim1);
			mlc.use(aim2);
			aim2.get('key', 'field', function (err, value) {
				assert.strictEqual(err, null);
				assert.strictEqual(value, null);
				aim2.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					mlc.get('key', 'field', function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, 'value');
					});
					mlc.get('key', 'field', function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, 'value');
						done();
					})
				});
			});
		});
		it('delete', (done) => {
			const mlc = new MLC(), aim1 = new AIM(), aim2 = new AIM();
			mlc.use(aim1);
			mlc.use(aim2);
			mlc.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				aim2.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mlc.delete('key', 'field', function (err) {
						assert.strictEqual(err, null);
						aim2.has('key', 'field', (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});
		it('clear', (done) => {
			const mlc = new MLC(), aim1 = new AIM(), aim2 = new AIM();
			mlc.use(aim1);
			mlc.use(aim2);
			mlc.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				aim2.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mlc.clear(true, function (err) {
						assert.strictEqual(err, null);
						aim2.has('key', 'field', (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});
	});
});
