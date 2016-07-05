import app from 'ampersand-app'
import { map } from 'lodash'
import sortActors from './sortActors.js'

const options = {
  include_docs: true,
  startkey: 'actors_',
  endkey: 'actors_\uffff'
}

export default () =>
  new Promise((resolve, reject) =>
    app.db.allDocs(options)
      .then((result) => {
        let actors = map(result.rows, 'doc')
        actors = sortActors(actors)
        resolve(actors)
      })
      .catch((error) =>
        reject('Error fetching actors:', error)
      )
  )
