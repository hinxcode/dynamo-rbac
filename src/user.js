import { getSchema } from './dynamo/schema'

export const getRole = (db, userId, cb) => {
  var params = {
    TableName: getSchema('user'),
    KeyConditionExpression: '#id = :userid',
    ExpressionAttributeNames: {
      '#id': 'id'
    },
    ExpressionAttributeValues: {
      ':userid': { S: userId }
    }
  }

  db.query(params, (err, data) => {
    if (err) {
      cb(err)
    } else {
      cb(null, data.Items)
    }
  })
}
