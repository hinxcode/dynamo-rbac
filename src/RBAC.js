import isPlainObject from 'lodash/isPlainObject'
import { parallel } from 'async'
import Role from './Role'
import Permission from './Permission'

export default class RBAC {
  constructor (options = {}, callback = () => {}) {
    options.storage = options.storage

    this._options = options

    this.storage.rbac = this

    const permissions = options.permissions || {}
    const roles = options.roles || []
    const grants = options.grants || {}

    this.create(roles, permissions, grants, (err) => {
      if (err) {
        return callback(err)
      }

      return callback(null, this)
    })
  }

  get options () {
    return this._options
  }

  get storage () {
    return this.options.storage
  }

  add (item, cb) {
    if (!item) {
      return cb(new Error('Item is undefined'))
    }

    if (item.rbac !== this) {
      return cb(new Error('Item is associated to another RBAC instance'))
    }

    this.storage.add(item, cb)
    return this
  }

  get (name, cb) {
    this.storage.get(name, cb)
    return this
  }

  remove (item, cb) {
    if (!item) {
      return cb(new Error('Item is undefined'))
    }

    if (item.rbac !== this) {
      return cb(new Error('Item is associated to another RBAC instance'))
    }

    this.storage.remove(item, cb)
    return this
  }

  removeByName (name, cb) {
    this.get(name, (err, item) => {
      if (err) {
        return cb(err)
      }

      if (!item) {
        return cb(null, false)
      }

      item.remove(cb)
    })

    return this
  }

  grant (role, child, cb) {
    if (!role || !child) {
      return cb(new Error('One of item is undefined'))
    }

    if (role.rbac !== this || child.rbac !== this) {
      return cb(new Error('Item is associated to another RBAC instance'))
    }

    if (!RBAC.isRole(role)) {
      return cb(new Error('Role is not instance of Role'))
    }

    this.storage.grant(role, child, cb)
    return this
  }

  revoke (role, child, cb) {
    if (!role || !child) {
      return cb(new Error('One of item is undefined'))
    }

    if (role.rbac !== this || child.rbac !== this) {
      return cb(new Error('Item is associated to another RBAC instance'))
    }

    this.storage.revoke(role, child, cb)
    return this
  }

  revokeByName (roleName, childName, cb) {
    parallel({
      role: callback => this.get(roleName, callback),
      child: callback => this.get(childName, callback)
    }, (err, results) => {
      if (err) {
        return cb(err)
      }

      this.revoke(results.role, results.child, cb)
    })

    return this
  }

  grantByName (roleName, childName, cb) {
    parallel({
      role: callback => this.get(roleName, callback),
      child: callback => this.get(childName, callback)
    }, (err, results) => {
      if (err) {
        return cb(err)
      }

      this.grant(results.role, results.child, cb)
    })

    return this
  }

  createRole (roleName, add, cb) {
    return new Role(this, roleName, add, cb)
  }

  createPermission (action, resource, add, cb) {
    return new Permission(this, action, resource, add, cb)
  }

  exists (name, cb) {
    this.storage.exists(name, cb)
    return this
  }

  existsRole (name, cb) {
    this.storage.existsRole(name, cb)
    return this
  }

  existsPermission (action, resource, cb) {
    this.storage.existsPermission(action, resource, cb)
    return this
  }

  getRole (name, cb) {
    this.storage.getRole(name, cb)
    return this
  }

  getRoles (cb) {
    this.storage.getRoles(cb)
    return this
  }

  getPermission (action, resource, cb) {
    this.storage.getPermission(action, resource, cb)
    return this
  }

  getPermissionByName (name, cb) {
    const data = Permission.decodeName(name)
    this.storage.getPermission(data.action, data.resource, cb)
    return this
  }

  getPermissions (cb) {
    this.storage.getPermissions(cb)
    return this
  }

  createPermissions (resources, add, cb) {
    if (typeof add === 'function') {
      return this.createPermissions(resources, true, add)
    }

    const tasks = {}

    if (!isPlainObject(resources)) {
      return cb(new Error('Resources is not a plain object'))
    }

    Object.keys(resources).forEach((resource) => {
      resources[resource].forEach((action) => {
        const name = Permission.createName(action, resource)
        tasks[name] = callback => this.createPermission(action, resource, add, callback)
      }, this)
    }, this)

    parallel(tasks, cb)
    return this
  }

  createRoles (roleNames, add, cb) {
    if (typeof add === 'function') {
      return this.createRoles(roleNames, true, add)
    }

    const tasks = {}

    roleNames.forEach((roleName) => {
      tasks[roleName] = callback => this.createRole(roleName, add, callback)
    }, this)

    parallel(tasks, cb)
    return this
  }

  grants (roles, cb) {
    if (!isPlainObject(roles)) {
      return cb(new Error('Grants is not a plain object'))
    }

    const tasks = []

    Object.keys(roles).forEach((role) => {
      roles[role].forEach((grant) => {
        tasks.push(callback => this.grantByName(role, grant, callback))
      }, this)
    }, this)

    parallel(tasks, cb)
    return this
  }

  create (roleNames, permissionNames, grants, cb) {
    if (typeof grants === 'function') {
      return this.create(roleNames, permissionNames, null, grants)
    }

    const tasks = {
      permissions: callback => this.createPermissions(permissionNames, callback),
      roles: callback => this.createRoles(roleNames, callback)
    }

    parallel(tasks, (err, result) => {
      if (err || !grants) {
        return cb(err, result)
      }

      // add grants to roles
      this.grants(grants, (err2) => {
        if (err2) {
          return cb(err2)
        }

        cb(null, result)
      })
    })

    return this
  }

  _traverseGrants (roleName, cb, next = [roleName], used = {}) {
    const actualRole = next.shift()
    used[actualRole] = true

    this.storage.getGrants(actualRole, (err, items = []) => {
      if (err) {
        return cb(err)
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const name = item.name

        if (RBAC.isRole(item) && !used[name]) {
          used[name] = true
          next.push(name)
        }

        if (cb(null, item) === false) {
          return void 0
        }
      }

      if (next.length === 0) {
        return cb(null, null)
      }

      this._traverseGrants(null, cb, next, used)
    })

    return this
  }

  can (roleName, action, resource, cb) {
    this._traverseGrants(roleName, (err, item) => {
      // if there is a error
      if (err) {
        return cb(err)
      }

      // this is last item
      if (!item) {
        return cb(null, false)
      }

      if (RBAC.isPermission(item) && item.can(action, resource) === true) {
        cb(null, true)
        // end up actual traversing
        return false
      }
    })

    return this
  }

  canAny (roleName, permissions, cb) {
    // prepare the names of permissions
    const permissionNames = RBAC.getPermissionNames(permissions)

    // traverse hierarchy
    this._traverseGrants(roleName, (err, item) => {
      // if there is a error
      if (err) {
        return cb(err)
      }

      // this is last item
      if (!item) {
        return cb(null, false)
      }

      if (RBAC.isPermission(item) && permissionNames.indexOf(item.name) !== -1) {
        cb(null, true)
        // end up actual traversing
        return false
      }
    })

    return this
  }

  canAll (roleName, permissions, cb) {
    // prepare the names of permissions
    const permissionNames = RBAC.getPermissionNames(permissions)
    const founded = {}
    let foundedCount = 0

    // traverse hierarchy
    this._traverseGrants(roleName, (err, item) => {
      // if there is a error
      if (err) {
        return cb(err)
      }

      // this is last item
      if (!item) {
        return cb(null, false)
      }

      if (RBAC.isPermission(item) && permissionNames.indexOf(item.name) !== -1 && !founded[item.name]) {
        founded[item.name] = true
        foundedCount++

        if (foundedCount === permissionNames.length) {
          cb(null, true)
          // end up actual traversing
          return false
        }
      }
    })

    return this
  }

  hasRole (roleName, roleChildName, cb) {
    if (roleName === roleChildName) {
      cb(null, true)
      return this
    }

    this._traverseGrants(roleName, (err, item) => {
      // if there is a error
      if (err) {
        return cb(err)
      }

      // this is last item
      if (!item) {
        return cb(null, false)
      }

      if (RBAC.isRole(item) && item.name === roleChildName) {
        cb(null, true)
        // end up actual traversing
        return false
      }
    })

    return this
  }

  getScope (roleName, cb) {
    const scope = []

    // traverse hierarchy
    this._traverseGrants(roleName, (err, item) => {
      // if there is a error
      if (err) {
        return cb(err)
      }

      // this is last item
      if (!item) {
        return cb(null, scope)
      }

      if (RBAC.isPermission(item) && scope.indexOf(item.name) === -1) {
        scope.push(item.name)
      }
    })

    return this
  }

  static getPermissionNames (permissions) {
    const permissionNames = []

    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i]
      permissionNames.push(Permission.createName(permission[0], permission[1]))
    }

    return permissionNames
  }

  static isPermission (item) {
    return item instanceof Permission
  }

  static isRole (item) {
    return item instanceof Role
  }
}
