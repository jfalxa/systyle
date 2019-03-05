/** @jsx jsx */

import * as React from 'react'
import createStyled from 'systyle'
import { jsx, ThemeContext } from '@emotion/core'

const uid = () => Math.random().toString(36).slice(2) // prettier-ignore

const builder = (moulinette: Function) => {
  class Styled extends React.PureComponent<any, any> {
    static contextType = ThemeContext

    render() {
      const {
        as: Type = 'div',
        css = null,
        theme: _ = null,
        fwdRef = null,
        ...props
      } = moulinette({ ...this.props, theme: this.context }) || {}

      const className = props.className
        ? [RefStyled.className, props.className].join(' ')
        : RefStyled.className

      return <Type {...props} ref={fwdRef} className={className} css={css} />
    }
  }

  const RefStyled: any = React.forwardRef((props, ref) => (
    <Styled {...props} fwdRef={ref} />
  ))

  RefStyled.className = `s${uid()}`
  RefStyled.toString = () => `.${RefStyled.className}`

  return RefStyled
}

export default createStyled(builder)
