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
Route.route('forgotPassword', 'UserController.forgotPassword', ['GET', 'POST'])
Route.route('resetPassword', 'UserController.resetPassword', ['GET', 'POST'])

Route.get('test/password', 'TestController.password')

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
  Route.route('users/import', 'AdminController.usersImport', ['GET', 'POST'])

  Route.get('discord/tags', 'DiscordController.tagList')
  Route.post('discord/tags', 'DiscordController.tagAdd')
  Route.get('discord/tags/delete/:tag', 'DiscordController.tagDelete')
})
.prefix('admin')
.middleware(['auth', 'isAdmin'])

// API - No Auth
Route.group(() => {

})
.prefix(apiPrefix)

// API - Auth
Route.group(() => {
  Route.get('user', 'ApiControllerV1.listUsers')
  Route.get('user/:name', 'ApiControllerV1.getUser')
  Route.post('user/search', 'ApiControllerV1.searchUser')

  Route.get('discord/tags', 'ApiControllerV1.listTags')
})
.prefix(apiPrefix)
.middleware('auth:api')

// API - Admin
Route.group(() => {
  Route.post('user/discord/send', 'ApiControllerV1.sendDiscord')
  Route.post('user/discord/link', 'ApiControllerV1.linkDiscord')
})
.prefix(apiPrefix)
.middleware(['auth:api', 'isAdmin'])