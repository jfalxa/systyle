import { Moulinette, System, Builder, Extension } from './types'
import { merge, flatten, apply, moulinettify } from './utils'

export function compile(moulinettes: Moulinette[]): Moulinette {
  return input => moulinettes.reduceRight(apply, input)
}

export function createSystem<S extends System>(
  builder: Builder,
  moulinettes: Moulinette[] = [],
  extensions: Extension<any>[] = []
) {
  const moulinette = compile(moulinettes)
  const System = builder(moulinette) as S

  System.compute = moulinette

  System.with = (...declarations) =>
    createSystem(builder, [...moulinettes, ...flatten(declarations).map(moulinettify)], extensions) // prettier-ignore

  System.extend = extension =>
    createSystem(builder, moulinettes, [...extensions, extension])

  extensions.forEach(extend => extend(System))

  return System
}

export { merge }
export default createSystem
