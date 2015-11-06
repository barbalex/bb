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
    activePublicationCategory: React.PropTypes.string,
    editing: React.PropTypes.bool,
    email: React.PropTypes.string,
    onClickPublicationCategory: React.PropTypes.func,
    onSavePublicationArticle: React.PropTypes.func,
    onCloseNewPublication: React.PropTypes.func,
    showNewPublication: React.PropTypes.bool
  },

  componentDidMount () {
    app.Actions.getPublications()
  },

  onClickCategory (activePublicationCategory) {
    this.props.onClickPublicationCategory(activePublicationCategory)
  },

  publicationCategoriesComponent (activePublicationCategory) {
    const { publications, activePublication, editing, email, onSavePublicationArticle } = this.props
    const publicationCategories = app.publicationsStore.getPublicationCategories()

    console.log('publications.js, activePublication', activePublication)

    if (publications.length > 0 && publicationCategories.length > 0) {
      return publicationCategories.map((category, yIndex) => {
        const className = category === activePublicationCategory ? 'category active' : 'category not-active'
        // wanted to only build publicationsOfCategory if isActiveYear
        // but opening a category was way to hideous
        // const isActiveYear = category === activePublicationCategory
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
    const { activePublicationCategory, showNewPublication, onCloseNewPublication } = this.props

    console.log('publications.js, activePublicationCategory', activePublicationCategory)

    return (
      <div id='publications'>
        <h1>Publications</h1>
        <PanelGroup activeKey={activePublicationCategory} accordion>
          {this.publicationCategoriesComponent(activePublicationCategory)}
        </PanelGroup>
        {showNewPublication ? <NewPublication onCloseNewPublication={onCloseNewPublication} /> : null}
      </div>
    )
  }
})