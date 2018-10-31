'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TagsSchema extends Schema {
  up () {
    this.create('tags', (table) => {
      table.string('name').primary().notNullable()
    })
  }

  down () {
    this.drop('tags')
  }
}

module.exports = TagsSchema
