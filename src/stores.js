'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import moment from 'moment'
import { Base64 } from 'js-base64'
import slug from 'slug'
import getPathFromDoc from './modules/getPathFromDoc.js'
import getCommentaries from './modules/getCommentaries.js'
import getSources from './modules/getSources.js'
import getActors from './modules/getActors.js'
import getMonthlyEvents from './modules/getMonthlyEvents.js'
import getEvents from './modules/getEvents.js'
import sortEvents from './modules/sortEvents.js'
import getPublications from './modules/getPublications.js'
import monthlyEventTemplate from 'html!./components/monthlyEvents/monthlyEventTemplate.html'
import publicationTemplate from 'html!./components/publications/publicationTemplate.html'
import _ from 'lodash'

export default (Actions) => {
  app.activePageStore = Reflux.createStore({

    listenables: Actions,

    activePage: null,

    onGetPage (id) {
      const get = !this.activePage || (this.activePage._id && this.activePage._id !== id)
      if (get) {
        app.db.get(id, { include_docs: true })
          .then((doc) => {
            this.activePage = doc
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
          this.activePage = doc
          this.trigger(doc)
        })
        .catch((error) => app.Actions.showError({title: 'Error in activePageStore, onSavePage:', msg: error}))
    },

    // see: http://pouchdb.com/api.html#save_attachment > Save many attachments at once
    onAddPageAttachments (doc, attachments) {
      doc._attachments = Object.assign(doc._attachments, attachments)
      this.onSavePage(doc)
    },

    onRemovePageAttachment (doc, attachmentId) {
      console.log('activePageStore removing attachment', attachmentId)
      delete doc._attachments[attachmentId]
      this.onSavePage(doc)
    }
  })

  app.activeMonthlyEventStore = Reflux.createStore({

    listenables: Actions,

    activeMonthlyEvent: null,

    onGetMonthlyEvent (id) {
      if (!id) {
        app.router.navigate('/monthlyEvents')
        this.trigger({})
        this.activeMonthlyEvent = null
      } else {
        app.db.get(id, { include_docs: true })
          .then((monthlyEvent) => {
            const path = getPathFromDoc(monthlyEvent)
            app.router.navigate('/' + path)
            this.trigger(monthlyEvent)
            this.activeMonthlyEvent = monthlyEvent
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
          const isActiveMonthlyEvent = this.activeMonthlyEvent && monthlyEvent._id === this.activeMonthlyEvent._id
          if (isActiveMonthlyEvent) this.activeMonthlyEvent = monthlyEvent
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
        .then(() => {
          this.onGetMonthlyEvents()
          const activeMonthlyEvent = app.activeMonthlyEventStore.activeMonthlyEvent
          if (activeMonthlyEvent && activeMonthlyEvent._id === doc._id) Actions.getMonthlyEvent(null)
        })
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

  app.eventsStore = Reflux.createStore({

    listenables: Actions,

    events: [],

    activeEvent: null,

    onGetEvents () {
      getEvents()
        .then((events) => {
          this.events = events
          this.triggerStore()
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewEvent (year, month, day, title, eventType, tags) {
      const _id = `events_${year}_${month}_${day}_${title}`
      const type = 'events'
      const event = { _id, type, title, eventType, tags }
      this.saveEvent(event)
    },

    onGetEvent (id) {
      if (!id) {
        app.router.navigate('/events')
        this.activeEvent = null
        this.triggerStore()
      } else {
        const event = this.events.find((event) => event._id === id)
        const path = getPathFromDoc(event)
        app.router.navigate('/' + path)
        this.activeEvent = event
        this.triggerStore()
      }
    },

    updateEventInCache (event) {
      // first update the event in this.events
      this.events = this.events.filter((thisEvent) => thisEvent._id !== event._id)
      this.events.push(event)
      this.events = sortEvents(this.events)
      // now update it in this.activeEvent if it is the active event
      const isActiveEvent = this.activeEvent && this.activeEvent._id === event._id
      if (isActiveEvent) this.activeEvent = event
      // now tell every one!
      this.triggerStore()
    },

    onSaveEvent (event) {
      // optimistically update in cache
      this.updateEventInCache(event)
      app.db.put(event)
        .then((resp) => {
          // resp.rev is new rev
          event._rev = resp.rev
          // update in cache
          this.updateEventInCache(event)
        })
        .catch((error) => app.Actions.showError({title: 'Error saving event:', msg: error}))
    },

    removeEventFromCache (event) {
      // first update the event in this.events
      this.events = this.events.filter((thisEvent) => thisEvent._id !== event._id)
      this.events = sortEvents(this.events)
      // now update it in this.activeEvent if it is the active event
      const isActiveEvent = this.activeEvent && this.activeEvent._id === event._id
      if (isActiveEvent) this.activeEvent = null
      // now tell every one!
      this.triggerStore()
    },

    onRemoveEvent (event) {
      // optimistically remove event from cache
      this.removeEventFromCache(event)
      app.db.remove(event)
        .catch((error) => {
          // oops. Revert optimistic removal
          this.updateEventInCache(event)
          app.Actions.showError({title: 'Error removing event:', msg: error})
        })
    },

    triggerStore () {
      this.trigger(this.events, this.activeEvent)
    }
  })

  app.activeCommentaryStore = Reflux.createStore({

    listenables: Actions,

    activeCommentary: null,

    onGetCommentary (id) {
      if (!id) {
        app.router.navigate('/commentaries')
        this.trigger({})
        this.activeCommentary = null
      } else {
        app.db.get(id, { include_docs: true })
          .then((commentary) => {
            const path = getPathFromDoc(commentary)
            app.router.navigate('/' + path)
            this.trigger(commentary)
            this.activeCommentary = commentary
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
          const isActiveCommentary = this.activeCommentary && this.activeCommentary._id === commentary._id
          if (isActiveCommentary) this.activeCommentary = commentary
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
        .then(() => {
          this.onGetCommentaries()
          const activeCommentary = app.activeCommentaryStore.activeCommentary
          if (activeCommentary && activeCommentary._id === doc._id) Actions.getCommentary(null)
        })
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

  app.activePublicationStore = Reflux.createStore({

    listenables: Actions,

    activePublication: null,

    onGetPublication (id) {
      if (!id) {
        app.router.navigate('/publications')
        this.trigger({})
        this.activePublication = null
      } else {
        app.db.get(id, { include_docs: true })
          .then((publication) => {
            const path = getPathFromDoc(publication)
            app.router.navigate('/' + path)
            this.trigger(publication)
            this.activePublication = publication
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
          const isActivePublication = this.activePublication && this.activePublication._id === publication._id
          if (isActivePublication) this.activePublication = publication
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
        .then(() => {
          this.onGetPublications()
          const activePublication = app.activePublicationStore.activePublication
          if (activePublication && activePublication._id === doc._id) Actions.getPublication(null)
        })
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

  app.activeSourceStore = Reflux.createStore({

    listenables: Actions,

    activeSource: null,

    onGetSource (id) {
      if (!id) {
        app.router.navigate('/sources')
        this.trigger({})
        this.activeSource = null
      } else {
        app.db.get(id, { include_docs: true })
          .then((source) => {
            const path = getPathFromDoc(source)
            app.router.navigate('/' + path)
            this.trigger(source)
            this.activeSource = source
          })
          .catch((error) => app.Actions.showError({title: 'Error fetching source ' + id + ':', msg: error}))
      }
    },

    onSaveSource (source) {
      app.db.put(source)
        .then((resp) => {
          source._rev = resp.rev
          this.trigger(source)
          Actions.getSources()
          const isActiveSource = this.activeSource && this.activeSource._id === source._id
          if (isActiveSource) this.activeSource = source
        })
        .catch((error) => app.Actions.showError({title: 'Error saving source:', msg: error}))
    }
  })

  app.sourcesStore = Reflux.createStore({

    listenables: Actions,

    onGetSources () {
      getSources()
        .then((result) => {
          const docs = _.pluck(result.rows, 'doc')
          this.trigger(docs)
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewSource (category) {
      const categorySlugified = slug(category, {lower: true})
      const id = `sources_${categorySlugified}`
      const source = {
        _id: id,
        category: category,
        draft: true,
        article: 'IA==',
        type: 'sources'
      }
      Actions.saveSource(source)
    },

    onRemoveSource (doc) {
      app.db.remove(doc)
        .then(() => {
          this.onGetSources()
          const activeSource = app.activeSourceStore.activeSource
          if (activeSource && activeSource._id === doc._id) Actions.getSource(null)
        })
        .catch((error) => app.Actions.showError({title: 'Error removing source:', msg: error}))
    },

    onToggleDraftOfSource (doc) {
      if (doc.draft === true) {
        delete doc.draft
      } else {
        doc.draft = true
      }
      Actions.saveSource(doc)
    }
  })

  app.activeActorStore = Reflux.createStore({

    listenables: Actions,

    activeActor: null,

    onGetActor (id) {
      if (!id) {
        app.router.navigate('/actors')
        this.trigger({})
        this.activeActor = null
      } else {
        app.db.get(id, { include_docs: true })
          .then((actor) => {
            const path = getPathFromDoc(actor)
            app.router.navigate('/' + path)
            this.trigger(actor)
            this.activeActor = actor
          })
          .catch((error) => app.Actions.showError({title: 'Error fetching actor ' + id + ':', msg: error}))
      }
    },

    onSaveActor (actor) {
      app.db.put(actor)
        .then((resp) => {
          // resp.rev is new rev
          actor._rev = resp.rev
          this.trigger(actor)
          Actions.getActors()
          const isActiveActor = this.activeActor && this.activeActor._id === actor._id
          if (isActiveActor) this.activeActor = actor
        })
        .catch((error) => app.Actions.showError({title: 'Error saving actor:', msg: error}))
    }
  })

  app.actorsStore = Reflux.createStore({

    listenables: Actions,

    onGetActors () {
      getActors()
        .then((result) => {
          const docs = _.pluck(result.rows, 'doc')
          this.trigger(docs)
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewActor (category) {
      const categorySlugified = slug(category, {lower: true})
      const id = `actors_${categorySlugified}`
      const actor = {
        _id: id,
        category: category,
        draft: true,
        article: 'IA==',
        type: 'actors'
      }
      Actions.saveActor(actor)
    },

    onRemoveActor (doc) {
      app.db.remove(doc)
        .then(() => {
          this.onGetActors()
          const activeActor = app.activeActorStore.activeActor
          if (activeActor && activeActor._id === doc._id) Actions.getActor(null)
        })
        .catch((error) => app.Actions.showError({title: 'Error removing actor:', msg: error}))
    },

    onToggleDraftOfActor (doc) {
      if (doc.draft === true) {
        delete doc.draft
      } else {
        doc.draft = true
      }
      Actions.saveActor(doc)
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

    // how long the error will be shown
    duration: 10000,

    onShowError (error) {
      if (!error) {
        // user wants to remove error messages
        this.errors = []
        this.trigger([])
      } else {
        if (error.msg && error.msg.message) error.msg = error.msg.message
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
