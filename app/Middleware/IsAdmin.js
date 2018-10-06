'use strict'

class IsAdmin {
  async handle ({ response, auth }, next) {
    if (!auth.user.is_admin) {
      response.status(403)
      return "FORBIDDEN"
    }
    await next()
  }
}

module.exports = IsAdmin
