import Base from './Base'
import Permission from './Permission'

export default class Role extends Base {
  constructor (rbac, name, add, cb) {
    if (typeof add === 'function') {
      cb = add
      add = true
    }

    if (!Permission.isValidName(name)) {
      return cb(new Error('Role has no valid name'))
    }

    super(rbac, name, add, cb)
  }

  grant (item, cb) {
    this.rbac.grant(this, item, cb)
    return this
  }

  revoke (item, cb) {
    this.rbac.revoke(this, item, cb)
    return this
  }

  can (action, resource, cb) {
    this.rbac.can(this.name, action, resource, cb)
    return this
  }

  canAny (permissions, cb) {
    this.rbac.canAny(this.name, permissions, cb)
    return this
  }

  canAll (permissions, cb) {
    this.rbac.canAll(this.name, permissions, cb)
    return this
  }

  hasRole (roleChildName, cb) {
    this.rbac.hasRole(this.name, roleChildName, cb)
    return this
  }

  getScope (cb) {
    this.rbac.getScope(this.name, cb)
    return this
  }
}
