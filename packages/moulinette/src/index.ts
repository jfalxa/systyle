const merge = require('deepmerge')

export type Props = { [key: string]: any }
export type Moulinette = (props: Props) => Props | null | void
export type Declaration = Props | Moulinette
export type Component = (props: Props, ...rest: any[]) => any
export type Builder = (moulinette: Moulinette) => Component

export interface System extends Component {
  moulinette: Moulinette
  with(...declarations: Declaration[]): this
}

function isProps(value: any): value is Props {
  return typeof value === 'object'
}

function compile(moulinettes: Moulinette[]): Moulinette {
  return input =>
    moulinettes.reduceRight((props, moulinette) => {
      const computed = moulinette(props)
      return isProps(computed) ? computed : props
    }, input)
}

function moulinettify(declaration: Declaration): Moulinette {
  return isProps(declaration) ? props => merge(declaration, props) : declaration
}

function createSystem<S extends System>(
  builder: Builder,
  moulinettes: Moulinette[] = []
) {
  const moulinette = compile(moulinettes)
  const System = builder(moulinette) as S

  System.moulinette = moulinette

  System.with = (...declarations) =>
    createSystem(builder, [...moulinettes, ...declarations.map(moulinettify)]) // prettier-ignore

  return System
}

export { createSystem, merge }
export default createSystem
