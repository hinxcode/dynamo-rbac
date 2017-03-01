import Permission from '../Permission'
import Role from '../Role'

export default class Storage {
  constructor () {
    this._rbac = null
  }

  get rbac () {
    return this._rbac
  }

  set rbac (rbac) {
    if (this._rbac) {
      throw new Error('RBAC is already setted')
    }

    this._rbac = rbac
  }

  add (item, cb) {
    cb(new Error('Storage method add is not implemented'))
  }

  remove (item, cb) {
    cb(new Error('Storage method remove is not implemented'))
  }

  grant (role, child, cb) {
    cb(new Error('Storage method grant is not implemented'))
  }

  revoke (role, child, cb) {
    cb(new Error('Storage method revoke is not implemented'))
  }

  get (name, cb) {
    cb(new Error('Storage method get is not implemented'))
  }

  getRoles (cb) {
    cb(new Error('Storage method getRoles is not implemented'))
  }

  getPermissions (cb) {
    cb(new Error('Storage method getPermissions is not implemented'))
  }

  getGrants (role, cb) {
    cb(new Error('Storage method getGrants is not implemented'))
  }

  getRole (name, cb) {
    this.get(name, (err, item) => {
      if (err || !item) {
        return cb(err, item)
      }

      if (item instanceof Role) {
        return cb(null, item)
      }

      cb(null, null)
    })

    return this
  }

  getPermission (action, resource, cb) {
    const name = Permission.createName(action, resource)

    this.get(name, (err, item) => {
      if (err || !item) {
        return cb(err, item)
      }

      if (item instanceof Permission) {
        return cb(null, item)
      }

      cb(null, null)
    })

    return this
  }

  exists (name, cb) {
    this.get(name, (err, item) => {
      if (err) {
        return cb(err)
      }

      if (!item) {
        return cb(null, false)
      }

      return cb(null, true)
    })

    return this
  }

  existsRole (name, cb) {
    this.getRole(name, (err, item) => {
      if (err) {
        return cb(err)
      }

      if (!item) {
        return cb(null, false)
      }

      return cb(null, true)
    })

    return this
  }

  existsPermission (action, resource, cb) {
    this.getPermission(action, resource, (err, item) => {
      if (err) {
        return cb(err)
      }

      if (!item) {
        return cb(null, false)
      }

      return cb(null, true)
    })

    return this
  }
}
