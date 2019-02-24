import { merge, Props } from 'moulinette'
import { cx, css as emotion } from 'emotion'

import { CSSGenProps, ElementProps, Styled } from './types'
import { partition, compact, isEmpty, template, chunk } from './helpers'
import { isCSSProperty } from './css'

export function createElement({ as: type = 'div', ...props }: ElementProps) {
  return { ...props, as: type }
}

export function generateCSS({ css, raw, className, ...props }: CSSGenProps) {
  return { ...props, className: cx(className, template(raw, props), emotion(css)) } // prettier-ignore
}

export function pickCSS(input: Props) {
  const [cssProps, props] = partition(input, isCSSProperty)
  const css = compact(merge(props.css || {}, cssProps))

  if (!isEmpty(css)) {
    props.css = css
  }

  return props
}

export function extension(Styled: Styled) {
  Styled.css = (template, ...args) =>
    Styled.with(
      chunk(({ raw = [] }) => ({
        raw: [[template, args], ...raw]
      }))
    )
}
