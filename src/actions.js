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
    getCommentary: {},
    saveCommentary: {},
    newCommentary: {},
    removeCommentary: {},
    toggleDraftOfCommentary: {},
    getPublications: {},
    getPublication: {},
    savePublication: {},
    newPublication: {},
    toggleDraftOfPublication: {},
    removePublication: {},
    getSources: {},
    getSource: {},
    saveSource: {},
    newSource: {},
    removeSource: {},
    toggleDraftOfSource: {},
    getActors: {},
    getActor: {},
    saveActor: {},
    newActor: {},
    removeActor: {},
    toggleDraftOfActor: {},
    login: {},
    logout: {},
    showError: {}
  })
  return Actions
}
