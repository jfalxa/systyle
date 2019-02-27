import { Props } from 'moulinette/lib/types'
import { merge } from 'moulinette'

import { Theme } from '../types'
import { theme } from './theme'
import { isObject, partition } from '../helpers'

function isNumber(key: string | number) {
  return typeof key === 'number' || !isNaN(Number(key))
}

function isResponsive(breakpoints: Theme['breakpoints']) {
  return (value: any) =>
    isObject(value) && Object.keys(value).every(key => key in breakpoints)
}

export function mediaQuery(
  key: string,
  breakpoints: Theme['breakpoints'] = {}
): string {
  const value = key in breakpoints ? breakpoints[key] : key

  if (typeof value === 'string' && value.startsWith('@media')) {
    return value
  }

  const breakpoint = isNumber(value) ? value + 'px' : value
  return `@media screen and (min-width: ${breakpoint})`
}

export function responsive(input: Props) {
  const breakpoints = theme(input, 'breakpoints')
  const [responsive, props] = partition(isResponsive(breakpoints))(input)

  const mediaQueries = Object.keys(responsive)
    .map(key =>
      Object.keys(responsive[key])
        .map(bp => ({
          [mediaQuery(bp, breakpoints)]: {
            [key]: responsive[key][bp]
          }
        }))
        .reduce(merge, {})
    )
    .reduce(merge, {})

  return merge(props, mediaQueries)
}
