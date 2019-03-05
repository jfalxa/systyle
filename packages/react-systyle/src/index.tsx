/** @jsx jsx */

import * as React from 'react'
import createStyled from 'systyle'
import { jsx, ThemeContext } from '@emotion/core'

const uid = () => Math.random().toString(36).slice(2) // prettier-ignore

const builder = (moulinette: Function) => {
  class Styled extends React.PureComponent<any, any> {
    static contextType = ThemeContext

    render() {
      const { domRef = null, ...input } = {
        ...this.props,
        theme: this.context
      }

      const { as: Type = 'div', css = null, theme = null, ...props } =
        moulinette(input) || {}

      const className = props.className
        ? [props.className, RefStyled.className].join(' ')
        : RefStyled.className

      return <Type {...props} ref={domRef} className={className} css={css} />
    }
  }

  const RefStyled: any = React.forwardRef((props, ref) =>
    React.createElement(Styled, { ...props, domRef: ref })
  )

  RefStyled.className = `s${uid()}`
  RefStyled.toString = () => `.${RefStyled.className}`

  return RefStyled
}

export default createStyled(builder)
