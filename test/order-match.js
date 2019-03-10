const test = require('ava')
const OrderMatch = require('../src')

test('complex', t => {
  const o = new OrderMatch()

  t.is(o.price, 0, 'init')

  o.ask(100, 20)
  o.ask(50, 10)

  t.is(o.price, 0, 'after ask')

  o.once('trade', ({
    price,
    amount,
    type
  }) => {
    t.is(price, 50, 'trade price')
    t.is(amount, 5, 'trade amount')
    t.is(type, 'BID', 'trade type')
  })

  o.bid(51, 5)

  t.is(o.bids.length, 0, 'length, after first bid')
  t.deepEqual(o.asks[0], {
    price: 50,
    amount: 5
  }, 'o.asks, after first bid')
  t.is(o.price, 50, 'price, 1st')

  o.bid(40, 10)
  t.is(o.bids.length, 1, 'length, after second bid')

  t.deepEqual(o.asks[0], {
    price: 50,
    amount: 5
  }, 'o.asks, after first bid')

  o.bid(120, 40)

  t.is(o.asks.length, 0, 'asks.length, after 3rd bid')
  t.is(o.bids.length, 2, 'bids.length, 3rd')
  t.deepEqual(o.bids[0], {
    price: 120,
    amount: 15
  }, 'bids[0], 3rd')
  t.is(o.price, 100, 'price, 3rd')

  o.bid(120, 5)

  t.deepEqual(o.bids[0], {
    price: 120,
    amount: 20
  }, 'bids[0], 4th')

  let has

  o.on('trade', ({
    price,
    amount,
    type
  }) => {
    if (!has) {
      t.is(price, 120, 'trade price')
      t.is(amount, 20, 'trade amount')
      t.is(type, 'ASK', 'trade type')
      t.is(o.price, 120, 'price, 5rd')
      has = true
      return
    }

    t.is(price, 40, 'trade price')
    t.is(amount, 10, 'trade amount')
    t.is(type, 'ASK', 'trade type')
    t.is(o.price, 40, 'price, 5rd')
  })

  o.ask(0, 100)

  t.is(o.bids.length, 0, 'bids.length, 5th(ask)')
  t.deepEqual(o.asks[0], {
    price: 0,
    amount: 70
  }, 'asks[0], 5th(ask)')
})

test('resistance', t => {
  const o = new OrderMatch()

  t.is(o.resistance(100), undefined, 'no resistance')
  t.is(o.resistance(0), undefined, 'price not change')

  o.ask(100, 50)
  o.ask(120, 50)

  t.deepEqual(o.resistance(130), {
    action: 'BID',
    orders: [
      {price: 100, amount: 50},
      {price: 120, amount: 50}
    ]
  }, 'has resistance')
})
