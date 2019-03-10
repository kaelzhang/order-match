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

    this._price = 0
  }

  _makeDeal (orderAmount, orderBook, maxIndex, type) {
    let i = 0
    let dealPrice
    let left = orderAmount

    const tearDown = () => {
      orderBook.splice(0, i)
      this._price = dealPrice
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
        this.emit('trade', {
          price: orderPrice,
          amount: left,
          type
        })
        left = 0
        dealPrice = orderPrice
        return tearDown()
      }

      left -= amount
      i ++
      dealPrice = orderPrice
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
      } = this._makeDeal(amount, this[receiveKey], min, sendType.toUpperCase())

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
