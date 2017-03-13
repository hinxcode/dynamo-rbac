import AWS from 'aws-sdk'

export const connectDB = (region = 'us-west-2', endpoint = 'http://localhost:8000') => {
  AWS.config.update({
    region: region,
    endpoint: endpoint
  })

  AWS.config.apiVersions = {
    dynamodb: '2012-08-10'
  }

  return new AWS.DynamoDB()
}
