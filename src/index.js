import * as Role from './role'

let schema

class Schema {
  constructor (args) {
    this.user = args.user
  }
}

export const setSchema = (config = {}) => {
  schema = new Schema(config)
}

export const getRole = (db, userId, cb) => {
  Role.getRole(db, schema.user, userId, cb)
}

export { connectDB } from './dynamo'
