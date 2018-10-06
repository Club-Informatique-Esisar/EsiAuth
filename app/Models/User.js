'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  promo () {
    return this.belongsTo('App/Models/Promo')
  }

  static get hidden () {
    return ['password']
  }

  static generatePassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    if (length < 0)
      return ''

    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }
    return password
  }

  static async findUniqueLogin(firstName, lastName, original) {
    async function isTaken(login) {
      return await User.query().where('username', login).getCount() > 0
    }

    const shortFirst = firstName.split('-')[0].slice(0, 8)
    const shortLast = lastName.split('-')[0].slice(0, 8)
    let login = shortLast
    let tryCount = 0
    while(await isTaken(login)) {
      switch(tryCount) {
        case 0:
          login = shortLast + shortFirst[0]
          break
        case 1:
          login = shortFirst + shortLast[0]
          break
        case 2:
          login = shortFirst + '.' + shortLast
          break
        default:
          login = original.slice(0, original.indexOf('@'))
      }
      tryCount++
    }

    return login
  }

  static async createFromEtuMail(mail) {
    const namePart = mail.split('@')[0].replace(/\d+/g, '').replace(/--/g, '-')
    const names = namePart.replace(/^(\w)|-(\w)|\.(\w)/g, c => c.toUpperCase()).split('.')

    const user = new User()
    user.username = await User.findUniqueLogin(...namePart.split('.'), mail)
    user.email = mail
    user.password = User.generatePassword(8)
    user.first_name = names[0]
    user.last_name = names[1]
    return user
  }
}

module.exports = User
