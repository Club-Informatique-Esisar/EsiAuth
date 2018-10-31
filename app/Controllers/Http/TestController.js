'use strict'

const Hash = use('Hash')

class TestController {
  async password({ request }) {
    return await Hash.make(request.all().p)
  }
}

module.exports = TestController
