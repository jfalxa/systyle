import * as React from 'react'
import { createStyled, systyle } from 'systyle'
import { cx, css as emotion } from 'emotion'

const builder = (moulinette: Function) =>
  class Styled extends React.PureComponent<any, any> {
    render() {
      const {
        as: Type = 'div',
        css = [],
        className = '',
        theme = null,
        ...props
      } = moulinette(this.props) || {}

      const classNames = css.length > 0 ? emotion(css) : null
      return <Type {...props} className={cx(className, classNames)} />
    }
  }

export default createStyled(builder).with(systyle)
