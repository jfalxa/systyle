import { Props } from 'moulinette/lib/types'
import { compose } from 'moulinette'

import { aliases } from './aliases'
import { applyTheme } from './theme'
import { responsive } from './responsive'
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

export const compileCSS = compose([extractCSS, applyTheme, responsive, aliases])
