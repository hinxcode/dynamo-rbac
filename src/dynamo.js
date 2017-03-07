import AWS from 'aws-sdk'

export const connectDB = (region = 'us-west-2', endpoint = 'http://localhost:8000') => {
  AWS.config.update({
    region: region,
    endpoint: endpoint
  })

  return new AWS.DynamoDB()
}
