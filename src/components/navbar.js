'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Navbar, NavBrand, CollapsibleNav, NavItem, NavDropdown, Nav, MenuItem, Glyphicon } from 'react-bootstrap'
import _ from 'lodash'
import AffixWrapper from './affixWrapper.js'

export default React.createClass({
  displayName: 'Header',

  propTypes: {
    doc: React.PropTypes.object,
    event: React.PropTypes.object,
    email: React.PropTypes.string,
    editing: React.PropTypes.bool,
    onClickEdit: React.PropTypes.func,
    onClickNewCommentary: React.PropTypes.func
  },

  onClickPage (pageType) {
    const onlyLoadOtherIds = pageType === 'pages_monthlyEvents'
    app.Actions.getPage(pageType, onlyLoadOtherIds)
  },

  render () {
    const { doc, event, email, editing, onClickEdit, onClickNewCommentary } = this.props
    const glyph = editing ? 'eye-open' : 'pencil'
    const id = doc && doc._id ? doc._id : null
    const nonEditableIds = ['pages_commentaries', 'pages_monthlyEvents']
    const showEdit = email && (!_.includes(nonEditableIds, id) || _.has(event, '_id'))
    const showAddCommentary = email && doc._id === 'pages_commentaries'
    const showNavbarRight = showEdit || showAddCommentary
    return (
      <div>
        <AffixWrapper id='nav-wrapper' offset={150}>
          <Navbar inverse toggleNavKey={0}>
            <NavBrand
              onClick={this.onClickPage.bind(this, 'pages_home')}
            >
              Home
            </NavBrand>
            <CollapsibleNav eventKey={0}>
              <Nav navbar>
                <NavItem
                  eventKey={0}
                  active={id === 'pages_monthlyEvents'}
                  onClick={this.onClickPage.bind(this, 'pages_monthlyEvents')}
                >
                  Events
                </NavItem>
                <NavItem
                  eventKey={1}
                  active={id === 'pages_commentaries'}
                  onClick={this.onClickPage.bind(this, 'pages_commentaries')}
                >
                  Commentaries
                </NavItem>
                <NavItem
                  eventKey={2}
                  active={id === 'pages_sources'}
                  onClick={this.onClickPage.bind(this, 'pages_sources')}
                >
                  Sources
                </NavItem>
                <NavItem
                  eventKey={3}
                  active={id === 'pages_actors'}
                  onClick={this.onClickPage.bind(this, 'pages_actors')}
                >
                  Actors
                </NavItem>
                <NavDropdown
                  eventKey={4}
                  title='Publications'
                  id='publications'
                >
                  <MenuItem
                    eventKey='1'
                    active={id === 'pages_academic-publications'}
                    onClick={this.onClickPage.bind(this, 'pages_academic-publications')}
                  >
                    Academic
                  </MenuItem>
                  <MenuItem
                    eventKey='2'
                    active={id === 'pages_european-union-publications'}
                    onClick={this.onClickPage.bind(this, 'pages_european-union-publications')}
                  >
                    European Union
                  </MenuItem>
                  <MenuItem
                    eventKey='3'
                    active={id === 'pages_io-and-ngo-publications'}
                    onClick={this.onClickPage.bind(this, 'pages_io-and-ngo-publications')}
                  >
                    IO & NGO
                  </MenuItem>
                </NavDropdown>
                <NavItem
                  eventKey={5}
                  active={id === 'pages_aboutUs'}
                  onClick={this.onClickPage.bind(this, 'pages_aboutUs')}
                >
                  About us
                </NavItem>
              </Nav>
              {showNavbarRight ?
                <Nav navbar right>
                  {showEdit ?
                    <NavItem
                      eventKey={1}
                      onClick={onClickEdit}
                    >
                      <Glyphicon glyph={glyph} />
                    </NavItem>
                    : null
                  }
                  {showAddCommentary ?
                    <NavItem
                      eventKey={2}
                      onClick={onClickNewCommentary}
                    >
                      <Glyphicon glyph='plus' />
                    </NavItem>
                    : null
                  }
                </Nav>
                : null
              }
            </CollapsibleNav>
          </Navbar>
        </AffixWrapper>
      </div>
    )
  }
})
