'use strict'

const Model = use('Model')

class Promo extends Model {
  static get primaryKey () {
    return 'name'
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }
}

module.exports = Promo
