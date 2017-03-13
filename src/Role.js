import { getInstance } from './dynamo/db'
import { getTableName } from './dynamo/schema'

export const updateRole = (userId, cb) => {
  var params = {
    TableName: getTableName('role'),
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
