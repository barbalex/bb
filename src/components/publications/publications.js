'use strict'

import app from 'ampersand-app'
import React from 'react'
import { PanelGroup, Panel } from 'react-bootstrap'
import PublicationsOfCategory from './publicationsOfCategory.js'
import NewPublication from './newPublication.js'

export default React.createClass({
  displayName: 'Publications',

  propTypes: {
    publications: React.PropTypes.array,
    activePublication: React.PropTypes.object,
    activeCategory: React.PropTypes.number,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onSavePublicationArticle: React.PropTypes.func,
    onCloseNewPublication: React.PropTypes.func,
    showNewPublication: React.PropTypes.bool
  },

  getInitialState () {
    return {
      activeCategory: null
    }
  },

  componentDidMount () {
    app.Actions.getPublications()
  },

  onClickCategory (activeCategory) {
    this.setState({ activeCategory })
    // make sure no publication is loaded
    // i.e. if a publication was loaded it is unloaded
    app.Actions.getPublication(null)
  },

  publicationCategoriesComponent (activeCategory) {
    const { publications, activePublication, editing, email, onSavePublicationArticle } = this.props
    const publicationCategories = app.publicationsStore.getPublicationCategories()
    if (publications.length > 0 && publicationCategories.length > 0) {
      return publicationCategories.map((category, yIndex) => {
        const className = category === activeCategory ? 'category active' : 'category not-active'
        // wanted to only build publicationsOfCategory if isActiveYear
        // but opening a category was way to hideous
        // const isActiveYear = category === activeCategory
        return (
          <Panel key={category} header={category} eventKey={category} className={className} onClick={this.onClickCategory.bind(this, category)}>
            <PublicationsOfCategory category={category} publications={publications} activePublication={activePublication} editing={editing} email={email} onSavePublicationArticle={onSavePublicationArticle} />
          </Panel>
        )
      })
    }
    return null
  },

  render () {
    const { showNewPublication, onCloseNewPublication } = this.props
    const { activeCategory } = this.state
    return (
      <div id='publications'>
        <h1>Publications</h1>
        <PanelGroup activeKey={activeCategory} accordion>
          {this.publicationCategoriesComponent(activeCategory)}
        </PanelGroup>
        {showNewPublication ? <NewPublication onCloseNewPublication={onCloseNewPublication} /> : null}
      </div>
    )
  }
})
