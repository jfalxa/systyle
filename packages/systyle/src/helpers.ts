import { Props } from 'moulinette'

type By = (value: any, key: string) => boolean

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

export function pick(props: Props, by: By) {
  return partition(props, by)[0]
}

export function compact(props: Props) {
  return partition(props, isEmpty)[1]
}
