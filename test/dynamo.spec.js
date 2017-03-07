import should from 'should'
import AWS from 'aws-sdk'

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

const dynamodb = new AWS.DynamoDB()

describe.skip('dynamoDB table', function () {
  const params = {
    TableName: 'Movies',
    KeySchema: [
      { AttributeName: 'year', KeyType: 'HASH' },  // Partition key
      { AttributeName: 'title', KeyType: 'RANGE' }  // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: 'year', AttributeType: 'N' },
      { AttributeName: 'title', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  }

  it('should not be found before we create it', function (done) {
    dynamodb.describeTable({TableName: params.TableName}, function (err, data) {
      should.exist(err)
      err.code.should.equal('ResourceNotFoundException')
      done()
    })
  })

  it('should be created without error', function (done) {
    dynamodb.createTable(params, function (err, data) {
      should.not.exist(err)
      done()
    })
  })
})
