class Schema {
  constructor (args) {
    this.user = args.user
    this.role = args.role
  }
}

let schema

export const setSchema = (config = {}) => {
  schema = new Schema(config)
}

export const getTableName = key => schema[key]
