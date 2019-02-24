import { Props, Moulinette } from 'moulinette'
import { css as emotion } from 'emotion'

import { By, CSSTemplate } from './types'

export function isEmpty(value: any) {
  return value === null || (typeof value === 'object' && Object.keys(value).length === 0) // prettier-ignore
}

export function partition(props: Props, by: By) {
  const match: Props = {}
  const rest: Props = {}

  Object.keys(props).forEach(key => {
    const value = props[key]

    if (by(value, key)) {
      match[key] = value
    } else {
      rest[key] = value
    }
  })

  return [match, rest]
}

export function compact(props: Props) {
  return partition(props, isEmpty)[1]
}

export function chunk(moulinette: Moulinette): Moulinette {
  return props => ({ ...props, ...moulinette(props) })
}

export function computeArgs(args: CSSTemplate[1], props: Props) {
  return args.map((arg: any) => (typeof arg === 'function' ? arg(props) : arg))
}

export function template(raw: CSSTemplate[] = [], props: Props) {
  return raw.map(([template, args]) =>
    emotion(template, ...computeArgs(args, props))
  )
}
