const merge = require('deepmerge')

type Props = { [key: string]: any }
type Moulinette = (props: Props) => Props | null | void
type Declaration = Props | Moulinette
type Component = (props: Props, ...rest: any[]) => any
type Builder = (moulinette: Moulinette) => Component

interface System extends Component {
  moulinette: Moulinette
  with(declaration: Declaration): this
}

function identity<T>(value: T) {
  return value
}

function isMoulinette(value: any): value is Moulinette {
  return typeof value === 'function'
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
  return isMoulinette(declaration)
    ? declaration
    : props => merge(declaration, props)
}

export default function createSystem(
  builder: Builder = identity,
  moulinettes: Moulinette[] = []
) {
  const moulinette = compile(moulinettes)
  const System = builder(moulinette) as System

  System.moulinette = moulinette

  System.with = (declaration: Declaration) =>
    createSystem(builder, [...moulinettes, moulinettify(declaration)])

  return System
}
