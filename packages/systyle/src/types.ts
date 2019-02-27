import { Props, System, Moulinette } from 'moulinette/lib/types'

export type By = (value: any, key: string, context: Props) => any
export type TemplateArg = string | number | ((props: Props) => string | number)
export type CSSTemplate = [TemplateStringsArray, TemplateArg[]]

export interface Theme {
  spacing: number
  colors: { [key: string]: string }
  fonts: { [key: string]: string }
  sizes: { [key: string]: number | string }
  breakpoints: { [key: string]: number | string }
}

export interface StyledSystem extends System {
  computeCSS: Moulinette
  as(type: string | Function): this
  css(template: CSSTemplate[0], ...args: CSSTemplate[1]): this
  animate(duration: string, animation?: string): this
}
