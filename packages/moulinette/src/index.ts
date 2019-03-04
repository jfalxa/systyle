import { Moulinette, System, Builder, Extension } from './types'
import { merge, flatten, compose, moulinettify } from './utils'

export function createSystem<C, S extends C & System>(
  builder: Builder<C>,
  moulinettes: Moulinette[] = [],
  extensions: Extension<any>[] = []
) {
  const moulinette: Moulinette = compose(moulinettes)

  const System = builder(moulinette) as S

  System.with = (...extras) =>
    createSystem(builder, [...moulinettes, ...flatten(extras).map(moulinettify)], extensions) // prettier-ignore

  System.extend = extension =>
    createSystem(builder, moulinettes, [...extensions, extension])

  extensions.forEach(extend => extend(System))

  return System
}

export { compose, merge }
export default createSystem
