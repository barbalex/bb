'use strict'

import Reflux from 'reflux'

export default () => {
  let Actions = Reflux.createActions({
    getPage: {},
    requestSaveCkeditor: {},
    saveArticle: {}
  })
  return Actions
}
