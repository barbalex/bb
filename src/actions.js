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
    toggleDraftOfMonthlyEvent: {},
    removeMonthlyEvent: {},
    getCommentaries: {},
    newCommentary: {},
    removeCommentary: {},
    toggleDraftOfCommentary: {},
    login: {},
    logout: {},
    showError: {}
  })
  return Actions
}
