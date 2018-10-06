'use strict'

const Schema = use('Schema')

class TokenSchema extends Schema {
  up () {
    this.table('tokens', (table) => {
      table.timestamp('expire_at')
    })
  }

  down () {
    this.table('tokens', (table) => {
      table.dropColumn('expire_at')
    })
  }
}

module.exports = TokenSchema
