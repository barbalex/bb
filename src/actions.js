'use strict'

import Reflux from 'reflux'

export default () => {
  let Actions = Reflux.createActions({
    getDoc: {},
    requestSaveCkeditor: {},
    saveDoc: {}
  })
  return Actions
}
