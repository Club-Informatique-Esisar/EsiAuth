'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.dropUnique('first_name')
      table.dropUnique('last_name')
    })
  }

  down () {
    this.table('users', (table) => {
      table.unique('first_name')
      table.unique('last_name')
    })
  }
}

module.exports = UserSchema
