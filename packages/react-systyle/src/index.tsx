import * as React from 'react'
import { createStyled, systyle } from 'systyle'
import { css as emotion } from 'emotion'

const builder = (moulinette: Function) => {
  const uniqClassName = `sys-${Math.random().toString(36).slice(2)}` // prettier-ignore

  return class Styled extends React.PureComponent<any, any> {
    static toString() {
      return `.${uniqClassName}`
    }

    render() {
      const {
        as: Type = 'div',
        css = [],
        className = '',
        theme = null,
        ...props
      } = moulinette(this.props) || {}

      const computedClassName = css.length > 0 ? emotion(css) : ''
      const classNames = `${uniqClassName} ${className} ${computedClassName}`

      return <Type {...props} className={classNames.trim()} />
    }
  }
}

export default createStyled(builder).with(systyle)
