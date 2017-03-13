import { getInstance } from './dynamo/db'
import { getTableName } from './dynamo/schema'

export const getUser = (userId, cb) => {
  var params = {
    TableName: getTableName('user'),
    KeyConditionExpression: '#id = :userid',
    ExpressionAttributeNames: {
      '#id': 'id'
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

export const addUser = (userId, cb) => {
  var params = {
    TableName: getTableName('user'),
    KeyConditionExpression: '#id = :userid',
    ExpressionAttributeNames: {
      '#id': 'id'
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
