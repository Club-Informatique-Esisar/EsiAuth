'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {import('@adonisjs/framework/src/Route/Manager'} */
const Route = use('Route')

Route.get('/', 'HomeController.home')

Route.post('sign-in', 'UserController.signIn')
Route.post('login', 'UserController.login')
Route.get('logout', 'UserController.logout').middleware('auth')
Route.get('profile', 'UserController.profile').middleware('auth')

Route.group(() => {
  Route.get('/', 'AdminController.home')
  Route.get('users', 'AdminController.users')
})
.prefix('admin')
.middleware(['auth', 'isAdmin'])