import { Props, Declaration, Moulinette } from './types'

export function isMergeable(value: any): value is Props {
  return value !== null && typeof value === 'object' && value.constructor === Object // prettier-ignore
}

export function flatten(arr: any[], res: any[] = []) {
  let i, cur
  const len = arr.length
  for (i = 0; i < len; i++) {
    cur = arr[i]
    Array.isArray(cur) ? flatten(cur, res) : res.push(cur)
  }
  return res
}

export function merge(target: any, source: any) {
  if (!isMergeable(target) || !isMergeable(source)) return source

  const merged: any = { ...target }
  for (const key in source) {
    merged[key] = merge(target[key], source[key])
  }
  return merged
}

export function moulinettify(declaration: Declaration): Moulinette {
  return isMergeable(declaration)
    ? props => merge(declaration, props)
    : declaration
}

export function apply(props: Props, moulinette: Moulinette) {
  return moulinette(props) || props
}
