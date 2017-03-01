import Storage from './index'
import Permission from '../Permission'
import Role from '../Role'
import keymirror from 'keymirror'

const Type = keymirror({
  PERMISSION: null,
  ROLE: null
})

function getType (item) {
  if (item instanceof Role) {
    return Type.ROLE
  } else if (item instanceof Permission) {
    return Type.PERMISSION
  }

  return null
}

function convertToInstance (rbac, record) {
  if (!record) {
    throw new Error('Record is undefined')
  }

  if (record.type === Type.ROLE) {
    return rbac.createRole(record.name, false, () => {})
  } else if (record.type === Type.PERMISSION) {
    const decoded = Permission.decodeName(record.name)
    if (!decoded) {
      throw new Error('Bad permission name')
    }

    return rbac.createPermission(decoded.action, decoded.resource, false, () => {})
  }

  throw new Error('Type is undefined')
}

export default class Dynamo extends Storage {
  constructor (options = {}) {
    super()

    options.modelName = options.modelName || 'rbac'

    this._options = options

    const params = {
      TableName: 'rbac',
      KeySchema: [
        { AttributeName: 'name', KeyType: 'HASH' },
        { AttributeName: 'type', KeyType: 'HASH' },
        { AttributeName: 'grants', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'name', AttributeType: 'S' },
        { AttributeName: 'type', AttributeType: 'S' },
        { AttributeName: 'grants', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      }
    }

    dynamodb.createTable(params, (err, data) => {
      if (err) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2))
      } else {
        console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2))
      }
    })
  }

  get model () {
    return this._model
  }

  get options () {
    return this._options
  }

  add (item, cb) {

  }

  remove (item, cb) {

  }

  grant (role, child, cb) {

  }

  revoke (role, child, cb) {

  }

  get (name, cb) {

  }

  getRoles (cb) {

  }

  getPermissions (cb) {

  }

  getGrants (role, cb) {

  }
}
