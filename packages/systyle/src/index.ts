import { merge, Props } from 'moulinette'
import { cx, css as emotion, Interpolation, css } from 'emotion'

import { Styled, CSSGenProps, ElementProps, ClassProps } from './types'
import { partition, compact, isEmpty, isTemplate, computeArgs } from './helpers'
import { isCSS } from './css'

export function createElement({ as: type = 'div', ...props }: ElementProps) {
  return { ...props, as: type }
}

export function combineClasses({ className, classList, ...props }: ClassProps) {
  return { ...props, className: cx(classList) }
}

export function generateCSS({ css = [], ...props }: CSSGenProps) {
  const classList = css.map(declaration =>
    isTemplate(declaration)
      ? emotion(declaration[0], ...computeArgs(declaration[1], props))
      : emotion(declaration as Interpolation)
  )

  return { ...props, classList }
}

export function groupCSS(input: Props) {
  const [css, props] = partition(input, isCSS)
  const definedCSS = compact(css)

  if (!isEmpty(definedCSS)) {
    props.css = props.css || []
    props.css = [definedCSS, ...props.css]
  }

  return props
}

function isResponsive(value: any, prop: string, { breakpoints = {} }: Props) {
  return isCSS(value, prop) && value !== null && typeof value === 'object'
    ? Object.keys(value).every(key => key in breakpoints)
    : false
}

export function responsive(input: Props) {
  const [resp, { breakpoints = {}, ...props }] = partition(input, isResponsive)

  const mediaQueries = Object.keys(resp).reduce((mqs, key) => {
    const keyMqs: Props = {}
    Object.keys(resp[key]).forEach(bp => (keyMqs[breakpoints[bp]] = { [key]: resp[key][bp] })) // prettier-ignore
    return merge(mqs, keyMqs)
  }, {})

  return { ...props, ...mediaQueries }
}

export function extension(Styled: Styled) {
  Styled.css = (template, ...args) =>
    Styled.with(input => {
      const { css = [], ...props } = groupCSS(input)
      return { ...props, css: [[template, args], ...css] }
    })
}
