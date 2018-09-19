'use strict'

const Schema = use('Schema')

class PromoSchema extends Schema {
  up () {
    this.create('promos', (table) => {
      table.string('name').primary().notNullable()
    })

    this.table('users', (table) => {
      table.string('promo').references('promos.name')
    })
  }

  down () {
    this.drop('promos')

    this.table('users', (table) => {
      table.dropColumn('promo')
    })
  }
}

module.exports = PromoSchema
