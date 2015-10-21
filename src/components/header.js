'use strict'

import React from 'react'
import { Navbar, NavBrand, NavItem, NavDropdown, Nav, MenuItem } from 'react-bootstrap'

export default React.createClass({
  displayName: 'Header',

  render () {
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
        <div id='nav-wrapper' data-spy='affix' data-offset-top='150'>
          <Navbar inverse>
            <NavBrand>Home</NavBrand>
            <Nav right>
              <NavItem eventKey={1} href='#'>Events</NavItem>
              <NavItem eventKey={2} href='#'>Commentaries</NavItem>
              <NavItem eventKey={3} href='#'>Sources</NavItem>
              <NavItem eventKey={4} href='#'>Actors</NavItem>
              <NavDropdown eventKey={5} title='Publications' id='publications'>
                <MenuItem eventKey='1'>Academic</MenuItem>
                <MenuItem eventKey='2'>European Union</MenuItem>
                <MenuItem eventKey='3'>IO & NGO</MenuItem>
              </NavDropdown>
              <NavItem eventKey={6} href='#'>About us</NavItem>
            </Nav>
          </Navbar>
        </div>
      </div>
    )
  }
})
