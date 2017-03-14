/* global describe it */
import should from 'should'
const RBAC = require('../src')

describe('Table Role', function () {
  it('should be created without error.', function (done) {
    const db = require('../src/dynamo/db')

    db.createRoleTable((err, result) => {
      if (err) console.log(err)
      should.not.exist(err)
      done()
    })
  })

  it('should be able to put a new item without error.', function (done) {
    RBAC.addRole('5', 'admin', (err, result) => {
      if (err) console.log(err)
      should.not.exist(err)
      done()
    })
  })

  it('should be able to get an existing item without error.', function (done) {
    RBAC.getRole('5', (err, result) => {
      if (err) console.log(err)
      should.not.exist(err)
      done()
    })
  })

  it('should be able to update an existing item without error.', function (done) {
    RBAC.updateRole('5', 'superuser', (err, result) => {
      if (err) console.log(err)
      should.not.exist(err)
      done()
    })
  })
})
