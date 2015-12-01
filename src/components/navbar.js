'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Navbar, NavItem, Nav, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap'
import _ from 'lodash'
import AffixWrapper from './affixWrapper.js'

export default React.createClass({
  displayName: 'Header',

  propTypes: {
    activePage: React.PropTypes.object,
    activeMonthlyEvent: React.PropTypes.object,
    activePublication: React.PropTypes.object,
    activeCommentary: React.PropTypes.object,
    activeSource: React.PropTypes.object,
    activeActor: React.PropTypes.object,
    email: React.PropTypes.string,
    editing: React.PropTypes.bool,
    onClickEdit: React.PropTypes.func,
    onClickNewCommentary: React.PropTypes.func,
    onClickNewSource: React.PropTypes.func,
    onClickNewEvent: React.PropTypes.func,
    onClickNewActor: React.PropTypes.func,
    onClickNewMonthlyEvent: React.PropTypes.func,
    onClickNewPublication: React.PropTypes.func,
    navExpanded: React.PropTypes.bool
  },

  getInitialState () {
    return {
      navExpanded: false
    }
  },

  onClickPage (id) {
    app.Actions.getPage(id)
    // if home was clicked, do not toggle nav
    if (id !== 'pages_home') this.onToggleNav()
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
    const navIsMobile = this.isNavMobile()
    // toggle only if nav is in mobile mode
    if (navIsMobile) this.setState({ navExpanded: !this.state.navExpanded })
  },

  isNavMobile () {
    const documentWidth = document.getElementById('content').clientWidth
    return documentWidth <= 750
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
    return <Tooltip id='newCommentary'>new commentary</Tooltip>
  },

  newEventTooltip () {
    return <Tooltip id='newEvent'>new event</Tooltip>
  },

  newSourceTooltip () {
    return <Tooltip id='newSource'>new source</Tooltip>
  },

  newActorTooltip () {
    return <Tooltip id='newActor'>new actor</Tooltip>
  },

  newMonthlyEventTooltip () {
    return <Tooltip id='newMonthlyEvent'>new monthly event</Tooltip>
  },

  newPublicationTooltip () {
    return <Tooltip id='newPublication'>new publication</Tooltip>
  },

  render () {
    const { activePage, activeMonthlyEvent, activePublication, activeCommentary, activeSource, activeActor, email, editing, onClickNewCommentary, onClickNewEvent, onClickNewSource, onClickNewActor, onClickNewMonthlyEvent, onClickNewPublication } = this.props
    const { navExpanded } = this.state
    const glyph = editing ? 'eye-open' : 'pencil'
    const id = activePage && activePage._id ? activePage._id : null
    const nonEditableIds = ['pages_commentaries', 'pages_sources', 'pages_monthlyEvents', 'pages_publications', 'pages_actors', 'pages_events']
    const showEdit = email && (!_.includes(nonEditableIds, id) || _.has(activeMonthlyEvent, '_id') || _.has(activeCommentary, '_id') || _.has(activeSource, '_id') || _.has(activeActor, '_id') || _.has(activePublication, '_id'))
    const showAddCommentary = email && activePage._id === 'pages_commentaries'
    const showAddEvent = email && activePage._id === 'pages_events'
    const showAddSource = email && activePage._id === 'pages_sources'
    const showAddActor = email && activePage._id === 'pages_actors'
    const showAddMonthlyEvent = email && activePage._id === 'pages_monthlyEvents'
    const showAddPublication = email && activePage._id === 'pages_publications'
    const showNavbarRight = email || showEdit || showAddCommentary || showAddEvent || showAddSource || showAddActor || showAddMonthlyEvent
    return (
      <div>
        <AffixWrapper id='nav-wrapper' offset={150}>
          <Navbar inverse expanded={navExpanded} onToggle={this.onToggleNav}>
            <Navbar.Header>
              <Navbar.Brand
                onClick={this.onClickPage.bind(this, 'pages_events')}
              >
                Home
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse eventKey={0}>
              <Nav>
                <NavItem
                  eventKey={0}
                  active={id === 'pages_sources'}
                  onClick={this.onClickPage.bind(this, 'pages_sources')}
                >
                  Sources (soon: statistics)
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
                  active={id === 'pages_actors'}
                  onClick={this.onClickPage.bind(this, 'pages_actors')}
                >
                  Actors
                </NavItem>
                <NavItem
                  eventKey={3}
                  active={id === 'pages_publications'}
                  onClick={this.onClickPage.bind(this, 'pages_publications')}
                >
                  Publications
                </NavItem>
                <NavItem
                  eventKey={4}
                  active={id === 'pages_monthlyEvents'}
                  onClick={this.onClickPage.bind(this, 'pages_monthlyEvents')}
                >
                  Archive
                </NavItem>
                <NavItem
                  eventKey={5}
                  active={id === 'pages_aboutUs'}
                  onClick={this.onClickPage.bind(this, 'pages_aboutUs')}
                >
                  About us
                </NavItem>
              </Nav>
              {
                showNavbarRight
                ? <Nav navbar pullRight>
                  {
                    showEdit
                    ? <OverlayTrigger placement='bottom' overlay={this.editTooltip()}>
                        <NavItem
                          eventKey={1}
                          onClick={this.onClickEdit}
                        >
                          <Glyphicon glyph={glyph} />
                        </NavItem>
                      </OverlayTrigger>
                    : null
                  }
                  {
                    showAddCommentary
                    ? <OverlayTrigger placement='bottom' overlay={this.newCommentaryTooltip()}>
                        <NavItem
                          eventKey={2}
                          onClick={onClickNewCommentary}
                        >
                          <Glyphicon glyph='plus' />
                        </NavItem>
                      </OverlayTrigger>
                    : null
                  }
                  {
                    showAddEvent
                    ? <OverlayTrigger placement='bottom' overlay={this.newEventTooltip()}>
                        <NavItem
                          eventKey={2}
                          onClick={onClickNewEvent}
                        >
                          <Glyphicon glyph='plus' />
                        </NavItem>
                      </OverlayTrigger>
                    : null
                  }
                  {
                    showAddSource
                    ? <OverlayTrigger placement='bottom' overlay={this.newSourceTooltip()}>
                        <NavItem
                          eventKey={3}
                          onClick={onClickNewSource}
                        >
                          <Glyphicon glyph='plus' />
                        </NavItem>
                      </OverlayTrigger>
                    : null
                  }
                  {
                    showAddActor
                    ? <OverlayTrigger placement='bottom' overlay={this.newActorTooltip()}>
                        <NavItem
                          eventKey={3}
                          onClick={onClickNewActor}
                        >
                          <Glyphicon glyph='plus' />
                        </NavItem>
                      </OverlayTrigger>
                    : null
                  }
                  {
                    showAddMonthlyEvent
                    ? <OverlayTrigger placement='bottom' overlay={this.newMonthlyEventTooltip()}>
                        <NavItem
                          eventKey={4}
                          onClick={onClickNewMonthlyEvent}
                        >
                          <Glyphicon glyph='plus' />
                        </NavItem>
                      </OverlayTrigger>
                    : null
                  }
                  {
                    showAddPublication
                    ? <OverlayTrigger placement='bottom' overlay={this.newPublicationTooltip()}>
                        <NavItem
                          eventKey={5}
                          onClick={onClickNewPublication}
                        >
                          <Glyphicon glyph='plus' />
                        </NavItem>
                      </OverlayTrigger>
                    : null
                  }
                  <OverlayTrigger placement='bottom' overlay={this.logoutTooltip()}>
                    <NavItem
                      eventKey={6}
                      onClick={this.onClickLogout}
                    >
                      <Glyphicon glyph='log-out' />
                    </NavItem>
                  </OverlayTrigger>
                </Nav>
                : null
              }
            </Navbar.Collapse>
          </Navbar>
        </AffixWrapper>
      </div>
    )
  }
})
