class Schema {
  constructor (args) {
    this.user = args.user || 'User'
    this.role = args.role || 'Role'
  }
}

let schema

export const setSchema = (config = {}) => {
  schema = new Schema(config)
}

export const getTableName = key => schema ? schema[key] : new Schema()
