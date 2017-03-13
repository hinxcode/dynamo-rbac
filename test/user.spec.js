/* global describe it */
import should from 'should'
const RBAC = require('../src')

describe('dynamoDB ! ', function () {
  it('should be connected without error.', function () {
    RBAC.connectDB()
    RBAC.setSchema({
      user: 'Test1',
      role: 'Test2'
    })

    const db = require('../src/dynamo/db')
    should.exist(db.getInstance())
  })
})

describe('table User', function () {
  it('should be created without error.', function (done) {
    const db = require('../src/dynamo/db')

    db.createUserTable((err, result) => {
      if (err) console.log(err)
      should.not.exist(err)
      done()
    })
  })

  it('should be able to put a new item without error.', function (done) {
    RBAC.addUser('testId', '3', 'Robin Wang', (err, result) => {
      if (err) console.log(err)

      should.not.exist(err)
      done()
    })
  })
})
