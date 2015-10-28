'use strict'

import Reflux from 'reflux'

export default () => {
  let Actions = Reflux.createActions({
    getPage: {},
    savePage: {},
    addPageAttachments: {},
    removePageAttachment: {},
    getMonthlyEvents: {},
    getMonthlyEvent: {},
    saveMonthlyEvent: {},
    newMonthlyEvent: {},
    removeMonthlyEvent: {},
    getCommentaries: {},
    newCommentary: {},
    removeCommentary: {},
    login: {},
    showError: {}
  })
  return Actions
}
