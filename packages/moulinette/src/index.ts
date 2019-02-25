import merge from 'deepmerge'
import flatten from 'array-flatten'

export type Props = { [key: string]: any }
export type Moulinette = (props: Props) => Props | void
export type Component = (props: Props, ...rest: any[]) => any
export type Builder = (moulinette: Moulinette) => Component
export type Extension<E extends System> = (system: E) => void
export type Declaration = Props | Moulinette
export interface Declarations extends Array<Declaration | Declarations> {}

export interface System extends Component {
  compute: Moulinette
  init(...declarations: Declarations): this
  with(...declarations: Declarations): this
  extend<E extends this>(extension: Extension<E>): E
}

function moulinettify(declaration: Declaration): Moulinette {
  return typeof declaration === 'object'
    ? props => merge(declaration, props)
    : declaration
}

function compile(moulinettes: Moulinette[]): Moulinette {
  return input =>
    moulinettes.reduceRight(
      (props, moulinette) => moulinette(props) || props,
      input
    )
}

function createSystem<S extends System>(
  builder: Builder,
  initializers: Moulinette[] = [],
  reducers: Moulinette[] = [],
  extensions: Extension<any>[] = []
) {
  const moulinette = compile([...reducers, ...initializers])
  const System = builder(moulinette) as S

  System.compute = moulinette

  System.init = (...declarations) =>
    createSystem(builder, [...initializers, ...flatten(declarations).map(moulinettify)], reducers, extensions) // prettier-ignore

  System.with = (...declarations) =>
    createSystem(builder, initializers, [...reducers, ...flatten(declarations).map(moulinettify)], extensions) // prettier-ignore

  System.extend = extension =>
    createSystem(builder, reducers, initializers, [...extensions, extension])

  extensions.forEach(extend => extend(System))

  return System
}

export { createSystem, compile, merge }
export default createSystem
