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

export const addUser = (userId, roleId, name, cb) => {
  var params = {
    TableName: getTableName('user'),
    Item: {
      'Id': {
        S: userId
      },
      'RoleId': {
        S: roleId
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

export const updateUser = (userId, values, cb) => {
  const keys = Object.keys(values)

  let exp = 'SET '
  keys.forEach((e, i) => { exp += `#V${i} = :v${i}, ` })

  const expNames = keys.map((obj, i) => ({[`#V${i}`]: obj})).reduce((acc, obj) => Object.assign(acc, obj))
  const expValues = keys.map((obj, i) => ({[`:v${i}`]: ({S: values[obj]['S']})})).reduce((acc, obj) => Object.assign(acc, obj))

  var params = {
    TableName: getTableName('user'),
    UpdateExpression: exp.replace(new RegExp(/, $/), ''),
    ExpressionAttributeNames: expNames,
    ExpressionAttributeValues: expValues,
    Key: {
      'Id': { S: userId }
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
