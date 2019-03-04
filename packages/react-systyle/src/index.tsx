/** @jsx jsx */

import * as React from 'react'
import createStyled from 'systyle'
import { jsx, ThemeContext } from '@emotion/core'

const uid = () => Math.random().toString(36).slice(2) // prettier-ignore

const builder = (moulinette: Function) =>
  class Styled extends React.PureComponent<any, any> {
    static className = `s${uid()}`

    static toString = () => `.${Styled.className}`

    render() {
      return (
        <ThemeContext.Consumer>
          {theme => {
            const { as: Type = 'div', css = null, theme: _ = null, ...props } =
              moulinette({ ...this.props, theme }) || {}

            const className = props.className
              ? [Styled.className, props.className].join(' ')
              : Styled.className

            return <Type {...props} className={className} css={css} />
          }}
        </ThemeContext.Consumer>
      )
    }
  }

export default createStyled(builder)
