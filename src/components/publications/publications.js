import app from 'ampersand-app'
import React from 'react'
import { sortBy } from 'lodash'
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
    onSavePublicationArticle: React.PropTypes.func,
    onCloseNewPublication: React.PropTypes.func,
    showNewPublication: React.PropTypes.bool
  },

  componentDidMount() {
    app.Actions.getPublications()
  },

  onClickCategory(activePublicationCategory) {
    // console.log('category clicked:', activePublicationCategory)
    app.Actions.setPublicationCategory(activePublicationCategory)
  },

  publicationCategoriesComponent(activePublicationCategory) {
    const {
      publications,
      activePublication,
      editing,
      email,
      onSavePublicationArticle
    } = this.props
    let publicationCategories = app.publicationsStore.getPublicationCategories()

    if (publications.length > 0 && publicationCategories.length > 0) {
      publicationCategories = sortBy(publicationCategories, (cat) => {
        const orderByCategory = {
          Academic: 3,
          'European Union': 1,
          'IOs & NGOs': 2
        }
        let order = orderByCategory[cat]
        if (!order) order = 4
        return order
      })
      return publicationCategories.map((category) => {
        // deactivated when changed to showing open list:
        // const className = (
        //   category === activePublicationCategory ?
        //   'panel panel-default category active' :
        //   'panel panel-default category not-active'
        // )
        return (
          <div
            key={category}
            className="panel panel-default category active"
            onClick={this.onClickCategory.bind(this, category)}
          >
            <div
              className="panel-heading"
              role="tab"
              id={`heading${category}`}
            >
              <h4 className="panel-title">
                <a
                  className="collapsed"
                  role="button"
                  data-toggle="collapse"
                  data-parent="#publicationsAccordion"
                  href={`#${category}`}
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  {category}
                </a>
              </h4>
            </div>
            <PublicationsOfCategory
              category={category}
              publications={publications}
              activePublication={activePublication}
              editing={editing}
              email={email}
              onSavePublicationArticle={onSavePublicationArticle}
            />
          </div>
        )
      })
    }
    return null
  },

  render() {
    const {
      activePublicationCategory,
      showNewPublication,
      onCloseNewPublication
    } = this.props
    const divStyle = {
      marginBottom: 20
    }

    return (
      <div
        id="publications"
        style={divStyle}
      >
        <h1>
          Publications
        </h1>
        <div
          className="panel-group"
          id="publicationsAccordion"
          role="tablist"
        >
          {this.publicationCategoriesComponent(activePublicationCategory)}
        </div>
        {
          showNewPublication &&
          <NewPublication
            onCloseNewPublication={onCloseNewPublication}
          />
        }
      </div>
    )
  }
})
