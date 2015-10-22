'use strict'

import Reflux from 'reflux'

export default () => {
  let Actions = Reflux.createActions({
    getDoc: {},
    saveDoc: {},
    loadPath: {}
  })
  return Actions
}
