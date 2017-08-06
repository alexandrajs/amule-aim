# Aggregated, In-Memory cache for AlexandraJS aMule

[![Build Status](https://travis-ci.org/alexandrajs/amule-aim.svg?branch=master)](https://travis-ci.org/alexandrajs/amule-aim)
[![Coverage Status](https://coveralls.io/repos/github/alexandrajs/amule-aim/badge.svg?branch=master)](https://coveralls.io/github/alexandrajs/amule-aim?branch=master)
[![Code Climate](https://codeclimate.com/github/alexandrajs/amule-aim/badges/gpa.svg)](https://codeclimate.com/github/alexandrajs/amule-aim)

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
[AlexandraJS Aggregated In-Memory cache API](http://alexandrajs.github.io/amule-aim/)
