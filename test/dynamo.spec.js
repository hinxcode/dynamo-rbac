import should from 'should'
import { connectDB } from '../src/dynamo'

describe.skip('table User', function () {
  let dynamodb
  const tableName = 'User'

  it('should connect to db without error', function () {
    dynamodb = connectDB('us-west-2', 'http://localhost:8000')
    should.exist(dynamodb)
  })

  it('should not be found before we create it', function (done) {
    dynamodb.describeTable({TableName: tableName}, function (err, data) {
      if (err) {
        should.exist(err)
        err.code.should.equal('ResourceNotFoundException')
        done()
      } else {
        dynamodb.deleteTable({TableName: tableName}, function (err, data) {
          should.not.exist(err)
          done()
        })
      }
    })
  })

  it('should be created without error', function (done) {
    const params = {
      TableName: tableName,
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'Role', KeyType: 'RANGE' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'Role', AttributeType: 'N' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      }
    }

    dynamodb.createTable(params, function (err, data) {
      should.not.exist(err)
      done()
    })
  })

  it('should put a new item without error', function (done) {
    const params = {
      TableName: tableName,
      Item: {
        'id': {
          S: 'id001'
        },
        'Role': {
          N: '1'
        },
        'AccountName': {
          S: 'Ben Y Huang'
        }
      },
      ReturnConsumedCapacity: 'TOTAL'
    }

    dynamodb.putItem(params, function (err, data) {
      should.not.exist(err)
      done()
    })
  })
})
