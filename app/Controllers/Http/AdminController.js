'use strict'
const User = use('App/Models/User')
const Promo = use('App/Models/Promo')
const Mail = use('Mail')

class AdminController {
  async home({ view }) {
    return view.render('Admin/Home')
  }

  async users({ view }) {
    const users = await User.query().orderBy('last_name').orderBy('first_name').fetch()
    return view.render('Admin/Users/List', { users: users.toJSON() })
  }

  async usersImport({ request,  view }) {
    const promos = await Promo.query().orderBy('name').fetch()
    if (request.method() === 'GET') {
      return view.render('Admin/Users/Import', { promos: promos.toJSON() })
    }

    let errors = {}
    let success = {}
    const data = request.all()
    for (let mail of data.mails.toLowerCase().split('\n')) {
      mail = mail.trim()
      if (!/^.+\..+@etu\.esisar\.grenoble-inp\.fr$/g.test(mail)) {
        errors[mail] = "Format Invalide"
        continue
      }

      let user = await User.createFromEtuMail(mail)
      user.promo = data.promo
      try {
        await user.save()
        success[mail] = `${user.first_name} ${user.last_name} (${user.username})`
      } catch(err) {
        if (err.code === 'ER_DUP_ENTRY') {
          errors[mail] = "Mail déjà existant"
        } else {
          errors[mail] = "Erreur d'insertion"
        }
      }
    }
    
    return view.render('Admin/Users/Import', {
      promos: promos.toJSON(),
      errors: errors,
      success: success
    })
  }
}

module.exports = AdminController
