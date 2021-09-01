'use strict'

/*
|--------------------------------------------------------------------------
| PromoSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class PromoSeeder
{
	async run()
	{
		for (let i = 0; i < 10; i++)
		{
			try
			{
				await Factory.model('App/Models/Promo').create()
			}
			catch (e)
			{
				i--
			}
		}
	}
}

module.exports = PromoSeeder
