import { merge, Props } from 'moulinette'
import { cx, css as emotion, Interpolation } from 'emotion'
import { partition, compact, isEmpty, pick } from './helpers'
import { isCSSProperty } from './css'

type CSSGenProps = Props & {
  css?: Interpolation
  className?: string
}

type ElementProps = Props & {
  as?: string | Function
}

export function createElement({ as: type = 'div', ...props }: ElementProps) {
  return { ...props, as: type }
}

export function generateCSS({ css, className, ...props }: CSSGenProps) {
  return { ...props, className: cx(className, emotion(css)) }
}

export function pickCSS(input: Props) {
  const [cssProps, props] = partition(input, isCSSProperty)
  const css = compact(merge(props.css || {}, cssProps))

  if (!isEmpty(css)) {
    props.css = css
  }

  return props
}
