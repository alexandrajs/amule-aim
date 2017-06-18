# Aggregated, In-Memory cache for AlexandraJS aMule

[![Build Status](https://travis-ci.org/alexandrajs/aMule-Aim.svg?branch=master)](https://travis-ci.org/alexandrajs/aMule-Aim)
[![Coverage Status](https://coveralls.io/repos/github/alexandrajs/aMule-Aim/badge.svg?branch=master)](https://coveralls.io/github/alexandrajs/aMule-Aim?branch=master)
[![Code Climate](https://codeclimate.com/github/alexandrajs/aMule-Aim/badges/gpa.svg)](https://codeclimate.com/github/alexandrajs/aMule-Aim)

## Installation
```bash
$ npm i amule-aim --save
```

## Usage
```javascript
const AMule = require('amule');
const Aim = require('amule-aim');
const mule = new AMule();

// Add some compatible caches
mule.use(new Aim());
mule.use(new Rush());

// Use it as single cache
```

## API docs
[AlexandraJS Aggregated In-Memory cache API](http://alexandrajs.github.io/aMule-Aim/)
