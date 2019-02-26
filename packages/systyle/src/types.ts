import { Props, System, Moulinette } from 'moulinette/lib/types'

export type By = (value: any, key: string, context: Props) => any
export type CSSTemplate = [TemplateStringsArray, any[]]

export interface Theme {
  spacing: number
  colors: { [key: string]: string }
  fonts: { [key: string]: string }
  sizes: { [key: string]: number | string }
  breakpoints: { [key: string]: number | string }
}

export interface Styled extends System {
  computeCSS: Moulinette
  as(type: string | Function): this
  css(template: CSSTemplate[0], ...args: CSSTemplate[1]): this
  animate(duration: string, animation?: string): this
}
