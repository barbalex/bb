'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import moment from 'moment'
import getPathFromDoc from './modules/getPathFromDoc.js'
import getCommentaries from './modules/getCommentaries.js'
import getMonthlyEvents from './modules/getMonthlyEvents.js'
import _ from 'lodash'

export default (Actions) => {
  app.pageStore = Reflux.createStore({

    listenables: Actions,

    doc: null,

    onGetPage (id, onlyLoadOtherIds) {
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
          .then((event) => {
            const path = getPathFromDoc(event)
            app.router.navigate('/' + path)
            this.trigger(event)
          })
          .catch((error) => app.Actions.showError({title: 'Error fetching monthly event ' + id + ':', msg: error}))
      }
    },

    onSaveMonthlyEvent (event) {
      app.db.put(event)
        .then((resp) => {
          // resp.rev is new rev
          event._rev = resp.rev
          this.trigger(event)
        })
        .catch((error) => app.Actions.showError({title: 'Error saving monthly event:', msg: error}))
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
        article: '',
        type: 'commentaries'
      }
      app.db.put(commentary)
        .then(() => this.onGetCommentaries())
        .catch((error) => app.Actions.showError({title: 'Error creating new commentary:', msg: error}))
    },

    onRemoveCommentary (doc) {
      app.db.remove(doc)
        .then(() => this.onGetCommentaries())
        .catch((error) => app.Actions.showError({title: 'Error removing commentary:', msg: error}))
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

    onRemoveMonthlyEvent (doc) {
      app.db.remove(doc)
        .then(() => this.onGetMonthlyEvents())
        .catch((error) => app.Actions.showError({title: 'Error removing monthly event:', msg: error}))
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
