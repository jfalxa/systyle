import { Props } from 'moulinette/lib/types'
import { By } from './types'

const rxRules = /^(\&|\@|\:|\#|\.)/

export function isCSS(_: any, key: string) {
  return rxRules.test(key) || key in document.body.style
}

export function isEmpty(value: any) {
  return value === null || (typeof value === 'object' && Object.keys(value).length === 0) // prettier-ignore
}

export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && value.constructor === Object // prettier-ignore
}

export function partition(by: By) {
  return (props: Props) => {
    const match: Props = {}
    const rest: Props = {}

    Object.keys(props).forEach(key => {
      const value = props[key]

      if (by(value, key, props)) {
        match[key] = value
      } else {
        rest[key] = value
      }
    })

    return [match, rest]
  }
}

export function compact(props: Props) {
  return partition(isEmpty)(props)[1]
}

export function replace(by: By) {
  const _replace = (props: Props, context: Props = props) => {
    let result: Props = {}

    for (const key in props) {
      const parsed = by(props[key], key, context)
      const value = typeof parsed === 'undefined' ? props[key] : parsed
      result[key] = isObject(value) ? _replace(value, context) : value
    }

    return result
  }

  return _replace
}

export function rename(aliases: { [key: string]: string }) {
  const _rename = (props: Props) => {
    const renamed: Props = {}

    Object.keys(props).forEach(key => {
      const value = props[key]
      const alias = key in aliases ? aliases[key] : key
      renamed[alias] = isObject(value) ? _rename(value) : value
    })

    return renamed
  }

  return _rename
}
