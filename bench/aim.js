/**
 * @author Michał Żaloudik <ponury.kostek@gmail.com>
 */
"use strict";
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;
const Aim = require('../');
const aim = new Aim();
const a = new Aim({cache:false});
aim.set('hash', 'key', 'value', (err) => {
	suite.add('has', {
		defer: true,
		fn: function (deferred) {
			aim.has('hash', 'key', (err, has) => {
				deferred.resolve();
			});
		}
	}).add('get', {
		defer: true,
		fn: function (deferred) {
			aim.get('hash', 'key', (err, has) => {
				deferred.resolve();
			});
		}
	}).add('has (disabled cache)', {
		defer: true,
		fn: function (deferred) {
			a.has('hash', 'key', (err, has) => {
				deferred.resolve();
			});
		}
	}).add('get (disabled cache)', {
		defer: true,
		fn: function (deferred) {
			a.get('hash', 'key', (err, has) => {
				deferred.resolve();
			});
		}
	}).on('cycle', function (event) {
		console.log(String(event.target));
	}).on('complete', function () {
		//console.log('Fastest is ' + this.filter('fastest').map('name').join(', '));
	}).run({'async': true});
});
