# dynamo-rbac

## Local DB
Setting up a [dynamoDB-Local](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) for the purpose of developing with local database.

## Installation
```
$ npm install
```

## Usage
```
const RBAC = require('dynamo-rbac')

RBAC.connectDB({
    region: 'us-west-2',
    endpoint: 'http://localhost:8000',
    apiVersion: '2012-08-10'
})

RBAC.setSchema({
    user: 'UserTable',
    role: 'RoleTable'
})
```

## Build with gulp
```
$ npm run build
```

## Unit testing
```
$ npm test
```


## License
MIT