[![Build Status](https://travis-ci.org/kaelzhang/order-match.svg?branch=master)](https://travis-ci.org/kaelzhang/order-match)
[![Coverage](https://codecov.io/gh/kaelzhang/order-match/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/order-match)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/order-match?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/order-match)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/order-match.svg)](http://badge.fury.io/js/order-match)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/order-match.svg)](https://www.npmjs.org/package/order-match)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/order-match.svg)](https://david-dm.org/kaelzhang/order-match)
-->

# order-match

The account book to record the match of order asks and bids.

## Install

```sh
$ npm i order-match
```

## Usage

```js
const OrderMatch = require('order-match')

const om = new OrderMatch()
```

## new OrderMatch()

### om.ask(price, amount)

### om.bid(price, amount)

### om.trades(limit)

### om.simulate(price)

Returns `Object`

- **action** `Enum<ASK|BID>`
- **orders**

### Getter: om.price

Get the current price

### Getter: om.asks

Get all the asks

### Getter: om.bids

Get all the bids

### Event: 'trade'

## License

MIT
