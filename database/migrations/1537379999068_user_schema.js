'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('reset_token')
      table.integer('reset_expire')
      table.string('first_name').unique()
      table.string('last_name').unique()
      table.string('nick_name')
      table.boolean('is_extern').defaultTo(false).notNullable()
      table.string('discord_id')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('reset_token')
      table.dropColumn('reset_expire')
      table.dropColumn('first_name')
      table.dropColumn('last_name')
      table.dropColumn('nick_name')
      table.dropColumn('is_extern')
      table.dropColumn('discord_id')
    })
  }
}

module.exports = UserSchema
