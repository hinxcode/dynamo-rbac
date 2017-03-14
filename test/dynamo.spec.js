/* global describe it */
import should from 'should'
const RBAC = require('../src')

describe('DynamoDB', function () {
  it('should be connected without error.', function () {
    RBAC.connectDB({
      region: 'us-west-2',
      endpoint: 'http://localhost:8000',
      apiVersion: '2012-08-10'
    })

    RBAC.setSchema({
      user: 'Users',
      role: 'Roles'
    })

    const db = require('../src/dynamo/db')
    should.exist(db.getInstance())
  })
})
