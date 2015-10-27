'use strict'

import Reflux from 'reflux'

export default () => {
  let Actions = Reflux.createActions({
    getPage: {},
    savePage: {},
    addPageAttachments: {},
    removePageAttachment: {},
    getEvent: {},
    saveEvent: {},
    getCommentaries: {},
    newCommentary: {},
    getMonthlyEvents: {},
    login: {},
    showError: {}
  })
  return Actions
}
