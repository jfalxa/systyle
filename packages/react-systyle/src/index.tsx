/** @jsx jsx */

import * as React from 'react'
import createStyled from 'systyle'
import { jsx } from '@emotion/core'

const uid = () => Math.random().toString(36).slice(2) // prettier-ignore

const builder = (moulinette: Function) =>
  class Styled extends React.PureComponent<any, any> {
    static className = `s${uid()}`

    static toString = () => `.${Styled.className}`

    render() {
      const { as: Type = 'div', css = null, theme = null, ...props } =
        moulinette(this.props) || {}

      const className = props.className
        ? [Styled.className, props.className].join(' ')
        : Styled.className

      return <Type {...props} className={className} css={css} />
    }
  }

export default createStyled(builder)
