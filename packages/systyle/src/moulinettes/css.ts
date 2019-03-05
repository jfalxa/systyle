import { Props } from 'moulinette/lib/types'
import { compose } from 'moulinette'

import { aliases } from './aliases'
import { applyTheme } from './theme'
import { responsive } from './responsive'
import { partition, compact, isEmpty, isCSS } from '../helpers'

const partitionCSS = partition(isCSS)

export function extractCSS({ css: nextCSS = [], ...input }: Props) {
  const [cssProps, props] = partitionCSS(input)

  const definedCSS = compact(cssProps)
  const nextCSSList = Array.isArray(nextCSS) ? nextCSS : [nextCSS]
  const css = isEmpty(definedCSS) ? nextCSSList : [definedCSS, ...nextCSSList]

  return css.length > 0 ? { ...props, css } : props
}

export const compileCSS = compose([extractCSS, applyTheme, responsive, aliases])
