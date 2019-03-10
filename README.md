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

Creates an acount book of asks and bids

### om.ask(price, amount)

- **price** `number`
- **amount** `number`

Ask a price

### om.bid(price, amount)

Bid with a price

### om.resistance(price): undefined | Object

Returns the plan against the resistance if we want to reach the `price` level.
- `undefined` which indicates there is no resistance.
- `Object`
  - **action** `Enum<ASK|BID>`
  - **orders** `Array<{price, amount}>`

```js
const om = new OrderMatch()

om.ask(100, 50)
om.ask(120, 10)

// Then the asks are:
// price: 120, amount: 10
// price: 100, amount: 50

const plan = om.resistance(130)
console.log(plan.action)
// BID, we need bid orders to buy the asks
console.log(plan.orders)
// [
//   {price: 100, amount: 50},
//   {price: 120, amount: 50}
// ]
```

### Getter: om.price `number`

Get the current price. The initial price is `0`.

### Getter: om.asks `Array<{price, amount}>`

Get current asks which is an ascending array of `{price, amount}` ordered by price

### Getter: om.bids `Array<{price, amount}>`

Get current bids which is an decendng array of `{price, amount}` ordered by price

### Event: 'trade'

- **e.price** `number` the actual price of the trade
- **e.amount** `number` the amount of the trade
- **e.type** `Enum<ASK|BID>`

```js
om.on('trade', e => {
  console.log()
})
```

## License

MIT
