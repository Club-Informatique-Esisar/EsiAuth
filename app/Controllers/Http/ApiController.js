'use strict'
const User = use('App/Models/User')

class ApiController {
  async listUsers() {
    return await User.all()
  }

  async getUser({ params }) {
    return await User
      .query()
      .where('username', '=', params.name)
      .fetch()
  }
}

module.exports = ApiController
