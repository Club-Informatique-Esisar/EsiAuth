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

// Variables
const apiPrefix = "api"

// Website - No Auth
Route.get('/', 'HomeController.home')
Route.post('sign-in', 'UserController.signIn')
Route.post('login', 'UserController.login')

// Website - Auth
Route.group(() => {
  Route.get('logout', 'UserController.logout')
  Route.get('profile', 'UserController.profile')
  Route.get('token', 'UserController.listToken')
  Route.get('token/new', 'UserController.createToken')
})
.middleware('auth')

// Website - Admin
Route.group(() => {
  Route.get('/', 'AdminController.home')
  Route.get('users', 'AdminController.users')
})
.prefix('admin')
.middleware(['auth', 'isAdmin'])

// API - No Auth
Route.group(() => {

})
.prefix(apiPrefix)

// API - Auth
Route.group(() => {
  Route.get('user', 'ApiController.listUsers')
  Route.get('user/:name', 'ApiController.getUser')
})
.prefix(apiPrefix)
.middleware('auth:api')