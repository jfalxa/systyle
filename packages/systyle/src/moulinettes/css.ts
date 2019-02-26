import { Props } from 'moulinette/lib/types'
import { compile } from 'moulinette'

import { aliases } from './aliases'
import { applyTheme } from './theme'
import { partition, compact, isEmpty, isCSS } from '../helpers'

const partitionCSS = partition(isCSS)

export function extractCSS(input: Props) {
  const [css, props] = partitionCSS(input)
  const definedCSS = compact(css)

  if (!isEmpty(definedCSS)) {
    props.css = props.css || []
    props.css = [css, ...props.css]
  }

  return props
}

export const compileCSS = compile([extractCSS, applyTheme, aliases])
