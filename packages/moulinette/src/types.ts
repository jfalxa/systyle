export type Props = { [key: string]: any }
export type Moulinette = (props: Props) => Props | void
export type Builder<T> = (moulinette: Moulinette) => T
export type Extension<E> = (system: E) => void
export type Declaration = Props | Moulinette
export interface Declarations extends Array<Declaration | Declarations> {}

export interface System {
  compute: Moulinette
  with(...declarations: Declarations): this
  extend<E extends this>(extension: Extension<E>): E
}
