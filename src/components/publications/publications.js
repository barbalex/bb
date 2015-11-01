'use strict'

import app from 'ampersand-app'
import React from 'react'
import { PanelGroup, Panel } from 'react-bootstrap'
import { ListenerMixin } from 'reflux'
import _ from 'lodash'
import getCategoryFromPublicationId from './getCategoryFromPublicationId.js'
import PublicationsOfCategory from './publicationsOfCategory.js'
import NewPublication from './newPublication.js'

export default React.createClass({
  displayName: 'Publications',

  mixins: [ListenerMixin],

  propTypes: {
    publications: React.PropTypes.array,
    activePublication: React.PropTypes.object,
    activeCategory: React.PropTypes.number,
    categories: React.PropTypes.array,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSavePublicationArticle: React.PropTypes.func,
    onCloseNewPublication: React.PropTypes.func,
    showNewPublication: React.PropTypes.bool
  },

  getInitialState () {
    return {
      publications: [],
      categories: [],
      activeCategory: null
    }
  },

  componentDidMount () {
    this.listenTo(app.publicationStore, this.onPublicationStoreChange)
    this.listenTo(app.publicationsStore, this.onPublicationsStoreChange)
    app.Actions.getPublications()
  },

  onPublicationStoreChange (activePublication) {
    app.Actions.getPublications()
  },

  onPublicationsStoreChange (publications) {
    const { email } = this.props
    if (!email) publications = publications.filter((publication) => !publication.draft)
    const categories = this.categoriesOfPublications(publications)
    this.setState({ publications, categories })
  },

  onClickCategory (activeCategory) {
    this.setState({ activeCategory })
    // make sure no publication is loaded
    // i.e. if a publication was loaded it is unloaded
    app.Actions.getPublication(null)
  },

  categoriesOfPublications (publications) {
    const allCategories = _.map(publications, (doc) => getCategoryFromPublicationId(doc._id))
    if (allCategories.length > 0) {
      const categories = _.uniq(allCategories)
      return categories.sort()
    }
    return []
  },

  firstCategory () {
    const { categories } = this.state
    return categories[0]
  },

  categoriesComponent (activeCategory) {
    const { activePublication, editing, email, onSavePublicationArticle } = this.props
    let { publications, categories } = this.state
    if (publications.length > 0 && categories.length > 0) {
      publications = publications.sort((a, b) => {
        if (a._id < b._id) return 1
        return -1
      })
      return categories.map((category, yIndex) => {
        // wanted to only build publicationsOfCategory if isActiveYear
        // but opening a category was way to hideous
        // const isActiveYear = category === activeCategory
        return (
          <Panel key={category} header={category} eventKey={category} className='category' onClick={this.onClickCategory.bind(this, category)}>
            <PublicationsOfCategory category={category} publications={publications} activePublication={activePublication} editing={editing} email={email} onSavePublicationArticle={onSavePublicationArticle} />
          </Panel>
        )
      })
    }
    return null
  },

  render () {
    const { activePublication, showNewPublication, onCloseNewPublication } = this.props
    const { categories } = this.state
    let activeCategory
    if (_.has(activePublication, '_id')) {
      activeCategory = getCategoryFromPublicationId(activePublication._id)
    } else {
      activeCategory = this.state.activeCategory ? this.state.activeCategory : this.firstCategory()
    }
    return (
      <div id='publications'>
        <h1>Publications</h1>
        <PanelGroup activeKey={activeCategory} accordion>
          {this.categoriesComponent(activeCategory)}
        </PanelGroup>
        {showNewPublication ? <NewPublication categories={categories} onCloseNewPublication={onCloseNewPublication} /> : null}
      </div>
    )
  }
})
