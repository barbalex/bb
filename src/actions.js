'use strict'

import Reflux from 'reflux'

export default () => {
  let Actions = Reflux.createActions({
    getPage: {},
    savePage: {},
    addPageAttachments: {},
    removePageAttachment: {},
    getEvents: {},
    getEvent: {},
    saveEvent: {},
    newEvent: {},
    removeEvent: {},
    replaceEvent: {},
    getMonthlyEvents: {},
    getMonthlyEvent: {},
    saveMonthlyEvent: {},
    newMonthlyEvent: {},
    removeMonthlyEvent: {},
    toggleDraftOfMonthlyEvent: {},
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
    setPublicationCategory: {},
    removePublication: {},
    toggleDraftOfPublication: {},
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
