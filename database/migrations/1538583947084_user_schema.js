'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.dropColumn('reset_token')
      table.dropColumn('reset_expire')
      table.boolean('is_admin').defaultTo(false).notNullable()
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('is_admin')
      table.string('reset_token')
      table.integer('reset_expire')
    })
  }
}

module.exports = UserSchema
