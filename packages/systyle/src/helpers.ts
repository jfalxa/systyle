import { Props } from 'moulinette'

export function partitionBy(props: Props, by: (v: any, k: string) => boolean) {
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
