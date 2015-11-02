'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import moment from 'moment'
import { Base64 } from 'js-base64'
import slug from 'slug'
import getPathFromDoc from './modules/getPathFromDoc.js'
import getCommentaries from './modules/getCommentaries.js'
import getSourceCategories from './modules/getSourceCategories.js'
import getActorCategories from './modules/getActorCategories.js'
import getMonthlyEvents from './modules/getMonthlyEvents.js'
import getPublications from './modules/getPublications.js'
import monthlyEventTemplate from 'html!./components/monthlyEvents/monthlyEventTemplate.html'
import publicationTemplate from 'html!./components/publications/publicationTemplate.html'
import _ from 'lodash'

export default (Actions) => {
  app.pageStore = Reflux.createStore({

    listenables: Actions,

    doc: null,

    onGetPage (id) {
      const get = !this.doc || (this.doc._id && this.doc._id !== id)
      if (get) {
        app.db.get(id, { include_docs: true })
          .then((doc) => {
            this.doc = doc
            const path = getPathFromDoc(doc)
            app.router.navigate('/' + path)
            this.trigger(doc)
          })
          .catch((error) => app.Actions.showError({title: 'Error loading ' + id + ':', msg: error}))
      }
    },

    onSavePage (doc) {
      app.db.put(doc)
        .then((resp) => {
          // resp.rev is new rev
          doc._rev = resp.rev
          this.trigger(doc)
        })
        .catch((error) => app.Actions.showError({title: 'Error in pageStore, onSavePage:', msg: error}))
    },

    // see: http://pouchdb.com/api.html#save_attachment > Save many attachments at once
    onAddPageAttachments (doc, attachments) {
      doc._attachments = Object.assign(doc._attachments, attachments)
      this.onSavePage(doc)
    },

    onRemovePageAttachment (doc, attachmentId) {
      console.log('pageStore removing attachment', attachmentId)
      delete doc._attachments[attachmentId]
      this.onSavePage(doc)
    }
  })

  app.monthlyEventStore = Reflux.createStore({

    listenables: Actions,

    onGetMonthlyEvent (id) {
      if (!id) {
        app.router.navigate('/monthlyEvents')
        this.trigger({})
      } else {
        app.db.get(id, { include_docs: true })
          .then((monthlyEvent) => {
            const path = getPathFromDoc(monthlyEvent)
            app.router.navigate('/' + path)
            this.trigger(monthlyEvent)
          })
          .catch((error) => app.Actions.showError({title: 'Error fetching monthly event ' + id + ':', msg: error}))
      }
    },

    onSaveMonthlyEvent (monthlyEvent) {
      app.db.put(monthlyEvent)
        .then((resp) => {
          // resp.rev is new rev
          monthlyEvent._rev = resp.rev
          this.trigger(monthlyEvent)
          Actions.getMonthlyEvents()
        })
        .catch((error) => app.Actions.showError({title: 'Error saving monthly event:', msg: error}))
    }
  })

  app.monthlyEventsStore = Reflux.createStore({

    listenables: Actions,

    onGetMonthlyEvents () {
      getMonthlyEvents()
        .then((result) => {
          const docs = _.pluck(result.rows, 'doc')
          this.trigger(docs)
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewMonthlyEvent (year, month) {
      const id = `monthlyEvents_${year}_${month}`
      const article = Base64.encode(monthlyEventTemplate)
      const monthlyEvent = {
        _id: id,
        type: 'monthlyEvents',
        draft: true,
        article: article
      }
      Actions.saveMonthlyEvent(monthlyEvent)
    },

    onRemoveMonthlyEvent (doc) {
      app.db.remove(doc)
        .then(() => this.onGetMonthlyEvents())
        .catch((error) => app.Actions.showError({title: 'Error removing monthly event:', msg: error}))
    },

    onToggleDraftOfMonthlyEvent (doc) {
      if (doc.draft === true) {
        delete doc.draft
      } else {
        doc.draft = true
      }
      Actions.saveMonthlyEvent(doc)
    }
  })

  app.commentaryStore = Reflux.createStore({

    listenables: Actions,

    onGetCommentary (id) {
      if (!id) {
        app.router.navigate('/commentaries')
        this.trigger({})
      } else {
        app.db.get(id, { include_docs: true })
          .then((commentary) => {
            const path = getPathFromDoc(commentary)
            app.router.navigate('/' + path)
            this.trigger(commentary)
          })
          .catch((error) => app.Actions.showError({title: 'Error fetching commentary ' + id + ':', msg: error}))
      }
    },

    onSaveCommentary (commentary) {
      app.db.put(commentary)
        .then((resp) => {
          // resp.rev is new rev
          commentary._rev = resp.rev
          this.trigger(commentary)
          Actions.getCommentaries()
        })
        .catch((error) => app.Actions.showError({title: 'Error saving commentary:', msg: error}))
    }
  })

  app.commentariesStore = Reflux.createStore({

    listenables: Actions,

    onGetCommentaries () {
      getCommentaries()
        .then((result) => {
          const docs = _.pluck(result.rows, 'doc')
          this.trigger(docs)
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewCommentary (title, date) {
      const year = moment(date).year()
      const month = moment(date).format('MM')
      const day = moment(date).format('DD')
      const id = `commentaries_${year}_${month}_${day}_${title}`
      const commentary = {
        _id: id,
        title: title,
        draft: true,
        article: 'IA==',
        type: 'commentaries'
      }
      Actions.saveCommentary(commentary)
    },

    onRemoveCommentary (doc) {
      app.db.remove(doc)
        .then(() => this.onGetCommentaries())
        .catch((error) => app.Actions.showError({title: 'Error removing commentary:', msg: error}))
    },

    onToggleDraftOfCommentary (doc) {
      if (doc.draft === true) {
        delete doc.draft
      } else {
        doc.draft = true
      }
      Actions.saveCommentary(doc)
    }
  })

  app.publicationStore = Reflux.createStore({

    listenables: Actions,

    onGetPublication (id, activeCategory) {
      if (!id) {
        const path = activeCategory ? '/publications/' + slug(activeCategory, {lower: true}) : '/publications'
        console.log('path', path)
        app.router.navigate(path)
        // app.router.navigate('/publications')
        this.trigger({})
      } else {
        app.db.get(id, { include_docs: true })
          .then((publication) => {
            const path = getPathFromDoc(publication)
            app.router.navigate('/' + path)
            this.trigger(publication)
          })
          .catch((error) => app.Actions.showError({title: 'Error fetching monthly event ' + id + ':', msg: error}))
      }
    },

    onSavePublication (publication) {
      app.db.put(publication)
        .then((resp) => {
          // resp.rev is new rev
          publication._rev = resp.rev
          this.trigger(publication)
          Actions.getPublications()
        })
        .catch((error) => app.Actions.showError({title: 'Error saving monthly event:', msg: error}))
    }
  })

  app.publicationsStore = Reflux.createStore({

    listenables: Actions,

    onGetPublications () {
      getPublications()
        .then((result) => {
          const docs = _.pluck(result.rows, 'doc')
          this.trigger(docs)
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewPublication (category, title) {
      const titleSlugified = slug(title)
      const categorySlugified = slug(category)
      const id = `publications_${categorySlugified}_${titleSlugified}`
      const article = Base64.encode(publicationTemplate)
      const publication = {
        _id: id,
        type: 'publications',
        draft: true,
        category: category,
        title: title,
        article: article
      }
      Actions.savePublication(publication)
    },

    onRemovePublication (doc) {
      app.db.remove(doc)
        .then(() => this.onGetPublications())
        .catch((error) => app.Actions.showError({title: 'Error removing publication:', msg: error}))
    },

    onToggleDraftOfPublication (doc) {
      if (doc.draft === true) {
        delete doc.draft
      } else {
        doc.draft = true
      }
      Actions.savePublication(doc)
    }
  })

  app.sourceCategoryStore = Reflux.createStore({

    listenables: Actions,

    onGetSourceCategory (id) {
      if (!id) {
        app.router.navigate('/sources')
        this.trigger({})
      } else {
        app.db.get(id, { include_docs: true })
          .then((sourceCategory) => {
            const path = getPathFromDoc(sourceCategory)
            app.router.navigate('/' + path)
            this.trigger(sourceCategory)
          })
          .catch((error) => app.Actions.showError({title: 'Error fetching source category ' + id + ':', msg: error}))
      }
    },

    onSaveSourceCategory (sourceCategory) {
      app.db.put(sourceCategory)
        .then((resp) => {
          // resp.rev is new rev
          sourceCategory._rev = resp.rev
          this.trigger(sourceCategory)
          Actions.getSourceCategories()
        })
        .catch((error) => app.Actions.showError({title: 'Error saving source category:', msg: error}))
    }
  })

  app.sourceCategoriesStore = Reflux.createStore({

    listenables: Actions,

    onGetSourceCategories () {
      getSourceCategories()
        .then((result) => {
          const docs = _.pluck(result.rows, 'doc')
          this.trigger(docs)
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewSourceCategory (category) {
      const categorySlugified = slug(category, {lower: true})
      const id = `sources_${categorySlugified}`
      const sourceCategory = {
        _id: id,
        category: category,
        draft: true,
        article: 'IA==',
        type: 'sources'
      }
      Actions.saveSourceCategory(sourceCategory)
    },

    onRemoveSourceCategory (doc) {
      app.db.remove(doc)
        .then(() => this.onGetSourceCategories())
        .catch((error) => app.Actions.showError({title: 'Error removing source category:', msg: error}))
    },

    onToggleDraftOfSourceCategory (doc) {
      if (doc.draft === true) {
        delete doc.draft
      } else {
        doc.draft = true
      }
      Actions.saveSourceCategory(doc)
    }
  })

  app.actorCategoryStore = Reflux.createStore({

    listenables: Actions,

    onGetActorCategory (id) {
      if (!id) {
        app.router.navigate('/actors')
        this.trigger({})
      } else {
        app.db.get(id, { include_docs: true })
          .then((actorCategory) => {
            const path = getPathFromDoc(actorCategory)
            app.router.navigate('/' + path)
            this.trigger(actorCategory)
          })
          .catch((error) => app.Actions.showError({title: 'Error fetching actor category ' + id + ':', msg: error}))
      }
    },

    onSaveActorCategory (actorCategory) {
      app.db.put(actorCategory)
        .then((resp) => {
          // resp.rev is new rev
          actorCategory._rev = resp.rev
          this.trigger(actorCategory)
          Actions.getActorCategories()
        })
        .catch((error) => app.Actions.showError({title: 'Error saving actor category:', msg: error}))
    }
  })

  app.actorCategoriesStore = Reflux.createStore({

    listenables: Actions,

    onGetActorCategories () {
      getActorCategories()
        .then((result) => {
          const docs = _.pluck(result.rows, 'doc')
          this.trigger(docs)
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewActorCategory (category) {
      const categorySlugified = slug(category, {lower: true})
      const id = `actors_${categorySlugified}`
      const actorCategory = {
        _id: id,
        category: category,
        draft: true,
        article: 'IA==',
        type: 'actors'
      }
      Actions.saveActorCategory(actorCategory)
    },

    onRemoveActorCategory (doc) {
      app.db.remove(doc)
        .then(() => this.onGetActorCategories())
        .catch((error) => app.Actions.showError({title: 'Error removing actor category:', msg: error}))
    },

    onToggleDraftOfActorCategory (doc) {
      if (doc.draft === true) {
        delete doc.draft
      } else {
        doc.draft = true
      }
      Actions.saveActorCategory(doc)
    }
  })

  app.loginStore = Reflux.createStore({
    /*
     * contains email of logged in user
     * well, it is saved in localStorage as window.localStorage.email
     * app.js sets default email (null) if not exists on app start
     */
    listenables: Actions,

    getLogin () {
      return window.localStorage.email
    },

    onLogin (email) {
      // change email only if it was passed
      const changeEmail = email !== undefined
      let lsEmail = window.localStorage.email
      if ((changeEmail && lsEmail !== email) || !email) {
        if (changeEmail) {
          lsEmail = email
        } else {
          email = lsEmail
        }
        this.trigger(email)
        window.localStorage.email = email
      }
    },

    onLogout () {
      delete window.localStorage.email
      this.trigger(null)
    }
  })

  app.errorStore = Reflux.createStore({
    /*
     * receives an error object with two keys: title, msg
     * keeps error objects in the array errors
     * deletes errors after a defined time - the time while the error will be shown to the user
     *
     * if a view wants to inform of an error it
     * calls action showError and passes the object
     *
     * the errorStore triggers, passing the errors array
     * ...then triggers again after removing the last error some time later
     *
     * Test: app.Actions.showError({title: 'testTitle', msg: 'testMessage'})
     * template: app.Actions.showError({title: 'title', msg: error})
     */
    listenables: Actions,

    errors: [],

    // this is how long the error will be shown
    duration: 10000,

    onShowError (error) {
      if (!error) {
        // user wants to remove error messages
        this.errors = []
        this.trigger(this.errors)
      } else {
        this.errors.unshift(error)
        this.trigger(this.errors)
        setTimeout(() => {
          this.errors.pop()
          this.trigger(this.errors)
        }, this.duration)
      }
    }
  })
}
