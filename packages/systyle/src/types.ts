export type Props = { [key: string]: any }
export type Moulinette = (props: Props) => Props | void
export type Builder<T> = (moulinette: Moulinette) => T
export type Declaration = Props | Moulinette
export interface Declarations extends Array<Declaration | Declarations> {}

export type By = (value: any, key: string, context: Props) => any
export type TemplateArg = string | number | ((props: Props) => string | number)

export interface Theme {
  spacing: number
  colors: { [key: string]: string }
  fonts: { [key: string]: string }
  sizes: { [key: string]: number | string }
  breakpoints: { [key: string]: number | string }
}

export interface StyledSystem {
  className: string
  with(...declarations: Declarations): this
  as(type: string | Function): this
  toString(): string
}
