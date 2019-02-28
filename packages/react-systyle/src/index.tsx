import * as React from 'react'
import { createStyled, systyle } from 'systyle'
import { css as emotion } from 'emotion'

function uniqClassName() {
  return `sys-${Math.random()
    .toString(36)
    .slice(2)}`
}

const builder = (moulinette: Function) =>
  class Styled extends React.PureComponent<any, any> {
    static className = uniqClassName()

    render() {
      const {
        as: Type = 'div',
        css = [],
        className = '',
        theme = null,
        ...props
      } = moulinette(this.props) || {}

      const computedClassName = css.length > 0 ? emotion(css) : ''
      const classNames = `${Styled.className} ${className} ${computedClassName}`

      return <Type {...props} className={classNames.trim()} />
    }
  }

export default createStyled(builder).with(systyle)
