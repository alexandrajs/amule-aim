/* global describe, it */
'use strict';
/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
const AMule = require('amule');
const Aim = require('../');
const assert = require('assert');
describe('Base', () => {
	describe('AMule', () => {
		it('has (false)', (done) => {
			let mule = new AMule();
			mule.use(new Aim());
			mule.has('key', 'field', function (err, has) {
				assert.strictEqual(err, null);
				assert.strictEqual(has, false);
				done();
			});
		});
		it('has (true)', (done) => {
			let mule = new AMule();
			mule.use(new Aim());
			mule.has('key', 'field', function (err, has) {
				assert.strictEqual(err, null);
				assert.strictEqual(has, false);
				mule.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					mule.has('key', 'field', function (err, has) {
						assert.strictEqual(err, null);
						assert.strictEqual(has, true);
						done();
					})
				});
			});
		});
		it('set', (done) => {
			let mule = new AMule();
			mule.use(new Aim());
			mule.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				mule.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					done();
				});
			});
		});
		it('get', (done) => {
			let mule = new AMule();
			mule.use(new Aim());
			mule.get('key', 'field', function (err, value) {
				assert.strictEqual(err, null);
				assert.strictEqual(value, null);
				mule.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					mule.get('key', 'field', function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, 'value');
						done();
					})
				});
			});
		});
		it('delete', (done) => {
			let mule = new AMule();
			mule.use(new Aim());
			mule.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				mule.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mule.delete('key', 'field', function (err) {
						assert.strictEqual(err, null);
						mule.has('key', 'field', (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});
		it('clear', (done) => {
			let mule = new AMule();
			mule.use(new Aim());
			mule.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				mule.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mule.clear(function (err) {
						assert.strictEqual(err, null);
						mule.has('key', 'field', (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});
		it('stats', (done) => {
			let mule = new AMule();
			const aim = new Aim();
			mule.use(aim);
			mule.get('key', 'field', function (err, value) {
				assert.strictEqual(err, null);
				assert.strictEqual(value, null);
				const stats = aim.getStats();
				assert.strictEqual(stats.misses, 1);
				assert.strictEqual(stats.ratio, 0);
				assert.strictEqual(stats.hits, 0);
				mule.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					mule.get('key', 'field', function (err, val) {
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
		it('has', (done) => {
			let mule = new AMule();
			mule.use(new Aim({cache:false}));
			mule.has('key', 'field', function (err, has) {
				assert.strictEqual(err, null);
				assert.strictEqual(has, false);
				mule.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					mule.has('key', 'field', function (err, has) {
						assert.strictEqual(err, null);
						assert.strictEqual(has, false);
						done();
					})
				});
			});
		});
		it('get', (done) => {
			let mule = new AMule();
			mule.use(new Aim({cache:false}));
			mule.get('key', 'field', function (err, value) {
				assert.strictEqual(err, null);
				assert.strictEqual(value, null);
				mule.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					mule.get('key', 'field', function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, null);
						done();
					})
				});
			});
		});
		it('delete', (done) => {
			let mule = new AMule();
			mule.use(new Aim({cache:false}));
			mule.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				mule.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, false);
					mule.delete('key', 'field', function (err) {
						assert.strictEqual(err, null);
						mule.has('key', 'field', (err, has) => {
							assert.strictEqual(err, null);
							assert.strictEqual(has, false);
							done();
						});
					});
				});
			});
		});

	});
	describe('AMule 2 levels', () => {
		it('has', (done) => {
			const mule = new AMule(), aim1 = new Aim(), aim2 = new Aim();
			mule.use(aim1);
			mule.use(aim2);
			aim2.has('key', 'field', function (err, has) {
				assert.strictEqual(err, null);
				assert.strictEqual(has, false);
				mule.set('key', 'field', 'value', (err) => {
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
			const mule = new AMule(), aim1 = new Aim(), aim2 = new Aim();
			mule.use(aim1);
			mule.use(aim2);
			mule.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				aim2.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					done();
				});
			});
		});
		it('get', (done) => {
			const mule = new AMule(), aim1 = new Aim(), aim2 = new Aim();
			mule.use(aim1);
			mule.use(aim2);
			aim2.get('key', 'field', function (err, value) {
				assert.strictEqual(err, null);
				assert.strictEqual(value, null);
				aim2.set('key', 'field', 'value', (err) => {
					assert.strictEqual(err, null);
					let c = 2;

					function get_cb() {
						c--;
						if (!c) {
							done();
						}
					}

					mule.get('key', 'field', function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, 'value');
						get_cb();
					});
					mule.get('key', 'field', function (err, val) {
						assert.strictEqual(err, null);
						assert.strictEqual(val, 'value');
						get_cb();
					})
				});
			});
		});
		it('delete', (done) => {
			const mule = new AMule(), aim1 = new Aim(), aim2 = new Aim();
			mule.use(aim1);
			mule.use(aim2);
			mule.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				aim2.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mule.delete('key', 'field', function (err) {
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
			const mule = new AMule(), aim1 = new Aim(), aim2 = new Aim();
			mule.use(aim1);
			mule.use(aim2);
			mule.set('key', 'field', 'value', (err) => {
				assert.strictEqual(err, null);
				aim2.has('key', 'field', (err, has) => {
					assert.strictEqual(err, null);
					assert.strictEqual(has, true);
					mule.clear(true, function (err) {
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
