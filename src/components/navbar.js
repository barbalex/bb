'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Navbar, NavBrand, CollapsibleNav, NavItem, NavDropdown, Nav, MenuItem, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap'
import _ from 'lodash'
import AffixWrapper from './affixWrapper.js'

export default React.createClass({
  displayName: 'Header',

  propTypes: {
    activePage: React.PropTypes.object,
    activeMonthlyEvent: React.PropTypes.object,
    activePublication: React.PropTypes.object,
    commentary: React.PropTypes.object,
    email: React.PropTypes.string,
    editing: React.PropTypes.bool,
    onClickEdit: React.PropTypes.func,
    onClickNewCommentary: React.PropTypes.func,
    onClickNewMonthlyEvent: React.PropTypes.func,
    onClickNewPublication: React.PropTypes.func,
    navExpanded: React.PropTypes.bool
  },

  getInitialState () {
    return {
      navExpanded: false
    }
  },

  onClickPage (pageType) {
    app.Actions.getPage(pageType)
    this.onToggleNav()
  },

  onClickEdit () {
    const { onClickEdit } = this.props
    onClickEdit()
    this.onToggleNav()
  },

  onClickLogout () {
    app.Actions.logout()
    this.onToggleNav()
  },

  onToggleNav () {
    this.setState({ navExpanded: !this.state.navExpanded})
  },

  logoutTooltip () {
    return <Tooltip id='logout'>log out</Tooltip>
  },

  editTooltip () {
    const { editing } = this.props
    const text = editing ? 'preview' : 'edit'
    return <Tooltip id={text}>{text}</Tooltip>
  },

  newCommentaryTooltip () {
    return <Tooltip id='newCommentary'>new Commentary</Tooltip>
  },

  newMonthlyEventTooltip () {
    return <Tooltip id='newMonthlyEvent'>new monthly event</Tooltip>
  },

  newPublicationTooltip () {
    return <Tooltip id='newPublication'>new publication</Tooltip>
  },

  render () {
    const { activePage, activeMonthlyEvent, activePublication, commentary, email, editing, onClickNewCommentary, onClickNewMonthlyEvent, onClickNewPublication } = this.props
    const { navExpanded } = this.state
    const glyph = editing ? 'eye-open' : 'pencil'
    const id = activePage && activePage._id ? activePage._id : null
    const nonEditableIds = ['pages_commentaries', 'pages_monthlyEvents', 'pages_publications']
    const showEdit = email && (!_.includes(nonEditableIds, id) || _.has(activeMonthlyEvent, '_id') || _.has(commentary, '_id') || _.has(activePublication, '_id'))
    const showAddCommentary = email && activePage._id === 'pages_commentaries'
    const showAddMonthlyEvent = email && activePage._id === 'pages_monthlyEvents'
    const showAddPublication = email && activePage._id === 'pages_publications'
    const showNavbarRight = email || showEdit || showAddCommentary || showAddMonthlyEvent
    return (
      <div>
        <AffixWrapper id='nav-wrapper' offset={150}>
          <Navbar inverse toggleNavKey={0} navExpanded={navExpanded} onToggle={this.onToggleNav}>
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
                <NavItem
                  eventKey={4}
                  active={id === 'pages_publications'}
                  onClick={this.onClickPage.bind(this, 'pages_publications')}
                >
                  Publications
                </NavItem>
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
                    <OverlayTrigger placement='bottom' overlay={this.editTooltip()}>
                      <NavItem
                        eventKey={1}
                        onClick={this.onClickEdit}
                      >
                        <Glyphicon glyph={glyph} />
                      </NavItem>
                    </OverlayTrigger>
                    : null
                  }
                  {showAddCommentary ?
                    <OverlayTrigger placement='bottom' overlay={this.newCommentaryTooltip()}>
                      <NavItem
                        eventKey={2}
                        onClick={onClickNewCommentary}
                      >
                        <Glyphicon glyph='plus' />
                      </NavItem>
                    </OverlayTrigger>
                    : null
                  }
                  {showAddMonthlyEvent ?
                    <OverlayTrigger placement='bottom' overlay={this.newMonthlyEventTooltip()}>
                      <NavItem
                        eventKey={3}
                        onClick={onClickNewMonthlyEvent}
                      >
                        <Glyphicon glyph='plus' />
                      </NavItem>
                    </OverlayTrigger>
                    : null
                  }
                  {showAddPublication ?
                    <OverlayTrigger placement='bottom' overlay={this.newPublicationTooltip()}>
                      <NavItem
                        eventKey={4}
                        onClick={onClickNewPublication}
                      >
                        <Glyphicon glyph='plus' />
                      </NavItem>
                    </OverlayTrigger>
                    : null
                  }
                  <OverlayTrigger placement='bottom' overlay={this.logoutTooltip()}>
                    <NavItem
                      eventKey={5}
                      onClick={this.onClickLogout}
                    >
                      <Glyphicon glyph='log-out' />
                    </NavItem>
                  </OverlayTrigger>
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
