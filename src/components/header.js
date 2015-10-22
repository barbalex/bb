'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'Header',

  render () {
    return (
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
    )
  }
})
