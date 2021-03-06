/* global describe it */
import should from 'should'
const RBAC = require('../src')

describe('Table User', function () {
  it('should be created without error.', function (done) {
    const db = require('../src/dynamo/db')

    db.createUserTable((err, result) => {
      if (err) console.log(err)
      should.not.exist(err)
      done()
    })
  })

  it('should be able to put a new item without error.', function (done) {
    RBAC.addUser('id007', '5', 'Ben Y Huang', (err, result) => {
      if (err) console.log(err)
      should.not.exist(err)
      done()
    })
  })

  it('should be able to get an existing item without error.', function (done) {
    RBAC.getUser('id007', (err, result) => {
      if (err) console.log(err)
      should.not.exist(err)
      done()
    })
  })

  it('should be able to update an existing item without error.', function (done) {
    const values = {
      AccountName: {
        S: 'Yin Huang'
      },
      RoleId: {
        S: '2'
      }
    }

    RBAC.updateUser('id007', values, (err, result) => {
      if (err) console.log(err)
      should.not.exist(err)
      done()
    })
  })
})
