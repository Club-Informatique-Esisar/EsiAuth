'use strict'
const User = use('App/Models/User')
const Token = use('App/Models/Token')
const Mail = use('Mail')

class ApiControllerV1 {
  async listUsers() {
    return await User
      .query()
      .orderBy('last_name')
      .orderBy('first_name')
      .fetch()
  }

  async getUser({ params }) {
    return await User
      .query()
      .where('username', params.name)
      .fetch()
  }

  async searchUser({ request }) {
    const query = request.all().query
    return await User
      .query()
      .where('first_name', 'like', `%${query}%`)
      .orWhere('last_name', 'like', `%${query}%`)
      .orderBy('promo')
      .orderBy('last_name')
      .orderBy('first_name')
      .fetch()
  }

  // Send a validation email to link a Discord account
  async sendDiscord({ request, response }) {
    const data = request.all()
    const user = await User
      .query()
      .where('email', data.mail)
      .with('tokens', (builder) => {
        builder.where('type', 'discord_link_token')
      })
      .first()

    if (user === null) {
      response.status(400)
      if (/.+\..+@etu\.esisar\.grenoble-inp\.fr/g.test(data.mail)) {
        return { error: "NO_ACCOUNT_ESISAR" }
      } else {
        return { error: "NO_ACCOUNT" }
      }
    }

    if(user.toJSON().tokens.length > 0) {
      response.status(400)
      return { error: "TOKEN_EXISTS" }
    }

    if(user.discord_id != null) {
      response.status(400)
      return { error: "ALREADY_LINKED" }
    }

    const token = require('uuid').v4().split('-')[0]
    user.tokens().create({ token: `${token}-${data.discord_id}`, type: 'discord_link_token' })

    await Mail.raw(`Votre code de validation : ${token}`, (message) => {
      message.from('no-reply@esisariens.org')
      message.to(data.mail)
      message.subject('Code de validation du Discord Esisariens')
    })
    return "SUCCESS"
  }

  // Link the Discord account if the provied token is the correct one
  async linkDiscord({ request, response }) {
    const data = request.all()
    const user = await User
      .query()
      .whereHas('tokens', (builder) => {
        builder.where('type', 'discord_link_token')
        builder.where('token', `${data.token}-${data.discord_id}`)
      })
      .first()
    
    if (user === null) {
      response.status(400)
      return { error: "NO_TOKEN" }
    }

    await user
      .tokens()
      .where('type', 'discord_link_token')
      .delete()

    user.discord_id = data.discord_id    
    await user.save()
    return user.toJSON().promo
  }
}

module.exports = ApiControllerV1
