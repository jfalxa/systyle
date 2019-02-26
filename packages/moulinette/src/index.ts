import { Moulinette, System, Builder, Extension, Wrapper } from './types'
import { merge, flatten, compose, moulinettify } from './utils'

export function createSystem<S extends System>(
  builder: Builder,
  moulinettes: Moulinette[] = [],
  wrappers: Wrapper[] = [],
  extensions: Extension<any>[] = []
) {
  const moulinette: Moulinette = compose(moulinettes)
  const wrap: Wrapper = compose(wrappers)

  const System = wrap(builder(moulinette)) as S

  System.compute = moulinette

  System.with = (...extras) =>
    createSystem(builder, [...moulinettes, ...flatten(extras).map(moulinettify)], wrappers, extensions) // prettier-ignore

  System.wrap = (...extras) =>
    createSystem(builder, moulinettes, [...wrappers, ...extras], extensions)

  System.extend = extension =>
    createSystem(builder, moulinettes, wrappers, [...extensions, extension])

  extensions.forEach(extend => extend(System))

  return System
}

export { compose, merge }
export default createSystem
