'use strict'

const Model = use('Model')

class Tag extends Model {
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

module.exports = Tag
