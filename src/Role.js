export const getRole = (userId, cb) => {
  var params = {
    TableName: 'Movies',
    KeyConditionExpression: '#yr = :yyyy',
    ExpressionAttributeNames: {
      '#yr': 'year'
    },
    ExpressionAttributeValues: {
      ':yyyy': {
        N: '2003'
      }
    }
  }

  dynamoDB.query(params, (err, data) => {
    if (err) {
      cb(err)
    } else {
      cb(null, data.Items)
    }
  })
}
