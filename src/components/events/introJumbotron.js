/**
 * can't convert to es6 function because this is referenced
 */

import React from 'react'
import { Jumbotron } from 'react-bootstrap'

export default React.createClass({
  displayName: 'IntroJumbotron',

  render() {
    return (
      <Jumbotron
        className="eventsIntro"
        style={{
          hyphens: 'manual'
        }}
      >
        <p style={{ marginBottom: 0 }}>
          Most mi&shy;grants and re&shy;fu&shy;gees ar&shy;ri&shy;ving in Eu&shy;ro&shy;pe
          cross the blue bor&shy;­ders of the Eas&shy;­tern and Cen&shy;­tral Me­diterrane­an.
          The flow is massive and high&shy;ly com&shy;plex. This web&shy;­si&shy;te provides a
          rough over&shy;­view by co&shy;ve&shy;­ring chro&shy;­no&shy;­lo&shy;­gi&shy;­cal&shy;­ly
          both ma­ri&shy;­ti­me and political events.
        </p>
      </Jumbotron>
    )
  }
})
