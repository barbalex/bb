import React from 'react'
import { Base64 } from 'js-base64'
import Editor from '../editor.js'

const Publication = ({
  activePublication,
  editing,
  onSavePublicationArticle,
}) => {
  const articleEncoded = activePublication.article
  const articleDecoded = Base64.decode(articleEncoded)
  if (editing) {
    return (
      <div className="publication">
        <Editor
          doc={activePublication}
          articleDecoded={articleDecoded}
          onSavePublicationArticle={onSavePublicationArticle}
        />
      </div>
    )
  }
  const createMarkup = () => ({ __html: articleDecoded })
  return (
    <div className="publication">
      <div dangerouslySetInnerHTML={createMarkup()} />
    </div>
  )
}

Publication.displayName = 'Publication'

Publication.propTypes = {
  activePublication: React.PropTypes.object,
  editing: React.PropTypes.bool,
  onSavePublicationArticle: React.PropTypes.func
}

export default Publication
