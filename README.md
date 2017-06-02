# Aggregated, In-Memory cache for AlexandraJS MLC

[![Build Status](https://travis-ci.org/alexandrajs/mlc-aim.svg?branch=master)](https://travis-ci.org/alexandrajs/mlc-aim)
[![Coverage Status](https://coveralls.io/repos/github/alexandrajs/mlc-aim/badge.svg?branch=master)](https://coveralls.io/github/alexandrajs/mlc-aim?branch=master)
[![Code Climate](https://codeclimate.com/github/alexandrajs/mlc-aim/badges/gpa.svg)](https://codeclimate.com/github/alexandrajs/mlc-aim)

## Installation
```bash
$ npm i alexandrajs-mlc-aim --save
```

## Usage
```javascript
const MLC = require('alexandrajs-mlc');
const AIM = require('alexandrajs-mlc-aim');
const mlc = new MLC();

// Add some compatible caches
mlc.use(new AIM());
mlc.use(new Redis());

// Use it as single cache
```

## API docs
[AlexandraJS Aggregated In-Memory cache API](http://alexandrajs.github.io/mlc-aim/)
