import AWS from 'aws-sdk'
import { getTableName } from './schema'

let instance

const createTable = (tableKey, params, cb) => {
  getInstance().describeTable({TableName: getTableName(tableKey)}, (err, data) => {
    if (err) {
      if (err.code !== 'ResourceNotFoundException') cb(err)

      getInstance().createTable(params, function (err, data) {
        if (err) cb(err)
        else cb(null, data)
      })
    } else {
      getInstance().deleteTable({TableName: getTableName(tableKey)}, (err, data) => {
        if (err) {
          cb(err)
        } else {
          getInstance().createTable(params, function (err, data) {
            if (err) cb(err)
            else cb(null, data)
          })
        }
      })
    }
  })
}

export const connectDB = (config = {}) => {
  AWS.config.update({
    region: config.region || 'us-west-2',
    endpoint: config.endpoint || 'http://localhost:8000'
  })
  AWS.config.apiVersions = {
    dynamodb: config.apiVersion || '2012-08-10'
  }

  instance = new AWS.DynamoDB()
}

export const getInstance = () => {
  if (!instance) throw new Error('`connectDB()` function should be invoked before other functions invoking.')

  return instance
}

export const createUserTable = cb => {
  const params = {
    TableName: getTableName('user'),
    KeySchema: [
      { AttributeName: 'Id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'Id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  }

  return createTable('user', params, cb)
}

export const createRoleTable = cb => {
  const params = {
    TableName: getTableName('role'),
    KeySchema: [
      { AttributeName: 'Id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'Id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  }

  return createTable('role', params, cb)
}
