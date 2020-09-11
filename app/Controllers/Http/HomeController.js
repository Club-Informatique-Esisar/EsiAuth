'use strict'

class HomeController {
  async home({ auth, view }) {
    try {
      await auth.check()
      return view.render('Home')
    } catch (error) {
      return view.render('Guests/LoginOrRegister')
    }
  }
}

module.exports = HomeController
