'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Navbar, NavBrand, CollapsibleNav, NavItem, Nav, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap'
import _ from 'lodash'
import AffixWrapper from './affixWrapper.js'

export default React.createClass({
  displayName: 'Header',

  propTypes: {
    activePage: React.PropTypes.object,
    activeMonthlyEvent: React.PropTypes.object,
    activePublication: React.PropTypes.object,
    activeCommentary: React.PropTypes.object,
    activeSourceCategory: React.PropTypes.object,
    activeActorCategory: React.PropTypes.object,
    email: React.PropTypes.string,
    editing: React.PropTypes.bool,
    onClickEdit: React.PropTypes.func,
    onClickNewCommentary: React.PropTypes.func,
    onClickNewSourceCategory: React.PropTypes.func,
    onClickNewActorCategory: React.PropTypes.func,
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
    if (navIsMobile) this.setState({ navExpanded: !this.state.navExpanded})
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

  newSourceCategoryTooltip () {
    return <Tooltip id='newSourceCategory'>new source category</Tooltip>
  },

  newActorCategoryTooltip () {
    return <Tooltip id='newActorCategory'>new actor category</Tooltip>
  },

  newMonthlyEventTooltip () {
    return <Tooltip id='newMonthlyEvent'>new monthly event</Tooltip>
  },

  newPublicationTooltip () {
    return <Tooltip id='newPublication'>new publication</Tooltip>
  },

  render () {
    const { activePage, activeMonthlyEvent, activePublication, activeCommentary, activeSourceCategory, activeActorCategory, email, editing, onClickNewCommentary, onClickNewSourceCategory, onClickNewActorCategory, onClickNewMonthlyEvent, onClickNewPublication } = this.props
    const { navExpanded } = this.state
    const glyph = editing ? 'eye-open' : 'pencil'
    const id = activePage && activePage._id ? activePage._id : null
    const nonEditableIds = ['pages_commentaries', 'pages_sources', 'pages_monthlyEvents', 'pages_publications', 'pages_actors']
    const showEdit = email && (!_.includes(nonEditableIds, id) || _.has(activeMonthlyEvent, '_id') || _.has(activeCommentary, '_id') || _.has(activeSourceCategory, '_id') || _.has(activeActorCategory, '_id') || _.has(activePublication, '_id'))
    const showAddCommentary = email && activePage._id === 'pages_commentaries'
    const showAddSourceCategory = email && activePage._id === 'pages_sources'
    const showAddActorCategory = email && activePage._id === 'pages_actors'
    const showAddMonthlyEvent = email && activePage._id === 'pages_monthlyEvents'
    const showAddPublication = email && activePage._id === 'pages_publications'
    const showNavbarRight = email || showEdit || showAddCommentary || showAddSourceCategory || showAddActorCategory || showAddMonthlyEvent
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
                  {showAddSourceCategory ?
                    <OverlayTrigger placement='bottom' overlay={this.newSourceCategoryTooltip()}>
                      <NavItem
                        eventKey={3}
                        onClick={onClickNewSourceCategory}
                      >
                        <Glyphicon glyph='plus' />
                      </NavItem>
                    </OverlayTrigger>
                    : null
                  }
                  {showAddActorCategory ?
                    <OverlayTrigger placement='bottom' overlay={this.newActorCategoryTooltip()}>
                      <NavItem
                        eventKey={3}
                        onClick={onClickNewActorCategory}
                      >
                        <Glyphicon glyph='plus' />
                      </NavItem>
                    </OverlayTrigger>
                    : null
                  }
                  {showAddMonthlyEvent ?
                    <OverlayTrigger placement='bottom' overlay={this.newMonthlyEventTooltip()}>
                      <NavItem
                        eventKey={4}
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
            </CollapsibleNav>
          </Navbar>
        </AffixWrapper>
      </div>
    )
  }
})
