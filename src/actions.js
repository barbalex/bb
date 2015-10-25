'use strict'

import Reflux from 'reflux'

export default () => {
  let Actions = Reflux.createActions({
    getPage: {},
    savePage: {},
    getEvent: {},
    saveEvent: {},
    getCommentaries: {},
    getMonthlyEvents: {},
    login: {},
    showError: {}
  })
  return Actions
}
