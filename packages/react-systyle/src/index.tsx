/** @jsx jsx */
import * as React from 'react'
import { createStyled, systyle } from 'systyle'
import { jsx } from '@emotion/core'

function uniqClassName() {
  return `sys-${Math.random()
    .toString(36)
    .slice(2)}`
}

const builder = (moulinette: Function) =>
  class Styled extends React.PureComponent<any, any> {
    static className = uniqClassName()

    render() {
      const { as: Type = 'div', css = [], theme = null, ...props } =
        moulinette(this.props) || {}

      const className = [Styled.className, props.className]
        .filter(Boolean)
        .join(' ')

      return <Type {...props} className={className} css={css} />
    }
  }

export default createStyled(builder).with(systyle)
