'use strict'

import app from 'ampersand-app'
import { pluck } from 'lodash'
import sortActors from './sortActors.js'

export default () => {
  return new Promise((resolve, reject) => {
    const options = {
      include_docs: true,
      startkey: 'actors_',
      endkey: 'actors_\uffff'
    }
    app.db.allDocs(options)
      .then((result) => {
        let actors = pluck(result.rows, 'doc')
        actors = sortActors(actors)
        resolve(actors)
      })
      .catch((error) => reject('Error fetching actors:', error))
  })
}
