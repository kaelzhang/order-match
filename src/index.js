const EE = require('events')
const SequencedArray = require('sequenced-array')

const compareOrder = (a, b) => a.price - b.price

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

    this._trades = []
    this._price = 0
  }

  simulate (price) {

  }

  _makeDeal ({
    price,
    amount: orderAmount
  }, orderBook, max, type) {
    let i = 0

    const tearDown = () => {
      orderBook.splice(0, i)
      return {
        left: orderAmount
      }
    }

    while (i <= max) {
      const {amount} = orderBook[i]
      if (amount > orderAmount) {
        orderBook[i].amount -= orderAmount
        orderAmount = 0
        this.emit('trade', {
          price,
          amount: orderAmount,
          type
        })
        return tearDown()
      }

      orderAmount -= amount
      i ++
      this.emit('trade', {
        price,
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

    const {
      left
    } = this._makeDeal(order, this[receiveKey], min, sendType)
    this[sendKey].insert({
      price,
      amount: left
    })
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

  trades (limit) {

  }
}
