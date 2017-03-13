import AWS from 'aws-sdk'

let instance

export const connectDB = config => {
  AWS.config.update({
    region: config.region || 'us-west-2',
    endpoint: config.endpoint || 'http://localhost:8000'
  })
  AWS.config.apiVersions = {
    dynamodb: config.apiVersion || '2012-08-10'
  }

  instance = new AWS.DynamoDB()
}

export const getInstance = () => instance
