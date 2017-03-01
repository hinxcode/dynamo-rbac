import Base from './Base'

export const DELIMITER = '_'

export default class Permission extends Base {
  constructor (rbac, action, resource, add, cb) {
    if (typeof add === 'function') {
      cb = add
      add = true
    }

    if (!action || !resource) {
      return cb(new Error('One of parameters is undefined'))
    }

    if (!Permission.isValidName(action) || !Permission.isValidName(resource)) {
      return cb(new Error('Action or resource has no valid name'))
    }

    super(rbac, Permission.createName(action, resource), add, cb)
  }

  get action () {
    if (!this._action) {
      const decoded = Permission.decodeName(this.name)
      if (!decoded) {
        throw new Error('Action is null')
      }

      this._action = decoded.action
    }

    return this._action
  }

  get resource () {
    if (!this._resource) {
      const decoded = Permission.decodeName(this.name)
      if (!decoded) {
        throw new Error('Resource is null')
      }

      this._resource = decoded.resource
    }

    return this._resource
  }

  can (action, resource) {
    return this.action === action && this.resource === resource
  }

  static createName (action, resource) {
    return action + DELIMITER + resource
  }

  static decodeName (name) {
    const pos = name.indexOf(DELIMITER)
    if (pos === -1) {
      return null
    }

    return {
      action: name.substr(0, pos),
      resource: name.substr(pos + 1)
    }
  }

  static isValidName (name) {
    const exp = new RegExp(`^[^${DELIMITER}\\s]+$`)
    return exp.test(name)
  }
}
