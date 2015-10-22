'use strict'

import React from 'react'
import { Navbar, NavBrand, CollapsibleNav, NavItem, NavDropdown, Nav, MenuItem, Glyphicon } from 'react-bootstrap'
import AffixWrapper from './affixWrapper.js'

export default React.createClass({
  displayName: 'Header',

  propTypes: {
    editing: React.PropTypes.bool,
    onClickEdit: React.PropTypes.func
  },

  render () {
    const { editing, onClickEdit } = this.props
    const glyph = editing ? 'eye-open' : 'pencil'
    return (
      <div>
        <div className='masthead introHeader'>
          <div className='container'>
            <div className='row'>
              <div className='col-xs-9'>
                <div className='introText introTitle'>blue borders</div>
                <div className='introText'>central mediterranean</div>
              </div>
              <div className='col-xs-3'>
                <div className='pull-right introText introTextRight'>
                  <div>Italy</div>
                  <div>Malta</div>
                  <div>Tunisia</div>
                  <div>Libya</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AffixWrapper id='nav-wrapper' offset={150}>
          <Navbar inverse toggleNavKey={0}>
            <NavBrand>Home</NavBrand>
            <CollapsibleNav eventKey={0}>
              <Nav navbar>
                <NavItem eventKey={0} href='#'>Events</NavItem>
                <NavItem eventKey={1} href='#'>Commentaries</NavItem>
                <NavItem eventKey={2} href='#'>Sources</NavItem>
                <NavItem eventKey={3} href='#'>Actors</NavItem>
                <NavDropdown eventKey={4} title='Publications' id='publications'>
                  <MenuItem eventKey='1'>Academic</MenuItem>
                  <MenuItem eventKey='2'>European Union</MenuItem>
                  <MenuItem eventKey='3'>IO & NGO</MenuItem>
                </NavDropdown>
                <NavItem eventKey={5} href='#'>About us</NavItem>
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
