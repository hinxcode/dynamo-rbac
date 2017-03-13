/* global describe it */
import should from 'should'
const RBAC = require('../src')

describe.skip('dynamoDB', function () {
  it('should be connected without error.', function () {
    RBAC.connectDB()
    RBAC.setSchema({
      user: 'User',
      role: 'Role'
    })

    const db = require('../src/dynamo/db')
    should.exist(db.getInstance())
  })
})
