'use strict'
const User = use('App/Models/User')

class UserController {
  async login ({ request, response, auth, session, view }) {
    const { email, password } = request.all()
    try {
      await auth.attempt(email, password)
    } catch(err) {
      console.log(err)
      return view.render('NotLoggedIn', { error: `Erreur dans le nom d'utilisateur ou le mot de passe` })
    }

    return response.redirect('/')
  }

  async signIn ({ request, response, auth, view, session }) {
    const { username, email, password, password2 } = request.all()
    if (password !== password2) {
      session
        .withErrors([{ field: 'password2', message: 'Doit-être égal au premier!' }])
        .flashExcept(['password', 'password2', 'csrf_token'])
    }

    const user = new User()
    try {
      user.username = username
      user.email = email
      user.password = password
      await user.save()
    } catch(err) {
      return view.render('NotLoggedIn', { error: `Érreur lors de la création de l'utilisateur` })
    }

    await auth.login(user)
    return response.redirect('/')
  }

  async profile({ auth }) {
    return auth.user
  }

  async logout({ response, auth }) {
    await auth.logout()
    return response.redirect('/')
  }

  async listToken({ auth }) {
    return await auth.authenticator('api').listTokensForUser(auth.current.user)
  }

  async createToken({ auth }) {
    return await auth.authenticator('api').generate(auth.current.user)
  }
}

module.exports = UserController
