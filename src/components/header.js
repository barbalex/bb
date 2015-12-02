'use strict'

import React from 'react'

export default React.createClass({
  displayName: 'Header',

  render () {
    return (
      <div className='masthead introHeader'>
        <div className='container'>
          <div className='row'>
            <div className='col-xs-12 manualHyphens'>
              <div className='introText introTitle'>blue borders</div>
              <div className='introText'>central & eastern mediterranean</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
