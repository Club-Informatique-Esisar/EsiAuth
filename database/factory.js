'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/Promo', (faker, _, data) =>
{
	const year = data.year ?? faker.integer({ min: 2000, max: 2025 })
	const app = data.app ?? (faker.bool() ? "-APP" : "")
	const name = `P${year}${app}`

	return { name }
})

Factory.blueprint('App/Models/User', (faker) =>
{
	return {
		username: faker.username(),
		email: faker.email(),
		password: "test",
		first_name: faker.first(),
		last_name: faker.last(),
		is_extern: faker.bool(),
		is_admin: faker.bool()
	}
})
