export type Props = { [key: string]: any }
export type Moulinette = (props: Props) => Props | void
export type Component = (props: Props, ...rest: any[]) => any
export type Builder = (moulinette: Moulinette) => Component
export type Wrapper = (c: Component) => Component
export type Extension<E extends System> = (system: E) => void
export type Declaration = Props | Moulinette
export interface Declarations extends Array<Declaration | Declarations> {}

export interface System extends Component {
  compute: Moulinette
  with(...declarations: Declarations): this
  wrap(...wrappers: Wrapper[]): this
  extend<E extends this>(extension: Extension<E>): E
}
