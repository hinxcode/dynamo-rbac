import { getInstance } from './dynamo/db'
import { getTableName } from './dynamo/schema'

export const getUser = (userId, cb) => {
  var params = {
    TableName: getTableName('user'),
    KeyConditionExpression: '#id = :userid',
    ExpressionAttributeNames: {
      '#id': 'Id'
    },
    ExpressionAttributeValues: {
      ':userid': { S: userId }
    }
  }

  getInstance().query(params, (err, data) => {
    if (err) {
      cb(err)
    } else {
      cb(null, data.Items)
    }
  })
}

export const addUser = (userId, role, name, cb) => {
  var params = {
    TableName: getTableName('user'),
    Item: {
      'Id': {
        S: userId
      },
      'Role': {
        N: role
      },
      'AccountName': {
        S: name
      }
    },
    ReturnConsumedCapacity: 'TOTAL'
  }

  getInstance().putItem(params, (err, data) => {
    if (err) {
      cb(err)
    } else {
      cb(null, data)
    }
  })
}
