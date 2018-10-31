'use strict'

const Tag = use('App/Models/Tag')

class DiscordController {
  async tagList({ view }) {
    const tags = await Tag.query().orderBy('name').fetch()
    return view.render('Admin/Discord/Tags', { tags: tags.toJSON() })
  }

  async tagAdd({ request, session, response }) {
    const { newTag } = request.all()
    const tag = new Tag()
    try {
      tag.name = newTag
      await tag.save()
    } catch(err) {
      session
        .withErrors([{ field: 'newTag', message: 'Nom invalide.' }])
        .flashExcept(['csrf_token'])
    }
    return response.redirect('/admin/discord/tags')
  }

  async tagDelete({ params, response }) {
    const tag = await Tag.find(params.tag)
    if(tag !== null) await tag.delete()
    return response.redirect('/admin/discord/tags')
  }
}

module.exports = DiscordController
