const EE = require('events')
const SequencedArray = require('sequenced-array')

const compareOrder = (a, b) => a.price - b.price
const toUpperCase = s => s.toUpperCase()

module.exports = class OrderMatch extends EE {
  constructor () {
    super()

    // from low -> high
    this._asks = new SequencedArray([], {
      compare: compareOrder
    })

    // from high -> low
    this._bids = new SequencedArray([], {
      desc: true,
      compare: compareOrder
    })

    this._price = 0
  }

  _makeDeal (orderAmount, orderBook, maxIndex, type) {
    let i = 0
    let left = orderAmount

    const tearDown = () => {
      orderBook.splice(0, i)
      return {
        left
      }
    }

    while (i <= maxIndex) {
      const {
        amount,
        price: orderPrice
      } = orderBook[i]
      if (amount > left) {
        orderBook[i].amount -= left
        this._price = orderPrice
        this.emit('trade', {
          price: orderPrice,
          amount: left,
          type
        })
        left = 0
        return tearDown()
      }

      left -= amount
      i ++
      this._price = orderPrice
      this.emit('trade', {
        price: orderPrice,
        amount,
        type
      })
    }

    return tearDown()
  }

  _order (price, amount, sendType, receiveType) {
    const receiveKey = `_${receiveType}s`
    const sendKey = `_${sendType}s`
    const order = {
      price,
      amount
    }

    const [min] = this[receiveKey].find(order)
    let leftAmount = amount

    if (min !== - 1) {
      const {
        left
      } = this._makeDeal(amount, this[receiveKey], min, toUpperCase(sendType))

      if (left === 0) {
        return
      }

      leftAmount = left
    }

    const {
      index,
      inserted
    } = this[sendKey].insert({
      price,
      amount: leftAmount
    })

    // The price exists
    if (inserted === false) {
      this[sendKey][index].amount += leftAmount
    }
  }

  resistance (price) {
    if (this._price === price) {
      return
    }

    const up = price > this._price
    const action = up
      ? 'BID'
      : 'ASK'

    const depth = this[`_${
      up
        ? 'ask'
        : 'bid'
    }s`]
    const [min, max] = depth.find({price})
    if (min === -1) {
      return
    }

    const orders = [].concat(depth.slice(0, max))
    return {
      action: toUpperCase(action),
      orders
    }
  }

  ask (price, amount) {
    this._order(price, amount, 'ask', 'bid')
  }

  bid (price, amount) {
    this._order(price, amount, 'bid', 'ask')
  }

  get asks () {
    return [].concat(this._asks)
  }

  get bids () {
    return [].concat(this._bids)
  }

  get price () {
    return this._price
  }
}
