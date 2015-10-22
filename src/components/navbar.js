'use strict'

import React from 'react'
import { Navbar, NavBrand, CollapsibleNav, NavItem, NavDropdown, Nav, MenuItem, Glyphicon } from 'react-bootstrap'
import AffixWrapper from './affixWrapper.js'

export default React.createClass({
  displayName: 'Header',

  propTypes: {
    page: React.PropTypes.string,
    editing: React.PropTypes.bool,
    onClickEdit: React.PropTypes.func
  },

  render () {
    const { page, editing, onClickEdit } = this.props
    console.log('navbar.js render, page', page)
    const glyph = editing ? 'eye-open' : 'pencil'
    return (
      <div>
        <AffixWrapper id='nav-wrapper' offset={150}>
          <Navbar inverse toggleNavKey={0}>
            <NavBrand>Home</NavBrand>
            <CollapsibleNav eventKey={0}>
              <Nav navbar>
                <NavItem eventKey={0} href='#' active={page === 'events' ? 'active' : null}>Events</NavItem>
                <NavItem eventKey={1} href='#' active={page === 'commentaries' ? 'active' : null}>Commentaries</NavItem>
                <NavItem eventKey={2} href='#' active={page === 'sources' ? 'active' : null}>Sources</NavItem>
                <NavItem eventKey={3} href='#' active={page === 'actors' ? 'active' : null}>Actors</NavItem>
                <NavDropdown eventKey={4} title='Publications' id='publications'>
                  <MenuItem eventKey='1' active={page === 'publicationsAcademic' ? 'active' : null}>Academic</MenuItem>
                  <MenuItem eventKey='2' active={page === 'publicationsEu' ? 'active' : null}>European Union</MenuItem>
                  <MenuItem eventKey='3' active={page === 'publicationsIoNgo' ? 'active' : null}>IO & NGO</MenuItem>
                </NavDropdown>
                <NavItem eventKey={5} href='#' active={page === 'aboutUs' ? 'active' : null}>About us</NavItem>
              </Nav>
              <Nav navbar right>
                <NavItem eventKey={1} href='#' onClick={onClickEdit}><Glyphicon glyph={glyph} /></NavItem>
              </Nav>
            </CollapsibleNav>
          </Navbar>
        </AffixWrapper>
      </div>
    )
  }
})
