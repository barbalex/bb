import app from 'ampersand-app'
import { map } from 'lodash'
import sortCommentaries from './sortCommentaries.js'

const options = {
  include_docs: true,
  startkey: 'commentaries_',
  endkey: 'commentaries_\uffff'
}

export default () =>
  new Promise((resolve, reject) =>
    app.db.allDocs(options)
      .then((result) => {
        let commentaries = map(result.rows, 'doc')
        commentaries = sortCommentaries(commentaries)
        resolve(commentaries)
      })
      .catch((error) =>
        reject('Error fetching commentaries:', error)
      )
  )
