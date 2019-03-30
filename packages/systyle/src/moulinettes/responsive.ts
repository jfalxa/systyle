import { Theme, Props } from '../types'

import { merge } from '../moulinette'
import { isObject, partition } from './helpers'
import { theme } from './theme'

function isNumber(key: string | number) {
  return typeof key === 'number' || !isNaN(Number(key))
}

function isResponsive(breakpoints: Theme['breakpoints']) {
  return (value: any, key: string) =>
    isObject(value) && isObject(breakpoints) && key in breakpoints
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

  const mediaQueries = Object.keys(responsive).map(key => ({
    [mediaQuery(key, breakpoints)]: responsive[key]
  }))

  return mediaQueries.reduce(merge, props)
}
