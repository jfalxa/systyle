import { Props, Moulinette } from 'moulinette/lib/types'
import { CSSTemplate } from '../types'
import { compileCSS } from './css'

export function stringify(
  strings: CSSTemplate[0],
  args: CSSTemplate[1],
  props: Props
): string {
  const computed = args.map(arg =>
    typeof arg === 'function' ? arg(props) : arg
  )

  return strings.reduce(
    (template, string, i) =>
      template + string + (i in computed ? computed[i] : ''),
    ''
  )
}

export function addTemplate(
  strings: CSSTemplate[0],
  args: CSSTemplate[1]
): Moulinette {
  return input => {
    const { css = [], ...props } = compileCSS(input) || {}
    const str = stringify(strings, args, props)
    return { ...props, css: [str, ...css] }
  }
}
