'use strict'

import Reflux from 'reflux'

export default () => {
  let Actions = Reflux.createActions({
    getActivePage: {},
    saveActivePage: {},
    addActivePageAttachments: {},
    removeActivePageAttachment: {},
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
    getSourceCategories: {},
    getSourceCategory: {},
    saveSourceCategory: {},
    newSourceCategory: {},
    removeSourceCategory: {},
    toggleDraftOfSourceCategory: {},
    getActorCategories: {},
    getActorCategory: {},
    saveActorCategory: {},
    newActorCategory: {},
    removeActorCategory: {},
    toggleDraftOfActorCategory: {},
    login: {},
    logout: {},
    showError: {}
  })
  return Actions
}
