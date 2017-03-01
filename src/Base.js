export default class Base {
  constructor (rbac, name, add, cb) {
    if (!rbac || !name || typeof cb !== 'function') {
      return cb(new Error('One of parameters is undefined'))
    }

    this._name = name
    this._rbac = rbac

    if (!add) {
      return cb(null, this)
    }

    rbac.add(this, err => cb(err, this))
  }

  get name () {
    return this._name
  }

  get rbac () {
    return this._rbac
  }

  remove (cb) {
    this.rbac.remove(this, cb)
    return this
  }
}
