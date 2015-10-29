'use strict'

import app from 'ampersand-app'
import React from 'react'
import { Navbar, NavBrand, CollapsibleNav, NavItem, NavDropdown, Nav, MenuItem, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap'
import _ from 'lodash'
import AffixWrapper from './affixWrapper.js'

export default React.createClass({
  displayName: 'Header',

  propTypes: {
    doc: React.PropTypes.object,
    monthlyEvent: React.PropTypes.object,
    commentary: React.PropTypes.object,
    email: React.PropTypes.string,
    editing: React.PropTypes.bool,
    onClickEdit: React.PropTypes.func,
    onClickNewCommentary: React.PropTypes.func,
    onClickNewMonthlyEvent: React.PropTypes.func
  },

  onClickPage (pageType) {
    const onlyLoadOtherIds = pageType === 'pages_monthlyEvents'
    app.Actions.getPage(pageType, onlyLoadOtherIds)
  },

  onClickLogout () {
    app.Actions.logout()
  },

  logoutTooltip () {
    return (<Tooltip id='logout'>log out</Tooltip>)
  },

  editTooltip () {
    const { editing } = this.props
    const text = editing ? 'preview' : 'edit'
    return (<Tooltip id={text}>{text}</Tooltip>)
  },

  newCommentaryTooltip () {
    return (<Tooltip id='newCommentary'>new Commentary</Tooltip>)
  },

  newMonthlyEventTooltip () {
    return (<Tooltip id='newMonthlyEvent'>new monthly event</Tooltip>)
  },

  render () {
    const { doc, monthlyEvent, commentary, email, editing, onClickEdit, onClickNewCommentary, onClickNewMonthlyEvent } = this.props
    const glyph = editing ? 'eye-open' : 'pencil'
    const id = doc && doc._id ? doc._id : null
    const nonEditableIds = ['pages_commentaries', 'pages_monthlyEvents']
    const showEdit = email && (!_.includes(nonEditableIds, id) || _.has(monthlyEvent, '_id') || _.has(commentary, '_id'))
    const showAddCommentary = email && doc._id === 'pages_commentaries'
    const showAddMonthlyEvent = email && doc._id === 'pages_monthlyEvents'
    const showNavbarRight = email || showEdit || showAddCommentary || showAddMonthlyEvent
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
                    <OverlayTrigger placement='bottom' overlay={this.editTooltip()}>
                      <NavItem
                        eventKey={1}
                        onClick={onClickEdit}
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
                  <OverlayTrigger placement='bottom' overlay={this.logoutTooltip()}>
                    <NavItem
                      eventKey={4}
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
