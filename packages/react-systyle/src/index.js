/** @jsx jsx */

import React from 'react'
import createStyled from 'systyle'
import { jsx, ThemeContext } from '@emotion/core'

const builder = moulinette => {
  class Styled extends React.PureComponent {
    render() {
      const { domRef = null, ...input } = { ...this.props, theme: this.context } // prettier-ignore
      const { as: Type = 'div', css = null, theme = null, ...props } = moulinette(input) || {} // prettier-ignore

      return <Type {...props} ref={domRef} css={css} />
    }
  }

  Styled.contextType = ThemeContext

  const RefStyled = React.forwardRef((props, ref) =>
    React.createElement(Styled, { ...props, domRef: ref })
  )

  return RefStyled
}

export default createStyled(builder)
