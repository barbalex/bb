'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Navbar, NavBrand, CollapsibleNav, NavItem, NavDropdown, Nav, MenuItem, Glyphicon } from 'react-bootstrap'
import AffixWrapper from './affixWrapper.js'

export default React.createClass({
  displayName: 'Header',

  propTypes: {
    doc: React.PropTypes.object,
    editing: React.PropTypes.bool,
    onClickEdit: React.PropTypes.func
  },

  onClickPage (pageType, event) {
    event.preventDefault()
    app.Actions.getDoc(pageType)
  },

  render () {
    const { doc, editing, onClickEdit } = this.props
    console.log('navbar.js render, doc', doc)
    const glyph = editing ? 'eye-open' : 'pencil'
    const id = doc && doc._id ? doc._id : null
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
                  href='#'
                  active={id === 'pages_events' ? true : false}
                  onClick={this.onClickPage.bind(this, 'pages_events')}
                >
                  Events
                </NavItem>
                <NavItem
                  eventKey={1}
                  href='#'
                  active={id === 'pages_commentaries' ? true : false}
                  onClick={this.onClickPage.bind(this, 'pages_commentaries')}
                >
                  Commentaries
                </NavItem>
                <NavItem
                  eventKey={2}
                  href='#'
                  active={id === 'pages_sources' ? true : false}
                  onClick={this.onClickPage.bind(this, 'pages_sources')}
                >
                  Sources
                </NavItem>
                <NavItem
                  eventKey={3}
                  href='#'
                  active={id === 'pages_actors' ? true : false}
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
                    active={id === 'pages_publicationsAcademic' ? true : false}
                    onClick={this.onClickPage.bind(this, 'pages_publicationsAcademic')}
                  >
                    Academic
                  </MenuItem>
                  <MenuItem
                    eventKey='2'
                    active={id === 'pages_publicationsEu' ? true : false}
                    onClick={this.onClickPage.bind(this, 'pages_publicationsEu')}
                  >
                    European Union
                  </MenuItem>
                  <MenuItem
                    eventKey='3'
                    active={id === 'pages_publicationsIoNgo' ? true : false}
                    onClick={this.onClickPage.bind(this, 'pages_publicationsIoNgo')}
                  >
                    IO & NGO
                  </MenuItem>
                </NavDropdown>
                <NavItem
                  eventKey={5}
                  href='#'
                  active={id === 'pages_aboutUs' ? true : false}
                  onClick={this.onClickPage.bind(this, 'pages_aboutUs')}
                >
                  About us
                </NavItem>
              </Nav>
              <Nav navbar right>
                <NavItem
                  eventKey={1}
                  href='#'
                  onClick={onClickEdit}
                >
                  <Glyphicon glyph={glyph} />
                </NavItem>
              </Nav>
            </CollapsibleNav>
          </Navbar>
        </AffixWrapper>
      </div>
    )
  }
})
