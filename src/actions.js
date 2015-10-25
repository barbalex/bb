'use strict'

import Reflux from 'reflux'

export default () => {
  let Actions = Reflux.createActions({
    getPage: {},
    savePage: {},
    getCommentaries: {},
    getMonthlyEvents: {},
    login: {},
    showError: {}
  })
  return Actions
}
