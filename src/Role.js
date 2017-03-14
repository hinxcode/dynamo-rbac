import { getInstance } from './dynamo/db'
import { getTableName } from './dynamo/schema'

export const getRole = (roleId, cb) => {
  var params = {
    TableName: getTableName('role'),
    KeyConditionExpression: '#id = :roleId',
    ExpressionAttributeNames: {
      '#id': 'Id'
    },
    ExpressionAttributeValues: {
      ':roleId': { S: roleId }
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

export const addRole = (roleId, title, cb) => {
  var params = {
    TableName: getTableName('role'),
    Item: {
      'Id': {
        S: roleId
      },
      'Title': {
        S: title
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

export const updateRole = (roleId, newTitle, cb) => {
  var params = {
    TableName: getTableName('role'),
    UpdateExpression: 'SET #T = :t',
    ExpressionAttributeNames: {
      '#T': 'Title'
    },
    ExpressionAttributeValues: {
      ':t': { S: newTitle }
    },
    Key: {
      'Id': {
        S: roleId
      }
    },
    ReturnValues: 'ALL_NEW'
  }

  getInstance().updateItem(params, (err, data) => {
    if (err) {
      cb(err)
    } else {
      cb(null, data)
    }
  })
}
