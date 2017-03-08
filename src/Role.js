export const getRole = (db, tableName, userId, cb) => {
  var params = {
    TableName: tableName,
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
