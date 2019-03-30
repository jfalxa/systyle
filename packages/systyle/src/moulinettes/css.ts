import { Props } from '../types'

import { partition, compact, isEmpty, isCSS } from './helpers'

const partitionCSS = partition(isCSS)

export function extractCSS({ css: nextCSS = [], ...input }: Props) {
  const [cssProps, props] = partitionCSS(input)

  const definedCSS = compact(cssProps)
  const nextCSSList = Array.isArray(nextCSS) ? nextCSS : [nextCSS]
  const css = isEmpty(definedCSS) ? nextCSSList : [definedCSS, ...nextCSSList]

  return css.length > 0 ? { ...props, css } : props
}
