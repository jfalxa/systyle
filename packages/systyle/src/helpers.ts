import { Props } from 'moulinette/lib/types'
import { By } from './types'

const rxRules = /^(\&|\@|\:|\#|\.)/

export function isCSS(_: any, key: string) {
  if (rxRules.test(key)) return true

  return typeof document === 'undefined'
    ? require('known-css-properties').all.includes(require('kebab-case')(key))
    : key in document.body.style
}

export function isVoid(value: any) {
  return typeof value === 'undefined' || value === null
}

export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && value.constructor === Object // prettier-ignore
}

export function isEmpty(value: any) {
  return isVoid(value) || Object.keys(value).length === 0
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
  return partition(isVoid)(props)[1]
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

export function rename(aliases: { [key: string]: string | string[] }) {
  const _rename = (props: Props) => {
    const renamed: Props = {}

    Object.keys(props).forEach(key => {
      const value = props[key]
      const alias = key in aliases ? aliases[key] : key
      const renamedValue = isObject(value) ? _rename(value) : value

      if (Array.isArray(alias)) {
        alias.forEach(aliasKey => (renamed[aliasKey] = renamedValue))
      } else {
        renamed[alias] = renamedValue
      }
    })

    return renamed
  }

  return _rename
}
