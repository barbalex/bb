/**
 * original author: Juliano Castilho <julianocomg@gmail.com>
 * https://gist.github.com/julianocomg/296469e414db1202fc86
 */
import React from 'react'
import classnames from 'classnames'

export default React.createClass({
  /**
   * @type {Object}
   */
  propTypes: {
    offset: React.PropTypes.number
  },

  /**
   * @return {Object}
   */
  getDefaultProps () {
    return {
      offset: 0
    }
  },

  /**
   * @return {Object}
   */
  getInitialState () {
    return {
      affix: false
    }
  },

  /**
   * @return {void}
   */
  handleScroll () {
    const affix = this.state.affix
    const offset = this.props.offset
    const scrollTop = document.body.scrollTop

    if (!affix && scrollTop >= offset) {
      this.setState({
        affix: true
      })
    }

    if (affix && scrollTop < offset) {
      this.setState({
        affix: false
      })
    }
  },

  /**
   * @return {void}
   */
  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
  },

  /**
   * @return {void}
   */
  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  },

  render () {
    const affix = this.state.affix ? 'affix' : ''
    const {className, offset, ...props} = this.props

    return (
      <div {...props} className={classnames(className, affix)}>
        {this.props.children}
      </div>
    )
  }

})
