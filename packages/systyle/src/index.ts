import { createSystem, Props } from 'moulinette'
import { partitionBy } from './helpers'
import properties from './properties'

function isCSS(_: any, key: string) {
  return properties[key] === true
}

function pickCSS(input: Props) {
  const [css, ...props] = partitionBy(input)
}
