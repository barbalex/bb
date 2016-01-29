'use strict'

import React from 'react'
import { Jumbotron } from 'react-bootstrap'

export default React.createClass({
  displayName: 'IntroJumbotron',

  render () {
    return (
      <Jumbotron className='eventsIntro'>
        <p>In 2015, Europe witnessed a mas&shy;si&shy;ve in&shy;crease in the arri&shy;val of mi&shy;grants and refu&shy;gees. Most of them had to cross the blue bor&shy;ders of the Eas&shy;tern and Cen&shy;tral Me&shy;di&shy;ter&shy;ra&shy;ne&shy;an.</p>
        <p style={{ fontSize: 19 }}><strong>The pur&shy;pose of this web&shy;site is to gain an over&shy;view by cove&shy;ring chro&shy;no&shy;lo&shy;gi&shy;cal&shy;ly both ma&shy;ri&shy;ti&shy;me and poli&shy;ti&shy;cal events.</strong></p>
        <p style={{ marginBottom: 0 }}>Maritime events in&shy;clude in&shy;for&shy;ma&shy;tion on em&shy;bar&shy;ka&shy;tion, ac&shy;ci&shy;dents, search and res&shy;cue (SAR) ope&shy;ra&shy;tions, vic&shy;tims and dis&shy;em&shy;bar&shy;ka&shy;tion. By po&shy;li&shy;ti&shy;cal events I mean the re&shy;ac&shy;tions and ac&shy;tions un&shy;der&shy;ta&shy;ken by na&shy;tio&shy;nal, re&shy;gio&shy;nal and glo&shy;bal ac&shy;tors, pub&shy;lic as well as private.</p>
      </Jumbotron>
    )
  }
})
