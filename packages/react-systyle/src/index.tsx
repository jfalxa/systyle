/** @jsx jsx */

import * as React from 'react'
import createStyled from 'systyle'
import { jsx, ThemeContext } from '@emotion/core'

const uid = () => Math.random().toString(36).slice(2) // prettier-ignore

const builder = (moulinette: Function) =>
  class Styled extends React.PureComponent<any, any> {
    static contextType = ThemeContext
    static className = `s${uid()}`
    static toString = () => `.${Styled.className}`

    render() {
      const {
        as: Type = 'div',
        css = null,
        domRef = null,
        theme = null,
        ...props
      } = moulinette({ ...this.props, theme: this.context }) || {}

      const className = props.className
        ? [Styled.className, props.className].join(' ')
        : Styled.className

      return <Type {...props} ref={domRef} className={className} css={css} />
    }
  }

export default createStyled(builder)
