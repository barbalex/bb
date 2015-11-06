'use strict'

import app from 'ampersand-app'
import Reflux from 'reflux'
import moment from 'moment'
import { Base64 } from 'js-base64'
import slug from 'slug'
import getPathFromDoc from './modules/getPathFromDoc.js'
import getCommentaries from './modules/getCommentaries.js'
import sortCommentaries from './modules/sortCommentaries.js'
import getSources from './modules/getSources.js'
import sortSources from './modules/sortSources.js'
import getActors from './modules/getActors.js'
import sortActors from './modules/sortActors.js'
import getMonthlyEvents from './modules/getMonthlyEvents.js'
import sortMonthlyEvents from './modules/sortMonthlyEvents.js'
import getEvents from './modules/getEvents.js'
import sortEvents from './modules/sortEvents.js'
import getPublications from './modules/getPublications.js'
import sortPublications from './modules/sortPublications.js'
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

  app.monthlyEventsStore = Reflux.createStore({

    listenables: Actions,

    monthlyEvents: [],

    // cache the id, not the entire doc
    // advantage: on first load monthlyEvents is empty so no activeMonthlyEvent can be gotten
    // but if id is used, this can be cached
    activeMonthlyEventId: null,

    activeMonthlyEvent () {
      return this.monthlyEvents.find((monthlyEvent) => monthlyEvent._id === this.activeMonthlyEventId)
    },

    getMonthlyEventsCallback: null,

    onGetMonthlyEvents () {
      getMonthlyEvents()
        .then((monthlyEvents) => {
          this.monthlyEvents = monthlyEvents
          if (this.getMonthlyEventsCallback) {
            this.getMonthlyEventsCallback()
            this.getMonthlyEventsCallback = null
          }
          this.triggerStore()
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewMonthlyEvent (year, month) {
      const _id = `monthlyEvents_${year}_${month}`
      const type = 'monthlyEvents'
      const draft = true
      const article = Base64.encode(monthlyEventTemplate)
      const monthlyEvent = { _id, type, draft, article }
      this.onSaveMonthlyEvent(monthlyEvent)
    },

    onGetMonthlyEvent (id) {
      if (!id) {
        app.router.navigate('/monthlyEvents')
        this.activeMonthlyEventId = null
        this.triggerStore()
      } else {
        if (this.monthlyEvents.length === 0) {
          // on first load monthlyEvents is empty
          // need to wait until onGetMonthlyEvents fires
          this.getMonthlyEventsCallback = () => {
            const monthlyEvent = this.monthlyEvents.find((monthlyEvent) => monthlyEvent._id === id)
            const path = getPathFromDoc(monthlyEvent)
            app.router.navigate('/' + path)
            this.activeMonthlyEventId = id
          }
        } else {
          const monthlyEvent = this.monthlyEvents.find((monthlyEvent) => monthlyEvent._id === id)
          const path = getPathFromDoc(monthlyEvent)
          app.router.navigate('/' + path)
          this.activeMonthlyEventId = id
          this.triggerStore()
        }
      }
    },

    updateMonthlyEventsInCache (monthlyEvent) {
      // first update the monthlyEvent in this.monthlyEvents
      this.monthlyEvents = this.monthlyEvents.filter((thisMonthlyEvent) => thisMonthlyEvent._id !== monthlyEvent._id)
      this.monthlyEvents.push(monthlyEvent)
      this.monthlyEvents = sortMonthlyEvents(this.monthlyEvents)
      // now tell every one!
      this.triggerStore()
    },

    revertCache (oldMonthlyEvents, oldActiveMonthlyEventId) {
      this.monthlyEvents = oldMonthlyEvents
      this.activeMonthlyEventId = oldActiveMonthlyEventId
      this.triggerStore()
    },

    onSaveMonthlyEvent (monthlyEvent) {
      // keep old cache in case of error
      const oldMonthlyEvents = this.monthlyEvents
      const oldActiveMonthlyEventId = this.activeMonthlyEventId
      // optimistically update in cache
      this.updateMonthlyEventsInCache(monthlyEvent)
      app.db.put(monthlyEvent)
        .then((resp) => {
          monthlyEvent._rev = resp.rev
          // definitely update in cache
          this.updateMonthlyEventsInCache(monthlyEvent)
        })
        .catch((error) => {
          this.revertCache(oldMonthlyEvents, oldActiveMonthlyEventId)
          app.Actions.showError({title: 'Error saving monthly event:', msg: error})
        })
    },

    removeMonthlyEventFromCache (monthlyEvent) {
      // first update the monthlyEvent in this.monthlyEvents
      this.monthlyEvents = this.monthlyEvents.filter((thisMonthlyEvent) => thisMonthlyEvent._id !== monthlyEvent._id)
      this.monthlyEvents = sortMonthlyEvents(this.monthlyEvents)
      // now update this.activeMonthlyEventId if it is the active monthlyEvent's _id
      const isActiveMonthlyEvent = this.activeMonthlyEventId === monthlyEvent._id
      if (isActiveMonthlyEvent) this.activeMonthlyEventId = null
      // now tell every one!
      this.triggerStore()
    },

    onRemoveMonthlyEvent (monthlyEvent) {
      // keep old cache in case of error
      const oldMonthlyEvents = this.monthlyEvents
      const oldActiveMonthlyEventId = this.activeMonthlyEventId
      // optimistically remove monthlyEvent from cache
      this.removeMonthlyEventFromCache(monthlyEvent)
      app.db.remove(monthlyEvent)
        .catch((error) => {
          // oops. Revert optimistic removal
          this.revertCache(oldMonthlyEvents, oldActiveMonthlyEventId)
          app.Actions.showError({title: 'Error removing monthly event:', msg: error})
        })
    },

    onToggleDraftOfMonthlyEvent (monthlyEvent) {
      if (monthlyEvent.draft === true) {
        delete monthlyEvent.draft
      } else {
        monthlyEvent.draft = true
      }
      this.onSaveMonthlyEvent(monthlyEvent)
    },

    triggerStore () {
      this.trigger(this.monthlyEvents, this.activeMonthlyEvent())
    }
  })

  app.eventsStore = Reflux.createStore({

    listenables: Actions,

    events: [],

    // cache the id, not the entire doc
    // advantage: on first load events is empty so no activeEvent can be gotten
    // but if id is used, this can be cached
    activeEventId: null,

    activeEvent () {
      return this.events.find((event) => event._id === this.activeEventId)
    },

    getEventsCallback: null,

    onGetEvents () {
      getEvents()
        .then((events) => {
          this.events = events
          if (this.getEventsCallback) {
            this.getEventsCallback()
            this.getEventsCallback = null
          }
          this.triggerStore()
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewEvent (year, month, day, title, eventType, tags) {
      const _id = `events_${year}_${month}_${day}_${title}`
      const type = 'events'
      const event = { _id, type, title, eventType, tags }
      this.onSaveEvent(event)
    },

    onGetEvent (id) {
      if (!id) {
        app.router.navigate('/events')
        this.activeEventId = null
        this.triggerStore()
      } else {
        if (this.events.length === 0) {
          // on first load events is empty
          // need to wait until onGetEvents fires
          this.getEventsCallback = () => {
            const event = this.events.find((event) => event._id === id)
            const path = getPathFromDoc(event)
            app.router.navigate('/' + path)
            this.activeEventId = id
          }
        } else {
          const event = this.events.find((event) => event._id === id)
          const path = getPathFromDoc(event)
          app.router.navigate('/' + path)
          this.activeEventId = id
          this.triggerStore()
        }
      }
    },

    updateEventsInCache (event) {
      // first update the event in this.events
      this.events = this.events.filter((thisEvent) => thisEvent._id !== event._id)
      this.events.push(event)
      this.events = sortEvents(this.events)
      // now tell every one!
      this.triggerStore()
    },

    revertCache (oldEvents, oldActiveEventId) {
      this.events = oldEvents
      this.activeEventId = oldActiveEventId
      this.triggerStore()
    },

    onSaveEvent (event) {
      // keep old cache in case of error
      const oldEvents = this.events
      const oldActiveEventId = this.activeEventId
      // optimistically update in cache
      this.updateEventsInCache(event)
      app.db.put(event)
        .then((resp) => {
          event._rev = resp.rev
          // definitely update in cache
          this.updateEventsInCache(event)
        })
        .catch((error) => {
          this.revertCache(oldEvents, oldActiveEventId)
          app.Actions.showError({title: 'Error saving event:', msg: error})
        })
    },

    removeEventFromCache (event) {
      // first update the event in this.events
      this.events = this.events.filter((thisEvent) => thisEvent._id !== event._id)
      this.events = sortEvents(this.events)
      // now update it in this.activeEvent if it is the active event
      const isActiveEvent = this.activeEventId === event._id
      if (isActiveEvent) this.activeEventId = null
      // now tell every one!
      this.triggerStore()
    },

    onRemoveEvent (event) {
      // keep old cache in case of error
      const oldEvents = this.events
      const oldActiveEventId = this.activeEventId
      // optimistically remove event from cache
      this.removeEventFromCache(event)
      app.db.remove(event)
        .catch((error) => {
          // oops. Revert optimistic removal
          this.revertCache(oldEvents, oldActiveEventId)
          app.Actions.showError({title: 'Error removing event:', msg: error})
        })
    },

    triggerStore () {
      this.trigger(this.events, this.activeEvent())
    }
  })

  app.commentariesStore = Reflux.createStore({

    listenables: Actions,

    commentaries: [],

    // cache the id, not the entire doc
    // advantage: on first load commentaries is empty so no activeCommentary can be gotten
    // but if id is used, this can be cached
    activeCommentaryId: null,

    activeCommentary () {
      return this.commentaries.find((commentary) => commentary._id === this.activeCommentaryId)
    },

    getCommentariesCallback: null,

    onGetCommentaries () {
      getCommentaries()
        .then((commentaries) => {
          this.commentaries = commentaries
          if (this.getCommentariesCallback) {
            this.getCommentariesCallback()
            this.getCommentariesCallback = null
          }
          this.triggerStore()
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewCommentary (title, date) {
      const year = moment(date).year()
      const month = moment(date).format('MM')
      const day = moment(date).format('DD')
      const _id = `commentaries_${year}_${month}_${day}_${title}`
      const draft = true
      const article = 'IA=='
      const type = 'commentaries'
      const commentary = { _id, title, draft, article, type }
      this.onSaveCommentary(commentary)
    },

    onGetCommentary (id) {
      if (!id) {
        app.router.navigate('/commentaries')
        this.activeCommentaryId = null
        this.triggerStore()
      } else {
        if (this.commentaries.length === 0) {
          // on first load commentaries is empty
          // need to wait until onGetCommentaries fires
          this.getCommentariesCallback = () => {
            const commentary = this.commentaries.find((commentary) => commentary._id === id)
            const path = getPathFromDoc(commentary)
            app.router.navigate('/' + path)
            this.activeCommentaryId = id
          }
        } else {
          const commentary = this.commentaries.find((commentary) => commentary._id === id)
          const path = getPathFromDoc(commentary)
          app.router.navigate('/' + path)
          this.activeCommentaryId = id
          this.triggerStore()
        }
      }
    },

    updateCommentariesInCache (commentary) {
      // first update the commentary in this.commentaries
      this.commentaries = this.commentaries.filter((thisCommentary) => thisCommentary._id !== commentary._id)
      this.commentaries.push(commentary)
      this.commentaries = sortCommentaries(this.commentaries)
      // now tell every one!
      this.triggerStore()
    },

    revertCache (oldCommentaries, oldActiveCommentaryId) {
      this.commentaries = oldCommentaries
      this.activeCommentaryId = oldActiveCommentaryId
      this.triggerStore()
    },

    onSaveCommentary (commentary) {
      // keep old cache in case of error
      const oldCommentaries = this.commentaries
      const oldActiveCommentaryId = this.activeCommentaryId
      // optimistically update in cache
      this.updateCommentariesInCache(commentary)
      app.db.put(commentary)
        .then((resp) => {
          // resp.rev is new rev
          commentary._rev = resp.rev
          // definitely update in cache
          this.updateCommentariesInCache(commentary)
        })
        .catch((error) => {
          this.revertCache(oldCommentaries, oldActiveCommentaryId)
          app.Actions.showError({title: 'Error saving commentary:', msg: error})
        })
    },

    removeCommentaryFromCache (commentary) {
      // first update the commentary in this.commentaries
      this.commentaries = this.commentaries.filter((thisCommentary) => thisCommentary._id !== commentary._id)
      this.commentaries = sortCommentaries(this.commentaries)
      // now update it in this.activeCommentaryId if it is the active commentary's _id
      const isActiveCommentary = this.activeCommentaryId === commentary._id
      if (isActiveCommentary) this.activeCommentaryId = null
      // now tell every one!
      this.triggerStore()
    },

    onRemoveCommentary (commentary) {
      // keep old cache in case of error
      const oldCommentaries = this.commentaries
      const oldActiveCommentaryId = this.activeCommentaryId
      // optimistically remove event from cache
      this.removeCommentaryFromCache(commentary)
      app.db.remove(commentary)
        .catch((error) => {
          // oops. Revert optimistic removal
          this.revertCache(oldCommentaries, oldActiveCommentaryId)
          app.Actions.showError({title: 'Error removing commentary:', msg: error})
        })
    },

    onToggleDraftOfCommentary (commentary) {
      if (commentary.draft === true) {
        delete commentary.draft
      } else {
        commentary.draft = true
      }
      this.onSaveCommentary(commentary)
    },

    triggerStore () {
      this.trigger(this.commentaries, this.activeCommentary())
    }
  })

  app.publicationsStore = Reflux.createStore({

    listenables: Actions,

    publications: [],

    activePublication: null,

    onGetPublications () {
      getPublications()
        .then((publications) => {
          this.publications = publications
          this.triggerStore()
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewPublication (category, title) {
      const titleSlugified = slug(title)
      const categorySlugified = slug(category)
      const _id = `publications_${categorySlugified}_${titleSlugified}`
      const type = 'publications'
      const draft = true
      const article = Base64.encode(publicationTemplate)
      const publication = { _id, type, draft, category, title, article }
      this.onSavePublication(publication)
    },

    onGetPublication (id) {
      if (!id) {
        app.router.navigate('/publications')
        this.activePublication = null
        this.triggerStore()
      } else {
        const publication = this.publications.find((publication) => publication._id === id)
        const path = getPathFromDoc(publication)
        app.router.navigate('/' + path)
        this.activePublication = publication
        this.triggerStore()
      }
    },

    updatePublicationInCache (publication) {
      // first update the publication in this.publications
      this.publications = this.publications.filter((thisPublication) => thisPublication._id !== publication._id)
      this.publications.push(publication)
      this.publications = sortPublications(this.publications)
      // now update it in this.activePublication if it is the active publication
      const isActivePublication = this.activePublication && this.activePublication._id === publication._id
      if (isActivePublication) this.activePublication = publication
      // now tell every one!
      this.triggerStore()
    },

    revertCache (oldPublications, oldActivePublication) {
      this.publications = oldPublications
      this.activePublication = oldActivePublication
      this.triggerStore()
    },

    onSavePublication (publication) {
      // keep old cache in case of error
      const oldPublications = this.publications
      const oldActivePublication = this.activePublication
      // optimistically update in cache
      this.updatePublicationInCache(publication)
      app.db.put(publication)
        .then((resp) => {
          // resp.rev is new rev
          publication._rev = resp.rev
          // definitely update in cache
          this.updatePublicationInCache(publication)
        })
        .catch((error) => {
          this.revertCache(oldPublications, oldActivePublication)
          app.Actions.showError({title: 'Error saving publication:', msg: error})
        })
    },

    removePublicationFromCache (publication) {
      // first update the publication in this.publications
      this.publications = this.publications.filter((thisPublication) => thisPublication._id !== publication._id)
      this.publications = sortPublications(this.publications)
      // now update it in this.activePublication if it is the active publication
      const isActivePublication = this.activePublication && this.activePublication._id === publication._id
      if (isActivePublication) this.activePublication = null
      // now tell every one!
      this.triggerStore()
    },

    onRemovePublication (publication) {
      // keep old cache in case of error
      const oldPublications = this.publications
      const oldActivePublication = this.activePublication
      // optimistically remove publication from cache
      this.removePublicationFromCache(publication)
      app.db.remove(publication)
        .catch((error) => {
          // oops. Revert optimistic removal
          this.revertCache(oldPublications, oldActivePublication)
          app.Actions.showError({title: 'Error removing publication:', msg: error})
        })
    },

    onToggleDraftOfPublication (publication) {
      if (publication.draft === true) {
        delete publication.draft
      } else {
        publication.draft = true
      }
      this.onSavePublication(publication)
    },

    getPublicationCategories () {
      const allCategories = _.map(this.publications, (publication) => publication.category)
      const publicationCategories = _.uniq(allCategories)
      return publicationCategories.sort()
    },

    triggerStore () {
      this.trigger(this.publications, this.activePublication)
    }
  })

  app.sourcesStore = Reflux.createStore({

    listenables: Actions,

    sources: [],

    activeSource: null,

    onGetSources () {
      getSources()
        .then((sources) => {
          this.sources = sources
          this.triggerStore()
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewSource (category) {
      const categorySlugified = slug(category, {lower: true})
      const _id = `sources_${categorySlugified}`
      const draft = true
      const article = 'IA=='
      const type = 'sources'
      const source = { _id, category, draft, article, type }
      this.onSaveSource(source)
    },

    onGetSource (id) {
      if (!id) {
        app.router.navigate('/sources')
        this.activeSource = null
        this.triggerStore()
      } else {
        const source = this.sources.find((source) => source._id === id)
        const path = getPathFromDoc(source)
        app.router.navigate('/' + path)
        this.activeSource = source
        this.triggerStore()
      }
    },

    updateSourceInCache (source) {
      // first update the source in this.sources
      this.sources = this.sources.filter((thisSource) => thisSource._id !== source._id)
      this.sources.push(source)
      this.sources = sortSources(this.sources)
      // now update it in this.activeSource if it is the active source
      const isActiveSource = this.activeSource && this.activeSource._id === source._id
      if (isActiveSource) this.activeSource = source
      // now tell every one!
      this.triggerStore()
    },

    revertCache (oldSources, oldActiveSource) {
      this.sources = oldSources
      this.activeSource = oldActiveSource
      this.triggerStore()
    },

    onSaveSource (source) {
      // keep old cache in case of error
      const oldSources = this.sources
      const oldActiveSource = this.activeSource
      // optimistically update in cache
      this.updateSourceInCache(source)
      app.db.put(source)
        .then((resp) => {
          source._rev = resp.rev
          // definitely update in cache
          this.updateSourceInCache(source)
        })
        .catch((error) => {
          this.revertCache(oldSources, oldActiveSource)
          app.Actions.showError({title: 'Error saving source:', msg: error})
        })
    },

    removeSourceFromCache (source) {
      // first update the source in this.sources
      this.sources = this.sources.filter((thisSource) => thisSource._id !== source._id)
      this.sources = sortSources(this.sources)
      // now update it in this.activeSource if it is the active source
      const isActiveSource = this.activeSource && this.activeSource._id === source._id
      if (isActiveSource) this.activeSource = null
      // now tell every one!
      this.triggerStore()
    },

    onRemoveSource (source) {
      // keep old cache in case of error
      const oldSources = this.sources
      const oldActiveSource = this.activeSource
      // optimistically remove event from cache
      this.removeSourceFromCache(source)
      app.db.remove(source)
        .catch((error) => {
          // oops. Revert optimistic removal
          this.revertCache(oldSources, oldActiveSource)
          app.Actions.showError({title: 'Error removing source:', msg: error})
        })
    },

    onToggleDraftOfSource (source) {
      if (source.draft === true) {
        delete source.draft
      } else {
        source.draft = true
      }
      this.onSaveSource(source)
    },

    triggerStore () {
      this.trigger(this.sources, this.activeSource)
    }
  })

  app.actorsStore = Reflux.createStore({

    listenables: Actions,

    actors: [],

    // cache the id, not the entire doc
    // advantage: on first load actors is empty so no activeActor can be gotten
    // but if id is used, this can be cached
    activeActorId: null,

    activeActor () {
      return this.actors.find((actor) => actor._id === this.activeActorId)
    },

    onGetActors () {
      getActors()
        .then((actors) => {
          this.actors = actors
          this.triggerStore()
        })
        .catch((error) => app.Actions.showError({msg: error}))
    },

    onNewActor (category) {
      const categorySlugified = slug(category, {lower: true})
      const _id = `actors_${categorySlugified}`
      const draft = true
      const article = 'IA=='
      const type = 'actors'
      const actor = { _id, category, draft, article, type }
      this.onSaveActor(actor)
    },

    onGetActor (id) {
      if (!id) {
        app.router.navigate('/actors')
        this.activeActorId = null
        this.triggerStore()
      } else {
        const actor = this.actors.find((actor) => actor._id === id)
        // on first load actors was empty, so no path to get and nowhere to navigate
        if (actor) {
          const path = getPathFromDoc(actor)
          app.router.navigate('/' + path)
        }
        this.activeActorId = id
        this.triggerStore()
      }
    },

    updateActorsInCache (actor) {
      // first update the actor in this.actors
      this.actors = this.actors.filter((thisActor) => thisActor._id !== actor._id)
      this.actors.push(actor)
      this.actors = sortActors(this.actors)
      // now tell every one!
      this.triggerStore()
    },

    revertCache (oldActors, oldActiveActorId) {
      this.actors = oldActors
      this.activeActorId = oldActiveActorId
      this.triggerStore()
    },

    onSaveActor (actor) {
      // keep old cache in case of error
      const oldActors = this.actors
      const oldActiveActorId = this.activeActorId
      // optimistically update in cache
      this.updateActorsInCache(actor)
      app.db.put(actor)
        .then((resp) => {
          // resp.rev is new rev
          actor._rev = resp.rev
          // definitely update in cache
          this.updateActorsInCache(actor)
        })
        .catch((error) => {
          this.revertCache(oldActors, oldActiveActorId)
          app.Actions.showError({title: 'Error saving actor:', msg: error})
        })
    },

    removeActorFromCache (actor) {
      // first update the actor in this.actors
      this.actors = this.actors.filter((thisActor) => thisActor._id !== actor._id)
      this.actors = sortActors(this.actors)
      // now update this.activeActorId if it is the active actor's _id
      const isActiveActor = this.activeActorId === actor._id
      if (isActiveActor) this.activeActorId = null
      // now tell every one!
      this.triggerStore()
    },

    onRemoveActor (actor) {
      // keep old cache in case of error
      const oldActors = this.actors
      const oldActiveActorId = this.activeActorId
      // optimistically remove event from cache
      this.removeActorFromCache(actor)
      app.db.remove(actor)
        .catch((error) => {
          // oops. Revert optimistic removal
          this.revertCache(oldActors, oldActiveActorId)
          app.Actions.showError({title: 'Error removing actor:', msg: error})
        })
    },

    onToggleDraftOfActor (actor) {
      if (actor.draft === true) {
        delete actor.draft
      } else {
        actor.draft = true
      }
      Actions.saveActor(actor)
    },

    triggerStore () {
      this.trigger(this.actors, this.activeActor())
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
